// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/api/ADempiere/instances.js'

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

  return requestRest({
    url: '/data/create',
    data: {
      table_name: tableName,
      attributes: attributesList
    }
  })
    .then(evaluateResponse)
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

  return requestRest({
    url: '/data/update',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      attributes: attributesList
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/data/delete',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  }).then(evaluateResponse)
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
  return requestRest({
    url: '/data/rollback-entity',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      event_type: eventType
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/data/entity',
    method: 'get',
    params: {
      table_name: tableName,
      uuid: recordUuid,
      id: recordId
    }
  })
    .then(evaluateResponse)
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

  return requestRest({
    url: '/data/list',
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
    .then(evaluateResponse)
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
  return requestRest({
    url: '/ui/list-translations',
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
    .then(evaluateResponse)
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
  const stream = requestRest({
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
 * @param {string} file
 * @param {number} width
 * @param {number} height
 * @param {string} operation fit, resize
 * @returns {promise} with array buffer in response
 */
export function requestImage({
  file,
  width = 300,
  height = 300,
  operation = 'fit'
}) {
  const { getImagePath } = require('@/utils/ADempiere/resource.js')

  const { urn } = getImagePath({
    file,
    width,
    height,
    operation
  })

  return requestRest({
    url: urn,
    method: 'get',
    responseType: 'arraybuffer'
  })
}
