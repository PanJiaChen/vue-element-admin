// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

/**
 * Request a Lookup data from Reference
 * The main attributes that function hope are:
 * @param {string} tableName
 * @param {string} directQuery
 * @param {string|number} value
 */
export function getLookup({
  tableName,
  directQuery,
  value
}) {
  return Instance.call(this).requestLookupFromReference({
    tableName,
    directQuery,
    value
  })
}

/**
 * Request a Lookup list data from Reference
 * The main attributes that function hope are:
 * @param {string} tableName
 * @param {string} query
 */
export function getLookupList({
  tableName,
  query,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListLookupFromReference({
    tableName,
    query,
    pageToken,
    pageSize
  })
}

/**
 * Reference List from Window
 * @param {string}  tableName
 * @param {string}  windowUuid
 * @param {string}  recordUuid
 * @param {number}  recordId
 */
export function getReferencesList({ windowUuid, tableName, recordId, recordUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListReferences({
    windowUuid,
    tableName,
    recordId,
    recordUuid,
    pageToken,
    pageSize
  })
}

// Get default value for a field
export function getDefaultValueFromServer(query) {
  return Instance.call(this).requestGetDefaultValue(query)
}

// Get context information for a window, tab or field
export function getContextInfoValueFromServer({ uuid, query }) {
  return Instance.call(this).requestGetContextInfoValue({ uuid, query })
}
