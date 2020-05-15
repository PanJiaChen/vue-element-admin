// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

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
  return Instance.call(this).requestGetCountry({
    countryUuid,
    countryId
  })
}

// Get languages from api
export function listLanguages({ pageToken, pageSize }) {
  return Instance.call(this).requestListLanguages({ pageToken, pageSize })
}
