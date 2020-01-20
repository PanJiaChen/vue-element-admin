import { export_json_to_excel } from '@/vendor/Export2Excel'
import { export_txt_to_zip } from '@/vendor/Export2Zip'
import language from '@/lang'

export const supportedTypes = {
  xlsx: language.t('report.ExportXlsx'),
  xls: language.t('report.ExportXls'),
  xml: language.t('report.ExporXml'),
  csv: language.t('report.ExporCsv'),
  txt: language.t('report.ExportTxt'),
  html: language.t('report.ExportHtml')
}
export function exportFileFromJson({
  header,
  data,
  exportType
}) {
  var Json = data.map(dataJson => {
    Object.keys(dataJson).forEach(key => {
      if (typeof dataJson[key] === 'boolean') {
        dataJson[key] = dataJson[key] ? language.t('components.switchActiveText') : language.t('components.switchInactiveText')
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

export function exportFileZip({
  header,
  data,
  title
}) {
  var Json = data.map(dataJson => {
    Object.keys(dataJson).forEach(key => {
      if (typeof dataJson[key] === 'boolean') {
        dataJson[key] = dataJson[key] ? language.t('components.switchActiveText') : language.t('components.switchInactiveText')
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
