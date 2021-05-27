# 偏愛

允許您默認設置寄存器的值，可以通過以下操作完成：

  - **檢查公司**：設置所有公司的值
  - **檢查組織**：設置所有組織的值
  - **檢查用戶**：設置所有用戶的值
  - **檢查窗口**：設置所有窗口的值

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

  - **對於本公司的所有組織，此用戶和此窗口**
:::

## 在桌面版中如何使用？

在桌面版本中，單擊該字段以查看其顯示的菜單，然後選擇選項“ **潛在性**”以設置所需的首選項值。

## 在移動版本中如何使用？

在移動版本中，單擊該字段以查看其顯示的菜單，然後選擇選項“ **潛在性**”以設置所需的首選項值。

## 技術數據


“偏好設置”對話框寫在以下路徑上：

```bash
└── src                             # 主要源代码
    └── components                  # 全球组件
        └── ADempiere               # ADempiere的特定组件
            └── field               # 领域
                └── contextMenu     # 所有字段的上下文菜单
                    └── preference  # 偏好文件夹

```
[演示](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user.html#user-service) 在這裡

首选的服务消费电话位于以下路线上。
```bash
└─ src                            # 主要源代码
    └─ api                        # 全球服务
      └─ ADempiere                # ADempiere的具体服务
            └─ field              # 领域
                └─ preference     # 首选服务的主要目录

```
该组件被调用的服务有<br>
[POST /api/user-interface/component/preference/set-preference](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#preferencias)<br>
[POST /api/user-interface/component/preference/delete-preference](https://adempiere.github.io/proxy-adempiere-api/user-interface.html#post-api-user-interface-component-preference-delete-preference)
### 去做

在ADempiere-UI版本中，未設置字段首選項。因此，要求糾正問題，以便可以建立這些首選項。

在問題中報告了此問題 [814](https://github.com/adempiere/adempiere-vue/issues/814)