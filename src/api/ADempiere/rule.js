// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/api/ADempiere/instances.js'

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
export function runCallOutRequest({
  windowUuid,
  windowNo,
  tabUuid,
  tableName,
  columnName,
  value,
  oldValue,
  callout,
  attributesList = []
}) {
  return requestRest({
    url: '/ui/run-callout',
    data: {
      table_name: tableName,
      window_uuid: windowUuid,
      tab_uuid: tabUuid,
      callout,
      column_name: columnName,
      old_value: oldValue,
      value,
      window_no: windowNo,
      attributes: attributesList
    }
  })
    .then(evaluateResponse)
}
