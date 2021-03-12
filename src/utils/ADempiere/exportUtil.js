import { export_json_to_excel } from '@/vendor/Export2Excel'
import { export_txt_to_zip } from '@/vendor/Export2Zip'
import language from '@/lang'
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/valueFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

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
 * @param {string} fileName .xlsx file name
 */
export function exportFileFromJson({
  header,
  data,
  exportType,
  fileName = ''
}) {
  const jsonData = data.map(row => {
    Object.keys(row).forEach(column => {
      if (typeof row[column] === 'boolean') {
        row[column] = convertBooleanToTranslationLang(row[column])
      }
    })

    return row
  })

  export_json_to_excel({
    header,
    data: jsonData,
    filename: fileName,
    bookType: exportType
  })
}

/**
 * Export txt data into zip file
 * @autor Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {array} header
 * @param {array} data
 * @param {string} txtName .txt text file name
 * @param {string} zipName .zip compressed file name
 */
export function exportZipFile({
  header,
  data,
  txtName = '',
  zipName = ''
}) {
  const jsonData = data.map(row => {
    Object.keys(row).forEach(column => {
      if (typeof row[column] === 'boolean') {
        row[column] = convertBooleanToTranslationLang(row[column])
      }
    })
    return row
  })

  if (isEmptyValue(zipName)) {
    zipName = txtName
  }
  if (isEmptyValue(txtName)) {
    txtName = zipName
  }

  export_txt_to_zip(
    header,
    jsonData,
    txtName,
    zipName
  )
}
