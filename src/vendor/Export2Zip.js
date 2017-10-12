/* eslint-disable */
require('script-loader!file-saver');
import JSZip from 'jszip'

export function export_txt_to_zip(th, jsonData, txtName, zipName) {
  const zip = new JSZip()
  const txt_name = txtName || '文本'
  const zip_name = zipName || '压缩包'
  const data = jsonData
  let txtData = `${th}\r\n`
  data.forEach((row) => {
    let tempStr = ''
    tempStr = row.toString()
    txtData += `${tempStr}\r\n`
  })
  zip.file(`${txt_name}.txt`, txtData)
  zip.generateAsync({type:"blob"}).then((blob) => {
    saveAs(blob, `${zip_name}.zip`)
  }, (err) => {
    alert('导出失败')
  })
}
