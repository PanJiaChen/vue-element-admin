
export function convertListPrintFormats(listPrintFormatsToConvert) {
  return {
    recordCount: listPrintFormatsToConvert.record_count,
    records: listPrintFormatsToConvert.records.map(record => {
      return convertPrintFormat(record)
    }),
    nextPageToken: listPrintFormatsToConvert.next_page_token
  }
}

export function convertPrintFormat(printFormatToConvert) {
  const { name, description } = printFormatToConvert

  return {
    name,
    description,
    tableName: printFormatToConvert.table_name,
    isDefault: printFormatToConvert.is_default,
    reportViewUuid: printFormatToConvert.report_view_uuid,
    printFormatUuid: printFormatToConvert.print_format_uuid
  }
}

export function convertReportOutput(reportOutputToConvert) {
  const { uuid, name, description } = reportOutputToConvert

  return {
    uuid,
    name,
    description,
    fileName: reportOutputToConvert.file_name,
    output: reportOutputToConvert.output,
    mimeType: reportOutputToConvert.mime_type,
    dataCols: reportOutputToConvert.data_cols,
    dataRows: reportOutputToConvert.data_rows,
    headerName: reportOutputToConvert.header_name,
    footerName: reportOutputToConvert.footer_name,
    printFormatUuid: reportOutputToConvert.print_format_uuid,
    reportViewUuid: reportOutputToConvert.report_view_uuid,
    tableName: reportOutputToConvert.table_name,
    outputStream: reportOutputToConvert.output_stream,
    // outputStreamAsB64
    outputStream_asB64: reportOutputToConvert.output_stream_asB64,
    // outputStreamAsU8
    outputStream_asU8: reportOutputToConvert.output_stream_asU8,
    reportType: reportOutputToConvert.report_type
  }
}

export function convertDrillTables(drillTablesToConvert) {
  return {
    tableName: drillTablesToConvert.table_name,
    printName: drillTablesToConvert.print_name
  }
}

export function convertReportView(reportViewToConvert) {
  const { uuid, name, description } = reportViewToConvert

  return {
    uuid,
    name,
    description,
    tableName: reportViewToConvert.table_name,
    reportViewUuid: reportViewToConvert.report_view_uuid
  }
}
