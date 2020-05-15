// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

// Get private access for a record
export function getPrivateAccessFromServer({ tableName, recordId, userUuid }) {
  return Instance.call(this).requestGetPrivateAccess({
    tableName,
    recordId,
    userUuid
  })
}

// Lock a record for a user
export function lockPrivateAccessFromServer({ tableName, recordId, userUuid }) {
  return Instance.call(this).requestLockPrivateAccess({
    tableName,
    recordId,
    userUuid
  })
}

// Unlock a record from a user
export function unlockPrivateAccessFromServer({ tableName, recordId, userUuid }) {
  return Instance.call(this).requestUnlockPrivateAccess({
    tableName,
    recordId,
    userUuid
  })
}
