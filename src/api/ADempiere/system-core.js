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

// Get Organization list from role
export function requestOrganizationsList({
  roleUuid,
  roleId,
  pageToken,
  pageSize
}) {
  return request({
    url: '/common/organizations',
    method: 'get',
    params: {
      role_id: roleId,
      role_uuid: roleUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
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
  return request({
    url: '/common/warehouses',
    method: 'get',
    params: {
      organization_id: organizationId,
      organization_uuid: organizationUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
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
  return request({
    url: '/common/country',
    method: 'get',
    params: {
      id,
      uuid
    }
  })
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
  return request({
    url: '/common/languages',
    method: 'get',
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
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
  name2,
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
  return request({
    url: '/common/create-business-partner',
    method: 'post',
    data: {
      value,
      tax_id: taxId,
      duns,
      naics,
      name,
      last_name: name2,
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
    .then(businessPartnerResponse => {
      const { convertBusinessPartner } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertBusinessPartner(businessPartnerResponse)
    })
}

export function requestGetBusinessPartner({
  searchValue
}) {
  return request({
    url: '/common/business-partner',
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
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
  return request({
    url: '/common/business-partners',
    method: 'get',
    params: {
      search_value: searchValue,
      value,
      name,
      contact_name: contactName,
      e_mail: eMail,
      phone,
      // Location
      postal_code: postalCode,
      page_size: pageSize,
      page_token: pageToken
    }
  })
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
  return request({
    url: '/common/conversion-rate',
    method: 'get',
    params: {
      conversion_type_uuid: conversionTypeUuid,
      currency_from_uuid: currencyFromUuid,
      currency_to_uuid: currencyToUuid,
      conversion_date: conversionDate
    }
  })
    .then(conversionRateResponse => {
      const { convertConversionRate } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertConversionRate(conversionRateResponse)
    })
}
