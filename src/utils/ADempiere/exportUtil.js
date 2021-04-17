// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
