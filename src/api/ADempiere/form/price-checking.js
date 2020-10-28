// Get Instance for connectionimport {
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/api/ADempiere/instances.js'

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
  return requestRest({
    url: '/pos/get-product-price',
    data: {
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
    .then(evaluateResponse)
    .then(productPriceResponse => {
      const { convertProductPrice } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertProductPrice(productPriceResponse)
    })
}
