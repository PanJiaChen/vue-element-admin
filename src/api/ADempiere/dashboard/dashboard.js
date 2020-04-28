// This file is for get all information for dashboard of ADempiere client,
// please if you want to implement a custom dashboard create a new fielwith api definition
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

// Request a Process Activity list
export function requestListProcessesLogs({ pageToken, pageSize }) {
  //  Get Process Activity
  return Instance.call(this).requestListProcessesLogs({ pageToken, pageSize })
}

// Get Recent Items based on selection option
export function getRecentItems({ pageToken, pageSize }) {
  return Instance.call(this).requestListRecentItems({ pageToken, pageSize })
}

/**
 * Request Favorites List
 * @param {string} userUuid
 */
export function getFavoritesFromServer({ userUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListFavorites({ userUuid, pageToken, pageSize })
}

// Get pending documents
export function getPendingDocumentsFromServer({ userUuid, roleUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListPendingDocuments({
    userUuid,
    roleUuid,
    pageToken,
    pageSize
  })
}

// List all dashboard for role
export function requestLisDashboards({ roleUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListDashboards({
    roleUuid,
    pageToken,
    pageSize
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
