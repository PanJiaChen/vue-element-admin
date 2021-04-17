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

import { isEmptyValue } from '../valueUtils.js'
import { convertReportOutput } from './report.js'

export function convertProcessLog(processLogToConvert) {
  return {
    uuid: processLogToConvert.uuid,
    instanceUuid: processLogToConvert.instance_uuid,
    isError: processLogToConvert.is_error,
    summary: processLogToConvert.summary,
    resultTableName: processLogToConvert.result_table_name,
    isProcessing: processLogToConvert.is_processing,
    lastRun: processLogToConvert.last_run,
    // parametersList: processLogToConvert.parameter.map(parameter => {
    //   return convertEntity(parameter)
    // }),
    paramenters: [],
    output: isEmptyValue(processLogToConvert.output) ? {} : convertReportOutput(processLogToConvert.output)
  }
}
