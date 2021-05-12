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
 * List Rol Access Record
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {string}  sessionUuid
 */
export function getRecordAccess({
  tableName,
  recordId,
  recordUuid
}) {
  return new Promise(resolve => {
    request({
      url: '/user-interface/component/record-access/record-access',
      method: 'get',
      params: {
        table_name: tableName,
        id: recordId,
        uuid: recordUuid
      }
    })
      .then(respose => {
        resolve(convertRecordAccess(respose))
      })
  })
}

/**
 * Update Access Record
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}  listRol
 */
export function setRecordAccess({
  recordId,
  recordUuid,
  tableName,
  recordAccesses
}) {
  return request({
    url: '/user-interface/component/record-access/set-record-access',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      record_accesses: recordAccesses.map(access => {
        return {
          role_id: access.roleId,
          role_uuid: access.roleUuid,
          role_name: access.roleName,
          is_active: access.isActive,
          is_exclude: access.isExclude,
          is_read_only: access.isReadOnly,
          is_dependent_entities: access.isDependentEntities
        }
      })
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Convert stub from request
 * @param {Record Access} recordAccess
 * @returns
 */
function convertRecordAccess(recordAccess) {
  return {
    tableName: recordAccess.table_name,
    id: recordAccess.id,
    uuid: recordAccess.uuid,
    availableRoles: recordAccess.available_roles.map(role => {
      return convertRecordAccessRole(role)
    }),
    currentRoles: recordAccess.current_roles.map(role => {
      return convertRecordAccessRole(role)
    })
  }
}

/**
 * Convert role definition
 */
function convertRecordAccessRole(recordAccessRole) {
  if (recordAccessRole) {
    return {
      roleId: recordAccessRole.role_id,
      roleUuid: recordAccessRole.role_uuid,
      roleName: recordAccessRole.role_name,
      isActive: recordAccessRole.is_active,
      isExclude: recordAccessRole.is_exclude,
      isReadOnly: recordAccessRole.is_read_only,
      isDependentEntities: recordAccessRole.is_dependent_entities
    }
  }
  return undefined
}
