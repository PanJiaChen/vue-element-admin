# Excel

## Excel 导出

Excel 的导入导出都是依赖于[js-xlsx](https://github.com/SheetJS/js-xlsx)来实现的。

在 `js-xlsx`的基础上又封装了[Export2Excel.js](https://github.com/adempiere/adempiere-vue/blob/master/src/vendor/Export2Excel.js)来方便导出数据。

### 使用

由于 `Export2Excel`不仅依赖`js-xlsx`还依赖`file-saver`和`script-loader`。

所以你先需要安装如下命令：

```bash
npm install xlsx file-saver -S
npm install script-loader -S -D
```

由于`js-xlsx`体积还是很大的，导出功能也不是一个非常常用的功能，所以使用的时候建议使用懒加载。使用方法如下：

```js
import('@/vendor/Export2Excel').then(excel => {
  excel.export_json_to_excel({
    header: tHeader, //表头 必填
    data, //具体数据 必填
    filename: 'excel-list', //非必填
    autoWidth: true, //非必填
    bookType: 'xlsx' //非必填
  })
})
```

:::warning 注意 <Badge text="v3.9.1+"/>
在`v3.9.1+`以后的版本中移除了对 Blob 的兼容性代码，如果你还需要兼容很低版本的浏览器可以手动引入[blob-polyfill](https://www.npmjs.com/package/blob-polyfill)进行兼容。
:::

### 参数

| 参数      | 说明                   | 类型    | 可选值                                                                              | 默认值     |
| --------- | ---------------------- | ------- | ----------------------------------------------------------------------------------- | ---------- |
| header    | 导出数据的表头         | Array   | /                                                                                   | []         |
| data      | 导出的具体数据         | Array   | /                                                                                   | []]        |
| filename  | 导出文件名             | String  | /                                                                                   | excel-list |
| autoWidth | 单元格是否要自适应宽度 | Boolean | true / false                                                                        | true       |
| bookType  | 导出文件类型           | String  | xlsx, csv, txt, [more](https://github.com/SheetJS/js-xlsx#supported-output-formats) | xlsx       |

### 示例

```js
import('@/vendor/Export2Excel').then(excel => {
  const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
  const data = this.list
  excel.export_json_to_excel({
    header: tHeader, //表头 必填
    data, //具体数据 必填
    filename: 'excel-list', //非必填
    autoWidth: true, //非必填
    bookType: 'xlsx' //非必填
  })
})
```

- [在线 DEMO](https://adempiere.github.io/adempiere-vue/#/excel/export-excel)
- [在线代码](https://github.com/adempiere/adempiere-vue/blob/master/src/views/excel/export-excel.vue)

## Excel 导入

封装了[UploadExcel](https://github.com/adempiere/adempiere-vue/blob/master/src/components/UploadExcel/index.vue)Excel 导入组件，支持点击和拖拽上传，同样它也是依赖`js-xlsx`的。

它提供了两个回调函数：

- beforeUpload

  你可以在上传之前做一些自己的特殊判断，如判断文件的大小是否大于 1 兆？若大于 1 兆则停止解析并提示错误信息。

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
  解析成功时候会触发的回调函数，它会返回表格的表头和内容。

```js
 handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
```

- [在线 DEMO](https://adempiere.github.io/adempiere-vue/#/excel/upload-excel)
- [在线代码](https://github.com/adempiere/adempiere-vue/blob/master/src/views/excel/upload-excel.vue)
