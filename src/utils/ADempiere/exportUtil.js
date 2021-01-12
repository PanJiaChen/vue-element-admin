import { export_json_to_excel } from '@/vendor/Export2Excel'
import { export_txt_to_zip } from '@/vendor/Export2Zip'
import language from '@/lang'

export const reportFormatsList = [
  'ps',
  'xml',
  'pdf',
  'txt',
  'ssv',
  'csv',
  'xls',
  'xlsx',
  'arxml'
]

export const supportedTypes = {
  xlsx: language.t('report.ExportXlsx'),
  xls: language.t('report.ExportXls'),
  xml: language.t('report.ExporXml'),
  csv: language.t('report.ExporCsv'),
  txt: language.t('report.ExportTxt'),
  html: language.t('report.ExportHtml')
}

/**
 * Export data from json
 * @autor Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {array} header
 * @param {array} data
 * @param {string} exportType, supportedTypes array
 */
export function exportFileFromJson({
  header,
  data,
  exportType
}) {
  const Json = data.map(dataJson => {
    Object.keys(dataJson).forEach(key => {
      if (typeof dataJson[key] === 'boolean') {
        dataJson[key] = dataJson[key]
          ? language.t('components.switchActiveText')
          : language.t('components.switchInactiveText')
      }
    })
    return dataJson
  })
  export_json_to_excel({
    header: header,
    data: Json,
    filename: '',
    bookType: exportType
  })
}

/**
 * Export txt data into zip file
 * @autor Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {array} header
 * @param {array} data
 * @param {string} title
 */
export function exportFileZip({
  header,
  data,
  title
}) {
  const Json = data.map(dataJson => {
    Object.keys(dataJson).forEach(key => {
      if (typeof dataJson[key] === 'boolean') {
        dataJson[key] = dataJson[key]
          ? language.t('components.switchActiveText')
          : language.t('components.switchInactiveText')
      }
    })
    return dataJson
  })

  export_txt_to_zip(
    header,
    Json,
    title
  )
}
