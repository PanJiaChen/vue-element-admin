// Get Instance for connection
import { BusinessDataInstance as Instance } from '@/api/ADempiere/instances.js'

/**
 * Request Pending Documents List
 * @param {string} tableName
 * @param {string} processUuid
 */
export function requestReportViews({ tableName, processUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListReportViews({
    tableName,
    processUuid,
    pageToken,
    pageSize
  })
}

// Get print formats from table name, report view uuid or process uuid
export function requestPrintFormats({ tableName, reportViewUuid, processUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListPrintFormats({
    tableName,
    reportViewUuid,
    processUuid,
    pageToken,
    pageSize
  })
}

// Get drill tables for a report
export function requestDrillTables({ tableName, pageToken, pageSize }) {
  return Instance.call(this).requestListDrillTables({
    tableName,
    pageToken,
    pageSize
  })
}

// Get report output from parameters
export function getReportOutput({
  parametersList,
  tableName,
  printFormatUuid,
  reportViewUuid,
  isSummary,
  reportName,
  reportType
}) {
  return Instance.call(this).requestGetReportOutput({
    parametersList,
    tableName,
    printFormatUuid,
    reportViewUuid,
    isSummary,
    reportName,
    reportType
  })
}
