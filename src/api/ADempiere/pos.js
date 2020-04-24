import { getLanguage } from '@/lang/index'
import { getToken, getCurrentOrganization, getCurrentWarehouse } from '@/utils/auth'
import POS from '@adempiere/grpc-pos-client'
import { BUSINESS_DATA_ADDRESS } from '@/api/ADempiere/constants'

// Get Instance for connection
function Instance() {
  return new POS({
    host: BUSINESS_DATA_ADDRESS,
    sessionUuid: getToken(),
    organizationUuid: getCurrentOrganization(),
    warehouseUuid: getCurrentWarehouse(),
    language: getLanguage() || 'en_US'
  })
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
