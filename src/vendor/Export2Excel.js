import { saveAs } from 'file-saver'
import XLSX from 'xlsx'

function generateArray(table) {
  const out = []
  const rows = table.querySelectorAll('tr')
  const ranges = []
  for (let R = 0; R < rows.length; ++R) {
    const outRow = []
    const row = rows[R]
    const columns = row.querySelectorAll('td')
    for (let C = 0; C < columns.length; ++C) {
      const cell = columns[C]
      let colspan = cell.getAttribute('colspan')
      let rowspan = cell.getAttribute('rowspan')
      let cellValue = cell.innerText
      if (cellValue !== '' && cellValue === +cellValue) {
        cellValue = +cellValue
      }

      // Skip ranges
      ranges.forEach(function(range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (let i = 0; i <= range.e.c - range.s.c; ++i) {
            outRow.push(null)
          }
        }
      })

      // Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1
        colspan = colspan || 1
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        })
      }

      // Handle Value
      outRow.push(cellValue !== '' ? cellValue : null)

      // Handle Colspan
      if (colspan) {
        for (let k = 0; k < colspan - 1; ++k) {
          outRow.push(null)
        }
      }
    }
    out.push(outRow)
  }
  return [out, ranges]
}

function datenum(v, date1904) {
  if (date1904) {
    v += 1462
  }
  const epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function sheet_from_array_of_arrays(data, opts) {
  const ws = {}
  const range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  }
  for (let R = 0; R !== data.length; ++R) {
    for (let C = 0; C !== data[R].length; ++C) {
      if (range.s.r > R) {
        range.s.r = R
      }
      if (range.s.c > C) {
        range.s.c = C
      }
      if (range.e.r < R) {
        range.e.r = R
      }
      if (range.e.c < C) {
        range.e.c = C
      }
      const cell = {
        v: data[R][C]
      }
      if (cell.v === null) {
        continue
      }
      const cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      })

      if (typeof cell.v === 'number') {
        cell.t = 'n'
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b'
      } else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = XLSX.SSF._table[14]
        cell.v = datenum(cell.v)
      } else {
        cell.t = 's'
      }

      ws[cell_ref] = cell
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = XLSX.utils.encode_range(range)
  }
  return ws
}

function Workbook() {
  if (!(this instanceof Workbook)) {
    return new Workbook()
  }
  this.SheetNames = []
  this.Sheets = {}
}

function s2ab(s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

export function export_table_to_excel(id) {
  const theTable = document.getElementById(id)
  const oo = generateArray(theTable)
  const ranges = oo[1]

  // original data
  const data = oo[0]
  const ws_name = 'SheetJS'

  const wb = new Workbook()
  const ws = sheet_from_array_of_arrays(data)

  // add ranges to worksheet
  // ws['!cols'] = ['apple', 'banan']
  ws['!merges'] = ranges

  // add worksheet to workbook
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  })

  saveAs(new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  }), 'test.xlsx')
}

export function export_json_to_excel({
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  bookType = 'xlsx'
} = {}) {
  // original data
  filename = filename || 'excel-list'
  data = [...data]
  data.unshift(header)

  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }

  const ws_name = 'SheetJS'
  const wb = new Workbook()
  const ws = sheet_from_array_of_arrays(data)

  if (merges.length > 0) {
    if (!ws['!merges']) {
      ws['!merges'] = []
    }
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }

  if (autoWidth) {
    // set the maximum width of each column of the worksheet
    const colWidth = data.map(row => row.map(val => {
      // determine first if it is null/undefined
      if (val === null || val === undefined) {
        return {
          'wch': 10
        }
      } else if (val.toString().charCodeAt(0) > 255) {
        // and then determine if it's Chinese
        return {
          'wch': val.toString().length * 2
        }
      } else {
        return {
          'wch': val.toString().length
        }
      }
    }))
    // initial value in the first action
    const result = colWidth[0]
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch']
        }
      }
    }
    ws['!cols'] = result
  }

  // add worksheet to workbook
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  const wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  })
  saveAs(new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  }), `${filename}.${bookType}`)
}
