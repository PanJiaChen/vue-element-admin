// Get Instance for connection
import request from '@/utils/request'
import { config } from '@/utils/ADempiere/config'

import { convertPrivateAccess } from '@/utils/ADempiere/apiConverts/privateAccess.js'

// Get private access for a record
export function requestGetPrivateAccess({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    baseURL: config.adempiere.api.url,
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
    baseURL: config.adempiere.api.url,
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
    baseURL: config.adempiere.api.url,
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
    baseURL: config.adempiere.api.url,
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
    baseURL: config.adempiere.api.url,
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
