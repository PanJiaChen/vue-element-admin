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

import {
  convertListPrintFormats,
  convertReportOutput,
  convertDrillTables,
  convertReportView
} from '@/utils/ADempiere/apiConverts/report'
import reportOutput from './objects/fromApi/reportOutput.json'
import convertedReportOutput from './objects/converted/reportOutput.json'
import printFormats from './objects/fromApi/printFormats.json'
import convertedPrintFormats from './objects/converted/printFormats.json'
import drillTables from './objects/fromApi/drillTables.json'
import convertedDrillTables from './objects/converted/drillTables.json'
import reportView from './objects/fromApi/reportView.json'
import convertedReportView from './objects/converted/reportView.json'

describe('reportOutput', () => {
  it('should return a converted reportOutput object', () => {
    const actualReportOutput = convertReportOutput(reportOutput)
    expect(actualReportOutput).toEqual(convertedReportOutput)
  })
})

describe('printFormats', () => {
  it('should return a converted printFormats object', () => {
    const actualPrintFormats = convertListPrintFormats(printFormats)
    expect(actualPrintFormats).toEqual(convertedPrintFormats)
  })
})

describe('drillTables', () => {
  it('should return a converted drillTables object', () => {
    const actualDrillTables = convertDrillTables(drillTables)
    expect(actualDrillTables).toEqual(convertedDrillTables)
  })
})

describe('reportView', () => {
  it('should return a converted reportView object', () => {
    const actualReportView = convertReportView(reportView)
    expect(actualReportView).toEqual(convertedReportView)
  })
})
