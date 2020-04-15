import { getLanguage } from '@/lang/index'
import { getToken } from '@/utils/auth'
import POS from '@adempiere/grpc-pos-client'
import { BUSINESS_DATA_ADDRESS } from '@/api/ADempiere/constants'

// Get Instance for connection
function Instance() {
  return new POS(
    BUSINESS_DATA_ADDRESS,
    getToken(),
    getLanguage() || 'en_US'
  )
}

export function getProductPrice({
  searchValue,
  upc,
  value,
  name,
  priceListUuid,
  businessPartnerUuid,
  warehouseUuid,
  validFrom
}) {
  return Instance.call(this).getProductPrice({
    searchValue,
    upc,
    value,
    name,
    priceListUuid,
    businessPartnerUuid,
    warehouseUuid,
    validFrom
  })
}
