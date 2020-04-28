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

/**
 * Request a browser search
 * @param {string} uuid
 * @param {string} query
 * @param {string} whereClause
 * @param {string} orderByClause
 * @param {string} nextPageToken
 * @param {array}  parametersList, This allows follow structure:
 * [{
 *     columnName,
 *     value
 * }]
 */
export function getBrowserSearch({ uuid, parametersList = [], query, whereClause, orderByClause, nextPageToken: pageToken, pageSize }) {
  //  Run browser
  return Instance.call(this).requestListBrowserSearch({
    uuid,
    parametersList,
    query,
    whereClause,
    orderByClause,
    pageToken,
    pageSize
  })
}
