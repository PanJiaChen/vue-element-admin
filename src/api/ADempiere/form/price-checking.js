// Get Instance for connection
import { POSInstance as Instance } from '@/api/ADempiere/instances.js'

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
