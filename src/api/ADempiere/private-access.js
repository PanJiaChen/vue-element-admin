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

import { convertPrivateAccess } from '@/utils/ADempiere/apiConverts/privateAccess.js'

// Get private access for a record
export function requestGetPrivateAccess({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/ui/get-private-access',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(responsePrivateAccess => {
      return convertPrivateAccess(responsePrivateAccess)
    })
}

// Lock a record for a user
export function requestLockPrivateAccess({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/ui/lock-private-access',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(responsePrivateAccess => {
      return convertPrivateAccess(responsePrivateAccess)
    })
}

// Unlock a record from a user
export function requestUnlockPrivateAccess({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/ui/unlock-private-access',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(responsePrivateAccess => {
      return convertPrivateAccess(responsePrivateAccess)
    })
}

/**
 * List Rol Access Record
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {string}  sessionUuid
 */
export function getAccessList({
  tableName,
  recordId,
  recordUuid,
  sessionUuid
}) {
  return request({
    url: '/ui/update-access-record',
    method: 'post',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      token: sessionUuid
    }
  })
    .then(respose => {
      return respose
    })
}

/**
 * Update Access Record
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}  listRol
 */
export function updateAccessRecord({
  tableName,
  recordId,
  recordUuid,
  listRecord
}) {
  return request({
    url: '/ui/update-access-record',
    method: 'post',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      list_rol: listRecord
    }
  })
    .then(response => {
      return response
    })
}
