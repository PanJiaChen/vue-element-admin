// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

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
    url: '/common/api/process',
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
    url: '/user/log/process-logs',
    method: 'get',
    params: {
      instance_uuid: instanceUuid,
      user_uuid: userUuid,
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
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
