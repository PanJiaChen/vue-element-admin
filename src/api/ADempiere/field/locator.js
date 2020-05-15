export function getLocatorList({
  warehouseId
}) {
  const { getEntitiesList } = require('@/api/ADempiere/persistence')

  return getEntitiesList({
    tableName: 'M_Locator',
    whereClause: `M_Warehouse_ID = ${warehouseId}`
  })
}
