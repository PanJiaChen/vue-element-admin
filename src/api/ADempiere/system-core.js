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

/**
 * Get Country definition from server using id or uuid for record
 * @param {string} uuid
 * @param {number} id
 */
export function getCountryDefinition({ uuid, id }) {
  return SystemCoreInstance.call(this).requestGetCountry({
    uuid,
    id
  })
}

// Get languages from api
export function listLanguages({ pageToken, pageSize }) {
  return Instance.call(this).requestListLanguages({ pageToken, pageSize })
}

export function requestCreateBusinessPartner({
  value,
  taxId,
  duns,
  naics,
  name,
  lastName,
  description,
  contactName,
  eMail,
  phone,
  businessPartnerGroupUuid,
  // Location
  address1,
  address2,
  address3,
  address4,
  cityUuid,
  cityName,
  postalCode,
  regionUuid,
  regionName,
  countryUuid,
  posUuid
}) {
  return SystemCoreInstance.call(this).requestCreateBusinessPartner({
    value,
    taxId,
    duns,
    naics,
    name,
    lastName,
    description,
    contactName,
    eMail,
    phone,
    businessPartnerGroupUuid,
    // Location
    address1,
    address2,
    address3,
    address4,
    cityUuid,
    cityName,
    postalCode,
    regionUuid,
    regionName,
    countryUuid,
    posUuid
  })
}

export function requestGetBusinessPartner({
  searchValue
}) {
  return SystemCoreInstance.call(this).requestGetBusinessPartner({
    searchValue
  })
}

export function requestListBusinessPartner({
  searchValue,
  value,
  name,
  contactName,
  eMail,
  postalCode,
  phone,
  // Query
  criteria,
  pageSize,
  pageToken
}) {
  return SystemCoreInstance.call(this).requestListBusinessPartner({
    searchValue,
    value,
    name,
    contactName,
    eMail,
    postalCode,
    phone,
    // Query
    criteria,
    pageSize,
    pageToken
  })
}
