import { getLanguage } from '@/lang/index'
import BusinessData from '@adempiere/grpc-data-client'
import { BUSINESS_DATA_ADDRESS } from '@/api/ADempiere/constants'
import { getToken, getCurrentOrganization, getCurrentWarehouse } from '@/utils/auth'

// Get Instance for connection
function Instance() {
  return new BusinessData({
    host: BUSINESS_DATA_ADDRESS,
    sessionUuid: getToken(),
    organizationUuid: getCurrentOrganization(),
    warehouseUuid: getCurrentWarehouse(),
    language: getLanguage() || 'en_US'
  })
}

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
