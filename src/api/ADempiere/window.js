// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

// Get list of log for a records
export function requestListRecordsLogs({
  tableName,
  recordId,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListRecordsLogs({
    tableName,
    recordId,
    pageToken,
    pageSize
  })
}

// Get workflow log for a record
export function requestListWorkflowsLogs({
  tableName,
  recordId,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListWorkflowsLogs({
    tableName,
    recordId,
    pageToken,
    pageSize
  })
}

// Get workflow list for a document
export function requestListWorkflows({
  tableName,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListWorkflows({
    tableName,
    pageToken,
    pageSize
  })
}

/**
 * @param {string}  tableName
 * @param {integer} recordId
 * @param {string}  pageToken
 * @param {string}  pageSize
 */
export function requestListRecordChats({ tableName, recordId, pageToken, pageSize }) {
  return Instance.call(this).requestListRecordChats({
    tableName,
    recordId,
    pageToken,
    pageSize
  })
}

/**
 * @param {string} uuid
 * @param {string} pageToken
 * @param {string} pageSize
 */
export function requestListChatEntries({ uuid, pageToken, pageSize }) {
  return Instance.call(this).requestListChatEntries({
    uuid,
    pageToken,
    pageSize
  })
}

/**
 * @param {string} tableName
 * @param {string} recordId
 * @param {string} comment
 */
export function requestCreateChatEntry({ tableName, recordId, comment }) {
  return Instance.call(this).requestCreateChatEntry({
    tableName,
    recordId,
    comment
  })
}

/**
 * Request Document Status List
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} recordUuid
 * @param {string} documentStatus
 * @param {string} documentAction
 * @param {number} pageSize
 * @param {string} pageToken
 */
export function requestListDocumentStatuses({ tableName, recordId, recordUuid, documentStatus, documentAction, pageSize, pageToken }) {
  return Instance.call(this).requestListDocumentStatuses({
    tableName,
    recordId,
    recordUuid,
    documentStatus,
    documentAction,
    pageSize,
    pageToken
  })
}

// Request a document action list from current status of document
export function requestListDocumentActions({ tableName, recordId, recordUuid, documentStatus, documentAction, pageSize, pageToken }) {
  return Instance.call(this).requestListDocumentActions({
    tableName,
    recordId,
    recordUuid,
    documentStatus,
    documentAction,
    pageSize,
    pageToken
  })
}
