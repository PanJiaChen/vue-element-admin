import { getLanguage } from '@/lang/index'
import BusinessData from '@adempiere/grpc-data-client'
import { BUSINESS_DATA_ADDRESS } from '@/api/ADempiere/constants'
import { getToken, getCurrentOrganization, getCurrentWarehouse } from '@/utils/auth'

// Get Instance for connection
function Instance() {
  return new BusinessData({
    host: BUSINESS_DATA_ADDRESS,
    sessionUuid: getToken(),
    organizationUuid: getCurrentOrganization(),
    warehouseUuid: getCurrentWarehouse(),
    language: getLanguage() || 'en_US'
  })
}

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
