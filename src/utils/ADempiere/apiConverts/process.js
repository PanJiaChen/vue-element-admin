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
    output: convertReportOutput(processLogToConvert.output)
  }
}
