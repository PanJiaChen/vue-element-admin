// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

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
