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
 * Get Attachment
 * @param {number}  resourceId
 * @param {string}  resourceUuid // TODO: Add suppport to resource uuid on backend
 */
export function requestResourceReference({
  resourceId,
  resourceUuid
}) {
  return request({
    url: '/user-interface/common/resource-reference',
    method: 'get',
    params: {
      resource_id: resourceId,
      resource_uuid: resourceUuid
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Get Attachment
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function requestAttachment({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/common/attachment',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(respose => {
      return respose
    })
}
