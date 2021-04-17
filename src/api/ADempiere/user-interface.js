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
 * @param {number}  recordId
 * @param {string}  recordUuid // TODO: Add suppport to record uuid on backend
 */
export function requestResourceReference({
  recordId,
  recordUuid
}) {
  return request({
    url: '/ui/resource-reference',
    method: 'get',
    params: {
      image_id: recordId,
      image_uuid: recordUuid
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
    url: '/ui/attachment',
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
