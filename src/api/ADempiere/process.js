// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

/**
 * Request a process
 * This function allows follow structure:
 * @param {string}  uuid, uuid from process to run
 * @param {number}  reportType
 * @param {number}  tableName, table name of tab, used only window
 * @param {number}  recordId, record identifier, used only window
 * @param {array}   parametersList, parameters from process [{ columnName, value }]
 * @param {array}   selectionsList, selection records, used only browser
      [{
          selectionId,
          selectionValues: [{ columnName, value }]
      }]
 * @param {string}  printFormatUuid
 */
export function runProcess({ uuid, reportType, tableName, recordId, parametersList = [], selectionsList = [], printFormatUuid }) {
  //  Run Process
  return Instance.call(this).requestRunProcess({
    uuid,
    reportType,
    tableName,
    recordId,
    parametersList,
    selectionsList,
    printFormatUuid
  })
}

// Request a Process Activity list
export function requestListProcessesLogs({ pageToken, pageSize }) {
  //  Get Process Activity
  return Instance.call(this).requestListProcessesLogs({ pageToken, pageSize })
}
