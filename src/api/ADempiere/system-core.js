// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/api/ADempiere/instances.js'

// Get Organization list from role
export function requestOrganizationsList({
  roleUuid,
  roleId,
  pageToken,
  pageSize
}) {
  return requestRest({
    url: '/core/list-organizations',
    data: {
      role_id: roleId,
      role_uuid: roleUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then(organizationsListResponse => {
      const { convertOrganization } = require('@/utils/ADempiere/apiConverts/core.js')

      return {
        nextPageToken: organizationsListResponse.next_page_token,
        recordCount: organizationsListResponse.record_count,
        organizationsList: organizationsListResponse.records.map(organization => {
          return convertOrganization(organization)
        })
      }
    })
}

// Get Warehouses of Organization
export function requestWarehousesList({
  organizationUuid,
  organizationId,
  pageToken,
  pageSize
}) {
  return requestRest({
    url: '/core/list-warehouses',
    data: {
      organization_id: organizationId,
      organization_uuid: organizationUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then(warehousesListResponse => {
      return {
        nextPageToken: warehousesListResponse.next_page_token,
        recordCount: warehousesListResponse.record_count,
        warehousesList: warehousesListResponse.records
      }
    })
}

/**
 * Get Country definition from server using id or uuid for record
 * @param {string} uuid
 * @param {number} id
 */
export function requestGetCountryDefinition({
  id,
  uuid
}) {
  return requestRest({
    url: '/core/country',
    method: 'get',
    params: {
      id,
      uuid
    }
  })
    .then(evaluateResponse)
    .then(countryResponse => {
      const { convertCountry } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertCountry(countryResponse)
    })
}

// Get languages from api
export function requestLanguagesList({
  pageToken,
  pageSize
}) {
  return requestRest({
    url: '/core/list-languages',
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then(languagesListResponse => {
      const { convertLanguage } = require('@/utils/ADempiere/apiConverts/core.js')

      return {
        nextPageToken: languagesListResponse.next_page_token,
        recordCount: languagesListResponse.record_count,
        languagesList: languagesListResponse.records.map(language => {
          return convertLanguage(language)
        })
      }
    })
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
  return requestRest({
    url: '/core/create-business-partner',
    data: {
      value,
      tax_id: taxId,
      duns,
      naics,
      name,
      last_name: lastName,
      description,
      contact_name: contactName,
      e_mail: eMail,
      phone,
      business_partner_group_uid: businessPartnerGroupUuid,
      // Location
      address1,
      address2,
      address3,
      address4,
      city_uuid: cityUuid,
      city_name: cityName,
      postal_code: postalCode,
      region_uuid: regionUuid,
      region_name: regionName,
      country_uuid: countryUuid,
      pos_uuid: posUuid
    }
  })
    .then(evaluateResponse)
    .then(businessPartnerResponse => {
      const { convertBusinessPartner } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertBusinessPartner(businessPartnerResponse)
    })
}

export function requestGetBusinessPartner({
  searchValue
}) {
  return requestRest({
    url: '/core/get-business-partner',
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
    .then(evaluateResponse)
    .then(businessPartnerResponse => {
      const { convertBusinessPartner } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertBusinessPartner(businessPartnerResponse)
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
  // criteria,
  pageSize,
  pageToken
}) {
  return requestRest({
    url: '/core/list-business-partner',
    data: {
      search_value: searchValue,
      value,
      name,
      contact_name: contactName,
      e_mail: eMail,
      phone,
      // Location
      postal_code: postalCode
    },
    params: {
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(evaluateResponse)
    .then(businessPartnerResponse => {
      const { convertBusinessPartner } = require('@/utils/ADempiere/apiConverts/core.js')

      return {
        nextPageToken: businessPartnerResponse.next_page_token,
        recordCount: businessPartnerResponse.record_count,
        businessPartnersList: businessPartnerResponse.records.map(businessPartner => {
          return convertBusinessPartner(businessPartner)
        })
      }
    })
}

/**
 * TODO: Add uuid support
 * @param {string} conversionTypeUuid
 * @param {string} currencyFromUuid
 * @param {string} currencyToUuid
 * @param {date}   conversionDate
 * @returns {promise}
 */
export function requestGetConversionRate({
  conversionTypeUuid,
  currencyFromUuid,
  currencyToUuid,
  conversionDate
}) {
  return requestRest({
    url: '/core/get-conversion-rate',
    data: {
      conversion_type_uuid: conversionTypeUuid,
      currency_from_uuid: currencyFromUuid,
      currency_to_uuid: currencyToUuid,
      conversion_date: conversionDate
    }
  })
    .then(evaluateResponse)
    .then(conversionRateResponse => {
      const { convertConversionRate } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertConversionRate(conversionRateResponse)
    })
}
