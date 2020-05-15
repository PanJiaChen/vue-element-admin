// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

/**
 * Run callout request
 * @param {string}  windowUuid
 * @param {number}  windowNo
 * @param {string}  tabUuid
 * @param {string}  tableName
 * @param {string}  columnName
 * @param {mixed}   value
 * @param {mixed}   oldValue
 * @param {string}  callout
 * @param {array}   attributesList
 * @returns {Map} Entity
 */
export function runCallOutRequest({ windowUuid, windowNo, tabUuid, tableName, columnName, value, oldValue, valueType, callout, attributesList = [] }) {
  return Instance.call(this).requestRunCallout({
    windowUuid,
    windowNo,
    tabUuid,
    tableName,
    columnName,
    value,
    oldValue,
    valueType,
    callout,
    attributesList
  })
}
