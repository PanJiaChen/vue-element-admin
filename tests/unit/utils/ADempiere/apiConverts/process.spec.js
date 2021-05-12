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
