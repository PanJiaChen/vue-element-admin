# 銷售點

銷售點表單使銷售人員可以快速而有效地接管客戶訂單。在此過程中，可以查看訂單的總金額，並將其轉換為組織工作所用的不同貨幣，為此必須有一個預先創建的匯率。

## 創建新訂單

可以通過將產品添加到表單來創建新的銷售訂單記錄。

<img :src="$withBase('/images/forms/point-of-sales/create-new-order.gif')" />

同樣，可以通過選擇位於 "**業務夥伴**" 字段右側的選項 "**新訂單**" 來創建新記錄。當用戶以 "**銷售點**" 的形式位於銷售訂單記錄中時，將啟用此選項。

<img :src="$withBase('/images/forms/point-of-sales/option-create-new-order.png')" alt="創建新訂單選項" width="800px">

## 將客戶添加到訂單

要將客戶添加到銷售訂單中，必須在 "**業務夥伴**" 字段中輸入客戶的數據。

<img :src="$withBase('/images/forms/point-of-sales/add-business-partner.gif')" />

此外，可以通過選擇位於 "**業務夥伴**" 字段頂部的 "**+**" 圖標來創建客戶業務夥伴的新記錄。

<img :src="$withBase('/images/forms/point-of-sales/create-business-partner.png')" alt="創建業務夥伴" width =" 800px">

## 將產品添加到訂單

可以按以下方式將銷售訂單的產品添加到其中：

- 在 "**產品代碼**" 字段中輸入產品的代碼或名稱。在此字段中輸入值時，ADempiere 會自動執行搜索，並在該字段下方顯示結果。

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-code-or-name.gif')" />

- 在產品目錄中選擇 "**<**" 圖標，選擇位於 "**銷售點**" 窗體窗口右中角的產品。

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-catalog.gif')" />

- 除此之外，可以在條形碼閱讀器的幫助下添加產品。

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-code-reader.gif')" />

## 訂單行

<img :src="$withBase('/images/forms/point-of-sales/sales-order-lines.png')" alt="銷售訂單行" width =" 800px">

訂單行部分包含以下六（6）列，它們代表產品的主要字段：

- **產品**：加載到銷售訂單中的產品的名稱。

- **價格**：從銷售訂單中扣除的產品單價。

- **數量**：加載到銷售訂單中的產品數量。

- **％折扣**：折扣百分比應用於銷售訂單中收取的產品價格。

- **總計**：根據輸入的數量，產品線的總計。

- **選項**：該列由三（3）個選項組成，這些選項允許用戶執行某些操作

  - 從左到右的第一個選項，可讓您查看產品信息

  - 從左到右的第二個選項，允許您修改產品的數量，價格和折扣百分比。

  - 第三個選項從左到右，可讓您刪除銷售訂單行的記錄。

    <img :src="$withBase('/images/forms/point-of-sales/sales-order-lines.gif')" />

## 訂單信息

銷售訂單的信息位於表格的右下方。它由以下字段組成：

- **訂單**：表示銷售訂單的憑證編號。

- **賣方**：表示下達銷售訂單的商業代理商（賣方）的名稱。

- **日期**：表示銷售訂單的日期。

- **小計**：表示不含稅的訂單總額。

- **類型**：指示用於生成銷售訂單的單據類型。

- **折扣**：表示應用於訂單的折扣總額。

- **項目數量**：表示銷售訂單具有的項目總數。

- **稅**：表示應用於訂單的稅金總額。

- **行數**：表示銷售訂單具有的產品線總數。

- **總計**：表示包含折扣和稅金的訂單總額。

<img :src="$withBase('/images/forms/point-of-sales/sales-order-information.png')" alt="銷售訂單信息" width =" 800px">

## 銷售點選項

要將您自己放置在所下訂單的任何產品系列中，您可以單擊它或選擇位於 "**銷售點**" 表格左下方的 "**定位**" 圖標。 。第一個圖標允許定位在 "**上一個記錄**" 中，第二個圖標允許定位在 "**下一個記錄**" 中。

<img :src="$withBase('/images/forms/point-of-sales/position-yourself-on-the-order-lines.gif')" />

同樣，您可以通過選擇位於 "**銷售點**" 表格左下方的 "**刪除**" 圖標來刪除其所在的產品記錄。

<img :src="$withBase('/images/forms/point-of-sales/remove-the-order-line.gif')" />

選擇圖標 "**收費**"，以收集您正在執行的銷售訂單。

<img :src="$withBase('/images/forms/point-of-sales/collect-the-order.gif')" />

要在銷售點表格中更改 POS 終端，請選擇位於表格左下方的 "**銷售點**" 選項。然後，選擇您需要用來執行銷售操作的 POS 終端。

<img :src="$withBase('/images/forms/point-of-sales/change-point-of-sale-terminal.gif')" />
