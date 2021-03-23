// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/api/ADempiere/instances.js'
import { convertPrivateAccess } from '@/utils/ADempiere/apiConverts/privateAccess.js'

// Get private access for a record
export function requestGetPrivateAccess({
  tableName,
  recordId,
  recordUuid
}) {
  return requestRest({
    url: '/ui/get-private-access',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/ui/lock-private-access',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/ui/unlock-private-access',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/ui/update-access-record',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      token: sessionUuid
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/ui/update-access-record',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      list_rol: listRecord
    }
  })
    .then(evaluateResponse)
}
