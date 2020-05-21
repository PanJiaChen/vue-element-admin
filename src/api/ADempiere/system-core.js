// Get Instance for connection
import { BusinessDataInstance as Instance, SystemCoreInstance } from '@/api/ADempiere/instances.js'

/**
 * Checks if value is empty. Deep-checks arrays and objects
 * Note: isEmpty([]) == true, isEmpty({}) == true, isEmpty([{0:false},"",0]) == true, isEmpty({0:1}) == false
 * @param  {boolean|array|object|number|string|date|map|set|function} value
 * @returns {boolean}
 */
export function isEmptyValue(value) {
  const { isEmptyValue } = require('@adempiere/grpc-core-client/src/convertValues.js')

  return isEmptyValue(value)
}

// Get Organization list from role
export function getOrganizationsList({
  roleUuid,
  roleId,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListOrganizations({
    roleUuid,
    roleId,
    pageToken,
    pageSize
  })
}

// Get Warehouses of Organization
export function getWarehousesList({
  organizationUuid,
  organizationId,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListWarehouses({
    organizationUuid,
    organizationId,
    pageToken,
    pageSize
  })
}

// Get Country definition from server using id or uuid for record
export function getCountryDefinition({ countryUuid, countryId }) {
  return SystemCoreInstance.call(this).requestGetCountry({
    countryUuid,
    countryId
  })
}

// Get languages from api
export function listLanguages({ pageToken, pageSize }) {
  return Instance.call(this).requestListLanguages({ pageToken, pageSize })
}
