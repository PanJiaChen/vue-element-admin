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
import { request } from '@/utils/ADempiere/request'

// List Point of sales
export function requestGetProductPrice({
  searchValue,
  upc,
  value,
  name,
  priceListUuid,
  businessPartnerUuid,
  warehouseUuid,
  validFrom
}) {
  return request({
    url: '/form/addons/point-of-sales/product-price',
    method: 'get',
    params: {
      search_value: searchValue,
      upc,
      value,
      name,
      price_list_uuid: priceListUuid,
      business_partner_uuid: businessPartnerUuid,
      warehouse_uuid: warehouseUuid,
      valid_from: validFrom
    }
  })
    .then(productPriceResponse => {
      const { convertProductPrice } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertProductPrice(productPriceResponse)
    })
}
