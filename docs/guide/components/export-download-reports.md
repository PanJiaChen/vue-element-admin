# Export/Download Reports

It allows the reports to be exported in certain formats according to the user's need at the time.

## ADempiere-ZK version

<img :src="$withBase('/images/components/export-download-reports/zk-desktop-version-export-download-reports.png')" alt="Export/Download Reports in ZK Desktop Version" width="800px">

## ADempiere-Vue version

<img :src="$withBase('/images/components/export-download-reports/export-download-reports-desktop-mobile.png')" alt="Export/Download Reports in Mobile and Desktop UI Version" width="800px">

The options available to export or download the reports are the following:

- Export to (ps - PS Postscript File)
- Export to (xml - XML ​​file)
- Export to (pdf - Acrobat PDF file)
- Export to (html - HTML file)
- Export to (html - HTML file)
- Export to (txt - Tab delimited text file)
- Export to (ssv - File separated by semicolons)
- Export to (csv - Excel CSV file)
- Export to (xls - Excel file)
- Export to (xlsx - XLSX file)
- Export to (arxml - ADempiere Report Definition File)

## Where it is located?

It is located as options to select, within the option "**Execute as**", which is displayed when selecting the option "**Actions**" from the context menu located at the top of the header of the reports. Its behavior or file to be generated may vary depending on the option that is selected after the option "**Run as**".

## What is it for?

It is used to obtain the information from the report in different ways and in different formats.

## Functions or Observations

::: tip
To generate the report in PDF format, the report records must be filtered, so that the file to be generated is not too heavy, since the maximum file size is 4194304 so the file is not generated when the size exceeds the size indicated above.
:::

## How is it used in the Desktop version?

When you already have the report generated under the required parameters or filters, select the option "**Actions**", this option is located in the context menu, which is located in the upper right part of the header of the previously generated report. After having selected the option "**Actions**", the options menu of said option is displayed, where the option "**Execute as**" must be selected, so that the options available to export/download the file. When selecting any of the export options, the file is downloaded or exported from ADempiere, in the selected format with the information from the report previously generated according to the user's requirement at the time.

### Export / Download Reports

<img :src="$withBase('/images/components/export-download-reports/export-download-reports-in-desktop-version.gif')" />
