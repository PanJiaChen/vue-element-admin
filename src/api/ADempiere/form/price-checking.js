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

// Get Instance for connectionimport {
import { isEmptyValue } from '@/utils/ADempiere'
import { request } from '@/utils/ADempiere/request'
import { config } from '@/utils/ADempiere/config'

// List Point of sales
export function getProductPrice({
  searchValue,
  upc,
  value,
  name,
  posUuid,
  businessPartnerUuid,
  validFrom
}) {
  return request({
    url: `${config.priceChecking.endpoint}/product-price`,
    method: 'get',
    params: {
      search_value: searchValue,
      upc,
      value,
      name,
      pos_uuid: posUuid,
      business_partner_uuid: businessPartnerUuid,
      valid_from: validFrom
    }
  })
    .then(productPriceResponse => {
      const { convertProductPrice } = require('@/utils/ADempiere/apiConverts/core.js')
      if (isEmptyValue(productPriceResponse)) {
        return productPriceResponse
      }
      return convertProductPrice(productPriceResponse)
    })
}
