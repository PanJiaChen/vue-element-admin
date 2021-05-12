// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
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

// API used for get information of locator from server API,
// please don't change it if is not related to locator field
const tableName = 'M_Locator'

// Get Locator list based on warehouse ID
export function getLocatorList({
  warehouseId
}) {
  const { requestListEntities } = require('@/api/ADempiere/common/persistence.js')
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
