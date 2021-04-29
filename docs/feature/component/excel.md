# Excel

## Excel Export

Import and export of Excel is implemented by relying on [js-xlsx](https://github.com/SheetJS/js-xlsx).

[Export2Excel.js](https://github.com/adempiere/adempiere-vue/blob/master/src/vendor/Export2Excel.js) is packaged on the on `js-xlsx` to facilitate exporting data.

### Use

Since `Export2Excel` depends not only on `js-xlsx` but also on `file-saver` and `script-loader`.

So you first need to install the following command:

```bash
npm install xlsx file-saver -S
npm install script-loader -S -D
```

Since `js-xlsx` size is still very large, the export function is not a very common function, so lazy loading is recommended when using it. The method of use is as follows:

```js
import('@/vendor/Export2Excel').then(excel => {
  excel.export_json_to_excel({
    header: tHeader, //Header Required
    data, //Specific data Required
    filename: 'excel-list', //Optional
    autoWidth: true, //Optional
    bookType: 'xlsx' //Optional
  })
})
```

:::warning Warning <Badge text="v3.9.1+"/>
The compatibility code for Blob has been removed in the later versions of `v3.9.1+`. If you need to be compatible with very low-level browsers, you can manually introduce [blob-polyfill](https://www.npmjs.com/package/blob-polyfill) .
:::

### Params

| Params    | Description                 | Type    | Accepted Values                                                                     | Default    |
| --------- | --------------------------- | ------- | ----------------------------------------------------------------------------------- | ---------- |
| header    | Export header of data       | Array   | /                                                                                   | []         |
| data      | Exported specific data      | Array   | /                                                                                   | []         |
| filename  | Export file name            | String  | /                                                                                   | excel-list |
| autoWidth | Whether the cell auto width | Boolean | true / false                                                                        | true       |
| bookType  | Export file type            | String  | xlsx, csv, txt, [more](https://github.com/SheetJS/js-xlsx#supported-output-formats) | xlsx       |

### Example

```js
import('@/vendor/Export2Excel').then(excel => {
  const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
  const data = this.list
  excel.export_json_to_excel({
    header: tHeader, //Header Required
    data, //Specific data Required
    filename: 'excel-list', //Optional
    autoWidth: true, //Optional
    bookType: 'xlsx' //Optional
  })
})
```

- [Online Demo](https://adempiere.github.io/adempiere-vue/#/excel/export-excel)
- [Online Code](https://github.com/adempiere/adempiere-vue/blob/master/src/views/excel/export-excel.vue)

## Excel Import

Encapsulated [UploadExcel](https://github.com/adempiere/adempiere-vue/blob/master/src/components/UploadExcel/index.vue) Excel import component, support click and drag upload, also it is also Depends on `js-xlsx`.

It provides two callback functions:

- beforeUpload

  You can make some special judgments before uploading. For example, if the size of the file is greater than 1 megabyte? If it is greater than 1 megabyte, it stops parsing and prompts an error message.

```js
  beforeUpload(file) {
    const isLt1M = file.size / 1024 / 1024 < 1

    if (isLt1M) {
      return true
    }

    this.$message({
      message: 'Please do not upload files larger than 1m in size.',
      type: 'warning'
    })
    return false
  }
```

- onSuccess
  A callback function that fires when parsing succeeds, which returns the header and content of the table.

```js
  handleSuccess({ results, header }) {
    this.tableData = results
    this.tableHeader = header
  }
```

- [Online Demo](https://adempiere.github.io/adempiere-vue/#/excel/upload-excel)
- [Online Code](https://github.com/adempiere/adempiere-vue/blob/master/src/views/excel/upload-excel.vue)
