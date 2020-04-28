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
