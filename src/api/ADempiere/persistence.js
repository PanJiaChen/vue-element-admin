// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Create entity
 * @param {string}  tableName
 * @param {array}   attributesList
 */
export function requestCreateEntity({
  tableName,
  attributesList
}) {
  attributesList = attributesList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    url: '/data/create',
    method: 'post',
    data: {
      table_name: tableName,
      attributes: attributesList
    }
  })
    .then(entityCreateResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityCreateResponse)
    })
}

/**
 * Update entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}   attributesList
 */
export function requestUpdateEntity({
  tableName,
  recordId,
  recordUuid,
  attributesList
}) {
  attributesList = attributesList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    url: '/data/update',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      attributes: attributesList
    }
  })
    .then(entityUpdateResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityUpdateResponse)
    })
}

/**
 * Delete entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function requestDeleteEntity({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/data/delete',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  }).then(response => {
    return response
  })
}

/**
 * Rollback entity (Create, Update, Delete)
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} eventType
 */
export function rollbackEntity({
  tableName,
  recordId,
  recordUuid,
  eventType
}) {
  return request({
    url: '/data/rollback-entity',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      event_type: eventType
    }
  })
    .then(entityResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityResponse)
    })
}

// Get entity from table name and record id or record uuid
export function requestGetEntity({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/data/entity',
    method: 'get',
    params: {
      table_name: tableName,
      uuid: recordUuid,
      id: recordId
    }
  })
    .then(entityResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityResponse)
    })
}

/**
 * Object List from window
 * @param {string} tableName
 * @param {string} query
 * @param {string} whereClause
 * @param {array}  conditionsList
 * @param {array}  columnsList // TODO: Add support on adempiere-vue
 * @param {string} orderByClause
 * @param {string} pageToken
 */
export function requestListEntities({
  tableName,
  query,
  whereClause,
  conditionsList = [],
  columnsList = [],
  orderByClause,
  limit,
  pageToken,
  pageSize
}) {
  const filters = conditionsList.map(condition => {
    const { value, operator, columnName, valueTo, values } = condition
    return {
      column_name: columnName,
      value,
      operator,
      value_to: valueTo,
      values
    }
  })

  return request({
    url: '/data/list',
    method: 'post',
    data: {
      table_name: tableName,
      // DSL Query
      filters,
      columns: columnsList,
      // Custom Query
      query,
      where_clause: whereClause,
      order_by_clause: orderByClause,
      limit
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(entitiesListResponse => {
      const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntityList(entitiesListResponse)
    })
}

/**
 * Request translations
 * @param {string} tableName
 * @param {string} language
 * @param {string} recordUuid
 * @param {number} recordId
 */
export function requestTranslations({
  tableName,
  language,
  recordUuid,
  recordId,
  pageToken,
  pageSize
}) {
  return request({
    url: '/ui/list-translations',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    },
    params: {
      language,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(languageListResponse => {
      const { convertTranslation } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return {
        nextPageToken: languageListResponse.next_page_token,
        recordCount: languageListResponse.record_count,
        translationsList: languageListResponse.records.map(record => {
          return convertTranslation(record)
        })
      }
    })
}

// Download a resource from file name
export function requestResource({ resourceUuid }, callBack = {
  onData: () => {},
  onStatus: () => {},
  onEnd: () => {}
}) {
  const stream = request({
    url: '/resource',
    method: 'get',
    params: {
      resource_uuid: resourceUuid
    }
  })

  stream.on('data', (response) => callBack.onData(response))
  stream.on('status', (status) => callBack.onStatus(status))
  stream.on('end', (end) => callBack.onEnd(end))

  return stream
}

/**
 * Get image with uri request
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @author Elsio15 <elsiiosanches@gmail.com>
 * @param {string} file
 * @param {number} width
 * @param {number} height
 * @param {string} operation fit, resize
 * @returns {promise} with array buffer in response
 */
export function requestImage({
  file,
  width,
  height,
  operation = 'fit'
}) {
  const { getImagePath } = require('@/utils/ADempiere/resource.js')

  const { urn } = getImagePath({
    file,
    width,
    height,
    operation
  })

  return request({
    url: urn,
    method: 'get',
    responseType: 'arraybuffer'
  })
}
