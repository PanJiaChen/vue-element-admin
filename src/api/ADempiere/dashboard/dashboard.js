// This file is for get all information for dashboard of ADempiere client,
// please if you want to implement a custom dashboard create a new fielwith api definition

// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

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
