# 信息

它允許獲取該字段的必要信息，其中詳細列出了該字段的名稱，其描述和描述性幫助，以便用戶可以更好地理解該字段的行為。

## ADempiere-ZK版本

<img :src="$withBase('/images/components/information/zk-desktop-version-information.png')" alt="ZK桌面版本中的信息" width="800px">

## ADempiere-Vue版本

<img :src="$withBase('/images/components/information/ui-version-information.png')" alt="移動和桌面版本中的信息" width="800px">

選擇組件會自動顯示字段信息。當字段的類型為 "**選擇**" 時，組件將顯示用於放大或顯示該字段的記錄的窗口的選項。

## 它在哪裡？

它位於ADempiere窗口包含的不同字段中。

## 是做什麼用的？

它用於查詢該領域的信息及其功能。

## 功能或觀察

::: tip
默認情況下，組件按以下順序包含信息

  - 欄位名稱
  - 描述
  - 幫助
  - 放大選項（取決於字段類型）
:::

## 在桌面版中如何使用？

在桌面版本中，單擊字段以查看其顯示的菜單，然後選擇選項 "**信息**" 以查看字段信息。

<img :src="$withBase('/images/components/information/how-to-use-it-in-the-desktop-version.gif')" />

## 在移動版本中如何使用？

在移動版本中，單擊該字段以查看其顯示的菜單，然後選擇選項 "**信息**" 以查看該字段的信息。

<img :src="$withBase('/images/components/information/how-to-use-it-in-the-mobile-version.gif')" />