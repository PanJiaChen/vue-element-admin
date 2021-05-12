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

// Get private access for a record
export function getPrivateAccess({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/component/private-access/private-access',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(responsePrivateAccess => {
      return {
        tableName: responsePrivateAccess.table_name,
        recordId: responsePrivateAccess.record_id,
        recordUuid: responsePrivateAccess.record_uuid
      }
    })
}

// Lock a record for a user
export function lockPrivateAccess({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/component/private-access/lock-private-access',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(responsePrivateAccess => {
      return {
        tableName: responsePrivateAccess.table_name,
        recordId: responsePrivateAccess.record_id,
        recordUuid: responsePrivateAccess.record_uuid
      }
    })
}

// Unlock a record from a user
export function unlockPrivateAccess({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/component/private-access/unlock-private-access',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(responsePrivateAccess => {
      return {
        tableName: responsePrivateAccess.table_name,
        recordId: responsePrivateAccess.record_id,
        recordUuid: responsePrivateAccess.record_uuid
      }
    })
}
