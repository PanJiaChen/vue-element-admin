# Excel

## Exportar Excel

La importación y exportación de Excel se implementa confiando en [js-xlsx](https://github.com/SheetJS/js-xlsx).

[Export2Excel.js](https://github.com/adempiere/adempiere-vue/blob/master/src/vendor/Export2Excel.js) está empaquetado en el `js-xlsx` para facilitar la exportación de datos.

### Uso

Dado que `Export2Excel` depende no solo de `js-xlsx` sino también de `file-saver` y `script-loader`.

Primero debes instalar el siguiente comando:

```bash
npm install xlsx file-saver -S
npm install script-loader -S -D
```

Dado que el tamaño `js-xlsx` todavía es muy grande, la función de exportación no es una función muy común, por lo que se recomienda una carga lenta al usarla. El método de uso es el siguiente:

```js
import('@/vendor/Export2Excel').then(excel => {
  excel.export_json_to_excel({
    header: tHeader, //Se requiere encabezado
    data, //Datos específicos requeridos
    filename: 'excel-list', //Opcional
    autoWidth: true, //Opcional
    bookType: 'xlsx' //Opcional
  })
})
```

:::warning Advertencia <Badge text="v3.9.1+"/>
El código de compatibilidad para Blob se ha eliminado en las versiones posteriores a `v3.9.1 +`. Si necesita ser compatible con navegadores de muy bajo nivel, puedes introducir manualmente [blob-polyfill](https://www.npmjs.com/package/blob-polyfill).
:::

### Parámetros

| Parámetros | Descripción                      | Tipo    | Valores Aceptados                                                                   | Predeterminado |
| ---------- | -------------------------------- | ------- | ----------------------------------------------------------------------------------- | -------------- |
| header     | Exportar encabezado de datos     | Array   | /                                                                                   | []             |
| data       | Datos específicos exportados     | Array   | /                                                                                   | []             |
| filename   | Nombre de archivo de exportación | String  | /                                                                                   | excel-list     |
| autoWidth  | Si la celda de ancho automático  | Boolean | true / false                                                                        | true           |
| bookType   | Tipo de archivo de exportación   | String  | xlsx, csv, txt, [more](https://github.com/SheetJS/js-xlsx#supported-output-formats) | xlsx           |

### Ejemplo

```js
import('@/vendor/Export2Excel').then(excel => {
  const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
  const data = this.list
  excel.export_json_to_excel({
    header: tHeader, //Se requiere encabezado
    data, //Datos específicos requeridos
    filename: 'excel-list', //Opcional
    autoWidth: true, //Opcional
    bookType: 'xlsx' //Opcional
  })
})
```

- [Demo en línea](https://adempiere.github.io/adempiere-vue/#/excel/export-excel)
- [Código en línea](https://github.com/adempiere/adempiere-vue/blob/master/src/views/excel/export-excel.vue)

## Importación de Excel

El componente encapsulado de importación de Excel [UploadExcel](https://github.com/adempiere/adempiere-vue/blob/master/src/components/UploadExcel/index.vue), soporta clic, arrastrar y cargar, también depende de `js-xlsx`.

Proporciona dos funciones de devolución de llamada (callback):

- beforeUpload

  Puedes hacer algunos juicios especiales antes de subir. Por ejemplo, si el tamaño del archivo es mayor que 1 megabyte? Si es superior a 1 megabyte, deja de analizarlo y muestra un mensaje de error.

```js
  beforeUpload(file) {
    const isLt1M = file.size / 1024 / 1024 < 1

    if (isLt1M) {
      return true
    }

    this.$message({
      message: 'Por favor, no cargue archivos de más de 1m de tamaño.',
      type: 'warning'
    })
    return false
  }
```

- onSuccess
  Una función de devolución de llamada (callback) que se activa cuando el análisis se realiza correctamente, que devuelve el encabezado y el contenido de la tabla.

```js
  handleSuccess({ results, header }) {
    this.tableData = results
    this.tableHeader = header
  }
```

- [Demo en línea](https://adempiere.github.io/adempiere-vue/#/excel/upload-excel)
- [Código en línea](https://github.com/adempiere/adempiere-vue/blob/master/src/views/excel/upload-excel.vue)
