// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

/**
 * Create entity
 * @param {string}  tableName
 * @param {array}   attributesList
 */
export function createEntity({ tableName, attributes }) {
  return Instance.call(this).requestCreateEntity({
    tableName,
    attributesList: attributes
  })
}

/**
 * Update entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}   attributesList
 */
export function updateEntity({ tableName, recordId, recordUuid, attributes }) {
  return Instance.call(this).requestUpdateEntity({
    tableName,
    recordId,
    recordUuid,
    attributesList: attributes
  })
}

/**
 * Delete entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function deleteEntity({ tableName, recordId, recordUuid }) {
  return Instance.call(this).requestDeleteEntity({
    tableName,
    recordId,
    recordUuid
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
  eventType
}) {
  return Instance.call(this).requestRollbackEntity({
    tableName,
    recordId,
    eventTypeExecuted: eventType
  })
}

// Get entity from table name and record id or record uuid
export function getEntity({ tableName, recordId, recordUuid }) {
  return Instance.call(this).requestGetEntity({
    tableName,
    recordId,
    recordUuid
  })
}

/**
 * Object List from window
 * @param {string} tableName
 * @param {string} query
 * @param {string} whereClause
 * @param {array}  conditionsList
 * @param {string} orderByClause
 * @param {string} pageToken
 */
export function getEntitiesList({
  tableName,
  query,
  whereClause,
  conditionsList = [],
  orderByClause,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListEntities({
    tableName,
    query,
    whereClause,
    conditionsList,
    orderByClause,
    pageToken,
    pageSize
  })
}

/**
 * Request translations
 * @param {string} tableName
 * @param {string} language
 * @param {string} recordUuid
 * @param {integer} recordId
 */
export function requestTranslations({ tableName, language, recordUuid, recordId, pageToken, pageSize }) {
  return Instance.call(this).requestListTranslations({
    tableName,
    recordUuid,
    recordId,
    language,
    pageToken,
    pageSize
  })
}
