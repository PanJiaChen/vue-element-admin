const tableName = 'M_Locator'

export function requestLocatorList({
  warehouseId
}) {
  const { requestListEntities } = require('@/api/ADempiere/persistence.js')

  return requestListEntities({
    tableName,
    whereClause: `M_Warehouse_ID = ${warehouseId}`
  })
}
