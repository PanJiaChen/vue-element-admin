# 導出/下載報告

它允許當時根據用戶需要以某些格式導出報告。

## ADempiere-ZK 版本

<img :src="$withBase('/images/components/export-download-reports/zk-desktop-version-export-download-reports.png')" alt="以ZK桌面版本導出/下載報告" width="800px">

## ADempiere-Vue 版本

<img :src="$withBase('/images/components/export-download-reports/export-download-reports-desktop-mobile.png')" alt="在移動和桌面UI版本中導出/下載報告" width="800px">

以下是可用於導出或下載報告的選項：

-導出到（ps-PS Postscript 文件） -導出到（xml-XML 文件） -導出到（pdf-Acrobat PDF 文件） -導出到（HTML-HTML 文件） -導出到（HTML-HTML 文件） -導出到（txt-製表符分隔的文本文件） -導出到（ssv-用分號分隔的文件） -導出到（csv-Excel CSV 文件） -導出到（xls-Excel 文件） -導出到（xlsx-XLSX 文件） -導出到（arxml-ADempiere 報告定義文件）

## 它在哪裡？

在選項 “**執行為**” 中，它是可供選擇的選項，當從報表標題頂部的上下文菜單中選擇選項 “**動作**” 時，將顯示該選項。 其行為或要生成的文件可能會有所不同，具體取決於在選項 “**運行為**” 之後選擇的選項。

## 是做什麼用的？

它用於以不同的方式和不同的格式從報告中獲取信息。

## 功能或觀察

::: tip
要生成 PDF 格式的報告，必須對報告記錄進行過濾，以使要生成的文件不會太重，因為最大文件大小為 4194304，因此當文件大小超過上述大小時，不會生成該文件。
:::

## 在桌面版中如何使用？

如果已經在必需的參數或過濾器下生成了報告，請選擇選項 “**操作**”，此選項位於上下文菜單中，該菜單位於先前生成的報告標題的右上部分 。 選擇選項 “**動作**” 後，將顯示該選項的選項菜單，其中必須選擇選項 “**執行為**”，以便可以使用這些選項來導出/下載文件。 選擇任何導出選項時，將以所選格式從 ADempiere 下載或從 ADempiere 導出文件，其中包含來自先前根據當時用戶需求生成的報告中的信息。

### 導出/下載報告

<img :src="$withBase('/images/components/export-download-reports/export-download-reports-in-desktop-version.gif')" />
