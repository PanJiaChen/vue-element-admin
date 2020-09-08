require('script-loader!file-saver')
import * as ExcelJs from 'exceljs/dist/exceljs'

/**
 * 支持多sheet 导出excel
 * @param multiHeader 多行表头
 * @param headers 多sheet对应的表头
 * @param datas 数据，一个数组表示一个sheet中的数据
 * @param filename 文件名称
 * @param sheetnames sheet名称，数组格式的，数组中按次获取sheet名称
 * @param merges 合并单元格 未实现
 * @param autoWidth 自动列宽
 * @param bookType 文档类型
 */
export function export_json_to_excel_sheet({
  multiHeader = [],
  headers = [],
  datas = [],
  filename,
  sheetnames = [],
  merges = [],
  autoWidth = true,
  bookType = 'xlsx'
} = {}) {
  // 创建一个工作簿
  const workbook = new ExcelJs.Workbook()

  // 遍历数据
  for (let tmp = 0; tmp <= datas.length - 1; tmp++) {
    // 获取数据
    const data = datas[tmp]
    // 添加表头, 合并表头的数据
    const header = headers[tmp]
    data.unshift(header)
    // 多行标头
    for (let i = multiHeader.length - 1; i > -1; i--) {
      data.unshift(multiHeader[i])
    }
    // 获取sheetname
    var ws_name = sheetnames[tmp]
    // add header
    const ws1 = workbook.addWorksheet(ws_name)
    ws1.addRows(data)

    // 行居中
    rowCenter(ws1, 1 + multiHeader.length, data.length)

    // 自动处理列宽
    if (autoWidth) {
      /* 设置worksheet每列的最大宽度*/
      const columnWidth = data.map(row => row.map(val => {
        /* 先判断是否为null/undefined*/
        if (val == null) {
          return {
            'width': 10
          }
          // eslint-disable-next-line brace-style
        }
        /* 再判断是否为中文*/
        else if (val.toString().charCodeAt(0) > 255) {
          return {
            'width': val.toString().length * 2
          }
        } else {
          return {
            'width': val.toString().length
          }
        }
      }))
      /* 以第一行为初始值*/
      const result = columnWidth[0]
      for (let i = 1; i < columnWidth.length; i++) {
        for (let j = 0; j < columnWidth[i].length; j++) {
          if (result[j]['width'] < columnWidth[i][j]['width']) {
            result[j]['width'] = columnWidth[i][j]['width']
          }
        }
      }
      // 设置列宽
      colWidth(ws1, result)
    }
  }

  /**
   *  设置start-end行单元格水平垂直居中/添加边框
   * @param arg_ws workSheet 参数
   * @param arg_start 开始行
   * @param arg_end 结束结束行
   */
  function rowCenter(arg_ws, arg_start, arg_end) {
    // eslint-disable-next-line no-undef,no-unmodified-loop-condition
    let i = arg_start
    for (; i <= arg_end; i++) {
      arg_ws.findRow(i).alignment = { vertical: 'middle', horizontal: 'center' }
      // eslint-disable-next-line no-irregular-whitespace
      // 循环 row 中的　cell，给每个 cell添加边框
      arg_ws.findRow(i).eachCell(function(cell, index) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })
    }
  }

  // eslint-disable-next-line no-irregular-whitespace
  // 设置　start-end 列的宽度
  /**
   * 设置行宽
   * @param arg_ws workSheet
   * @param arg_cols 列数组
   */
  function colWidth(arg_ws, arg_cols) {
    for (const i in arg_cols) {
      arg_ws.getColumn(parseInt(i) + 1).width = arg_cols[i].width
    }
  }

  // 保存设置
  workbook.xlsx.writeBuffer().then(buffer => {
    // eslint-disable-next-line no-undef
    saveAs(new Blob([buffer], {
      type: 'application/octet-stream'
    }), `${filename}.${bookType}`)
  })
}
