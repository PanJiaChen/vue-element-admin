import { getLanguage } from '@/lang/index'
import BusinessData from '@adempiere/grpc-data-client'
import { BUSINESS_DATA_ADDRESS } from '@/api/ADempiere/constants'
import { getToken, getCurrentOrganization, getCurrentWarehouse } from '@/utils/auth'

// Get Instance for connection
function Instance() {
  return new BusinessData({
    host: BUSINESS_DATA_ADDRESS,
    sessionUuid: getToken(),
    organizationUuid: getCurrentOrganization(),
    warehouseUuid: getCurrentWarehouse(),
    language: getLanguage() || 'en_US'
  })
}

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
