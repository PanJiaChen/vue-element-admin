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
 * Request Pending Documents List
 * @param {string} tableName
 * @param {string} processUuid
 */
export function requestListReportsViews({
  tableName,
  processUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user-interface/process/report-views',
    method: 'get',
    params: {
      table_name: tableName,
      process_uuid: processUuid,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(reportViewResponse => {
      const { convertReportView } = require('@/utils/ADempiere/apiConverts/report.js')

      return {
        nextPageToken: reportViewResponse.next_page_token,
        recordCount: reportViewResponse.record_count,
        reportViewsList: reportViewResponse.records.map(drill => {
          return convertReportView(drill)
        })
      }
    })
}

// Get print formats from table name, report view uuid or process uuid
export function requestListPrintFormats({
  tableName,
  reportViewUuid,
  processUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user-interface/process/print-formats',
    method: 'get',
    params: {
      table_name: tableName,
      report_view_uuid: reportViewUuid,
      process_uuid: processUuid,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(responseListPrintFormats => {
      const { convertListPrintFormats } = require('@/utils/ADempiere/apiConverts/report.js')

      return convertListPrintFormats(responseListPrintFormats)
    })
}

// Get drill tables for a report
export function requestListDrillTables({
  tableName,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user-interface/process/drill-tables',
    method: 'get',
    params: {
      table_name: tableName,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(drillTablesResponse => {
      const { convertDrillTables } = require('@/utils/ADempiere/apiConverts/report.js')

      return {
        drillTablesList: drillTablesResponse.records.map(drill => {
          return convertDrillTables(drill)
        }),
        nextPageToken: drillTablesResponse.next_page_token,
        recordCount: drillTablesResponse.record_count
      }
    })
}

// Get report output from parameters
export function requestGetReportOutput({
  tableName,
  printFormatUuid,
  reportViewUuid,
  isSummary,
  reportName,
  reportType,
  parametersList,
  // query criteria
  query,
  whereClause,
  orderByClause
}) {
  return request({
    url: '/user-interface/process/report-output',
    method: 'get',
    params: {
      table_name: tableName,
      // reference
      print_format_uuid: printFormatUuid,
      report_view_uuid: reportViewUuid,
      is_summary: isSummary,
      report_name: reportName,
      report_type: reportType,
      // DSL Query
      filters: parametersList,
      // Custom Query
      query,
      where_clause: whereClause,
      order_by_clause: orderByClause
    }
  })
    .then(reportOutpuResponse => {
      const { convertReportOutput } = require('@/utils/ADempiere/apiConverts/report.js')

      return convertReportOutput(reportOutpuResponse)
    })
}
