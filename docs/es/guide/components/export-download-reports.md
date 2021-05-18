# Exportar/Descargar Reportes

Permite exportar los reportes en formatos determinados según la necesidad del usuario en su momento.

## Versión ADempiere-ZK

<img :src="$withBase('/images/components/export-download-reports/zk-desktop-version-export-download-reports.png')" alt="Exportar/Descargar Reportes en Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/export-download-reports/export-download-reports-desktop-mobile.png')" alt="Exportar/Descargar Reportes en Versión UI Móvil y de Escritorio" width="800px">

Las opciones disponibles para exportar o descargar los reportes son las siguientes:

- Exportar a (ps - Archivo Postscript PS)
- Exportar a (xml - Archivo XML)
- Exportar a (pdf - Archivo PDF Acrobat)
- Exportar a (html - Archivo HTML)
- Exportar a (html - Archivo HTML)
- Exportar a (txt - Archivo de texto delimitado por tabuladores)
- Exportar a (ssv - Archivo separado por punto y coma)
- Exportar a (csv - Archivo CSV de Excel)
- Exportar a (xls - Archivo Excel)
- Exportar a (xlsx - XLSX file)
- Exportar a (arxml - Archivo de Definición de Reporte ADempiere)

## ¿Dónde se ubica?

Se ubica como opciones a seleccionar, dentro de la opción "**Ejecutar como**", que se desplega al seleccionar la opción "**Acciones**" del menú de contexto ubicado en la parte superior del encabezado de los reportes. Su comportamiento o archivo a generar puede variar dependiendo de la opción que sea seleccionada luego de la opción "**Ejecutar como**".

## ¿Para qué sirve?

Sirve para obtener la información del reporte de diferentes maneras y en diferentes formatos.

## Funciones u Observaciones

::: tip
Para generar el reporte en formato PDF, se deben filtrar los registros del reporte, de manera que el archivo a generar no sea uy pesado, ya que el maximo de tamaño del archivo es 4194304 por lo que no se genera el archivo cuando el tamaño supera el tamaño indicado anteriormente.
:::

## ¿Cómo se utiliza en la versión de Escritorio?

Cuando ya se tiene el reporte generado bajo los parametros o filtros requeridos, se selecciona la opción "**Acciones**", dicha opción se encuentra ubicada en el menú de contexto, mismo que se encuentra posicionado en la parte superior derecha del encabezado del reporte previamente generado. Luego de haber seleccionado la opción "**Acciones**", se despliega el menú de opciones de dicha opción, donde se debe seleccionar la opción "**Ejecutar como**", para que posteriormente sean desplegadas las opciones disponibles para exportar/descargar el archivo. Al seleccionar cualquiera de las opciones de exportación, se descarga o exporta de ADempiere, el archivo en el formato seleccionado con la información del reporte previamente generado según el requierimiento del usuario en su momento.

### Exportar/Descargar Reportes

<img :src="$withBase('/images/components/export-download-reports/export-download-reports-in-desktop-version.gif')" />
