# 偏愛

允許您默認設置寄存器的值，可以通過以下操作完成：

  -**檢查公司**：設置所有公司的值
  -**檢查組織**：設置所有組織的值
  -**檢查用戶**：設置所有用戶的值
  -**檢查窗口**：設置所有窗口的值

## ADempiere-ZK版本

<img :src="$withBase('/images/components/preference/zk-desktop-version-preference.png')" alt="Preferencia en Versión de Escritorio ZK" width="800px">

## Versión ADempiere-Vue

<img :src="$withBase('/images/components/preference/preference-desktop-mobile.png')" alt="Preferencia en Versión Móvil y de Escritorio" width="800px">

通過取消選中上面指示的任何檢查，組件的行為在於在創建新記錄時設置所述值。例子：

  當您取消選中“窗口”檢查並保存更改時，該字段的值將設置為包含該字段的所有窗口的默認值。在該窗口或任何ADempiere窗口中創建新記錄時，都可以查看該行為，默認情況下，該新記錄是使用先前加載的字段中的信息創建的，該字段在其中執行了“歧視性”組件的更改。

以同樣的方式，檢查**公司**，組織**和**用戶**的行為。組件註冊可以取消，保存或刪除。

## 它在哪裡？

它位於ADempiere窗口包含的不同字段中。

## 是做什麼用的？

它用於根據公司，組織，用戶和窗口設置默認值。

## 功能或觀察

::: tip
默認情況下，該字段包含首選項設置

  -**對於本公司的所有組織，此用戶和此窗口**
:::

## 在桌面版中如何使用？

在桌面版本中，單擊該字段以查看其顯示的菜單，然後選擇選項“ **潛在性**”以設置所需的首選項值。

## 在移動版本中如何使用？

在移動版本中，單擊該字段以查看其顯示的菜單，然後選擇選項“ **潛在性**”以設置所需的首選項值。

## 技術數據


“偏好設置”對話框寫在以下路徑上：

```bash
└── src                             # main source code
    └── components                  # global components
        └── ADempiere               # ADempiere specific components
            └── field               # Fields
                └── contextMenu     # Context Menu for all fields
                    └── preference  # Preference folder

```
[演示](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1- 11e9-91a1-0242ac140002) 在這裡

### 去做

在ADempiere-UI版本中，未設置字段首選項。因此，要求糾正問題，以便可以建立這些首選項。

在問題中報告了此問題 [814](https://github.com/adempiere/adempiere-vue/issues/814)