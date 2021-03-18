// API used for get information of locator from server API,
// please don't change it if is not related to locator field
const tableName = 'M_Locator'

// Get Locator list based on warehouse ID
export function getLocatorList({
  warehouseId
}) {
  const { requestListEntities } = require('@/api/ADempiere/persistence.js')
  return new Promise(resolve => {
    requestListEntities({
      tableName,
      whereClause: `M_Warehouse_ID = ${warehouseId}`
    }).then(locatorData => {
      var locatorList = []
      if (locatorData) {
        locatorData.recordsList.map(record => {
          locatorList.push({
            id: record.id,
            value: record.attributes.Value,
            warehouseId: record.attributes.M_Warehouse_ID,
            rack: record.attributes.X,
            column: record.attributes.Y,
            level: record.attributes.Z
          })
        })
      }
      resolve(locatorList)
    })
  })
}
