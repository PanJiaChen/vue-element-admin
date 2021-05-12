// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Sofia Calderon sofia.ester.calderon@gmail.com www.westfalia-it.com
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

import { convertProcessLog } from '@/utils/ADempiere/apiConverts/process'
import processLog from './objects/fromApi/processLog.json'
import convertedProcessLog from './objects/converted/processLog.json'
import processLogWithReport from './objects/fromApi/processLogWithReport.json'
import convertedProcessLogWithReport from './objects/converted/processLogWithReport.json'

describe('processLog', () => {
  it('should return a converted processLog object', () => {
    const actualProcessLog = convertProcessLog(processLog)
    expect(actualProcessLog).toEqual(convertedProcessLog)
  })

  it('should return a converted processLog with output object', () => {
    const actualProcessLog = convertProcessLog(processLogWithReport)
    expect(actualProcessLog).toEqual(convertedProcessLogWithReport)
  })
})
