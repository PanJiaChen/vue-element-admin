# 翻譯

允許您添加在給定字段中輸入的值的西班牙語翻譯。

## ADempiere-ZK版本

<img :src="$withBase('/images/components/translation/zk-desktop-version-translation.png')" alt="ZK桌面版本首選項" width="800px">

## ADempiere-Vue版本

<img :src="$withBase('/images/components/translation/translation-desktop-mobile.png')" alt="移動和桌面版本首選項" width="800px">

## 它在哪裡？

它位於包含 “**翻譯**” 選項卡的窗口的字段中。

## 是做什麼用的？

它用於建立在特定字段中輸入的值的轉換。

## 功能或觀察

::: tip
該組件代替了某些ADempiere-ZK窗口所包含的 “**翻譯**” 選項卡。
:::

## 在桌面版中如何使用？

在桌面版本中，單擊該字段以查看其顯示的菜單，然後選擇選項 “**語言**”，以查看該字段的信息及其相應的翻譯。

<img :src="$withBase('/images/components/translation/how-to-use-it-in-the-desktop-version.gif')" />

## 在移動版本中如何使用？

在桌面版本中，單擊該字段以查看其顯示的菜單，然後選擇選項 “**語言**”，以查看該字段的信息及其相應的翻譯。


<img :src="$withBase('/images/components/translation/how-to-use-it-in-the-mobile-version.gif')" />
![如何在移動版本中使用它]('/images/components/translation/how-to-use-it-in-the-mobile-version.gif' "如何在移動版本中使用它")

## 开发者选项

**翻译**对话框位于以下路径中。

```bash
└── src                             # 主要源代码
    └── components                  # 全局组件
        └── ADempiere               # ADempiere的特定组件
            └── field               # 字段
                └── contextMenu     # 上下文菜单
                    └── translated  # 翻译主目录

```
在这里你可以看到一个 [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

在以下路径中可以找到**翻译**服务的消耗调用。
```bash
└─ src                       # 主要源代码
    └─ api                   # 全球服务
      └─ ADempiere           # ADempiere的特定服务
            └── persistence  # 主服务目录 翻译


```


该组件的调用服务是<br>
[GET adempier-api/ui/getTranslations]()<br>

