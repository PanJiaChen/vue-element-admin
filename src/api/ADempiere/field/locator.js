import { getEntitiesList } from '@/api/ADempiere/persistence'

export function getLocatorList({
  warehouseId
}) {
  return getEntitiesList({
    tableName: 'M_Locator',
    whereClause: `M_Warehouse_ID = ${warehouseId}`
  })
}
