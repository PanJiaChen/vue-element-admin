// Get Instance for connection
import request from '@/utils/request'
import { config } from '@/utils/ADempiere/config'

/**
 * Request a process
 * This function allows follow structure:
 * @param {string}  uuid, uuid from process to run
 * @param {string}  reportType, format to output report (pdf, html, csv, ...)
 * @param {string}  tableName, table name of tab, used only window
 * @param {number}  recordId, record identifier, used only window
 * @param {string}  recordUuid, record universal unique identifier, used only window
 * @param {array}   parametersList, parameters from process [{ columnName, value }]
 * @param {array}   selectionsList, selection records, used only browser
      [{
          selectionId,
          selectionValues: [{ columnName, value }]
      }]
 * @param {string}  printFormatUuid
 * @param {boolean} isSummary
 * @param {number}  tableSelectedId, used only browser // TODO: Add support on adempiere-vue
 * @param {string}  reportViewUuid
 */
export function requestRunProcess({
  uuid,
  reportType,
  tableName,
  recordId,
  recordUuid,
  parametersList = [],
  selectionsList = [],
  isSummary,
  tableSelectedId,
  printFormatUuid,
  reportViewUuid
}) {
  parametersList = parametersList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    baseURL: config.adempiere.api.url,
    url: '/data/process',
    method: 'post',
    data: {
      process_uuid: uuid,
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      is_summary: isSummary,
      report_type: reportType,
      table_selected_id: tableSelectedId,
      report_view_uuid: reportViewUuid,
      parameters: parametersList,
      selections: selectionsList,
      print_format_uuid: printFormatUuid
    }
  })
    .then(processRunResponse => {
      const { convertProcessLog } = require('@/utils/ADempiere/apiConverts/process.js')

      return convertProcessLog(processRunResponse)
    })
}

// Request a Process Activity list
export function requestListProcessesLogs({
  tableName,
  instanceUuid,
  userUuid,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  //  Get Process Activity
  return request({
    baseURL: config.adempiere.api.url,
    url: '/logs/list-process-logs',
    method: 'post',
    data: {
      instance_uuid: instanceUuid,
      user_uuid: userUuid,
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    },
    params: {
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(processLogResponse => {
      const { convertProcessLog } = require('@/utils/ADempiere/apiConverts/process.js')

      return {
        recordCount: processLogResponse.record_count,
        processLogsList: processLogResponse.records.map(itemProcess => {
          return convertProcessLog(itemProcess)
        }),
        nextPageToken: processLogResponse.next_page_token
      }
    })
}
