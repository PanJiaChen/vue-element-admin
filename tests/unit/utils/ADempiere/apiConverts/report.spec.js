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
