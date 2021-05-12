// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Request a browser search
 * @param {string} uuid
 * @param {string} tableName
 * @param {array}  parametersList, This allows follow structure:
 *   [{
 *      columnName,
 *      key
 *   }]
 * @param {array}  filters
 * @param {array}  columns
 * @param {string} query
 * @param {string} whereClause
 * @param {number} limit
 * @param {string} orderByClause
 * @param {string} nextPageToken
 */
export function requestBrowserSearch({
  uuid,
  parametersList = [],
  tableName,
  query,
  whereClause,
  orderByClause,
  limit,
  nextPageToken: pageToken,
  pageSize
}) {
  const filters = parametersList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value,
      values: parameter.values
    }
  })

  return request({
    url: '/user-interface/smart-browser/browser-items',
    data: {
      // Running Parameters
      uuid,
      table_name: tableName,
      // DSL Query
      filters,
      // Custom Query
      query,
      where_clause: whereClause,
      order_by_clause: orderByClause,
      limit
    },
    params: {
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(responseBrowserSearch => {
      const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntityList(responseBrowserSearch)
    })
}
