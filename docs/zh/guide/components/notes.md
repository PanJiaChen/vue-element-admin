# 注意

在ADempiere-UI版本中，註釋代表ADempiere-ZK版本的 “**註釋**” 圖標。它允許為ADempiere窗口的記錄建立註釋或註釋。

## ADempiere-ZK版本

<img :src="$withBase('/images/components/notes/zk-desktop-version-notes.png')" alt="在ZK桌面版本上的評論" width="800px">

## ADempiere-Vue版本

<img :src="$withBase('/images/components/notes/notes-desktop-mobile.png')" alt="移動和桌面UI版本中的註釋" width="800px">

通過在窗口的記錄中添加註釋或註釋，所有有權訪問該記錄的用戶都可以使用該註釋或註釋。

同樣，註釋或註釋的記錄也可以刪除。

## 它在哪裡？

它位於窗口右側的中央，由圖標 "**一世**" 表示。

## 是做什麼用的？

用於在記錄中添加註釋或評論。

## 功能或觀察

::: tip
它允許在便箋中添加圖像和信息，並對便箋的文本應用 “**降價促銷**” 格式。
:::

## 在桌面版中如何使用？

在桌面版本中，單擊 "**一世**" 圖標以查看其顯示的菜單，然後在左側的框中輸入信息。左側框中輸入的信息會自動應用在右側框中，並採用格式。

### 創建筆記

<img :src="$withBase('/images/components/notes/create-notes-in-desktop-version.gif')" />

## 在移動版本中如何使用？

在移動版本中，它必須位於窗口底部才能查看選項 “**筆記**” 和 “**活動**”, 然後在左側的框中輸入信息。左側框中輸入的信息會自動應用在右側框中，並採用格式。

### 創建筆記
<img :src="$withBase('/images/components/notes/create-notes-in-the-mobile-version.gif')" />

## 开发者选项

 **注释**面板位于以下路径中。

```bash
└── src                      # 主要的源代码。
    └── components           # 全球组件。
        └── ADempiere        # ADempiere的特定组件。
            └── ChatEntries  # 主要组件目录说明。

```
在这里你可以看到一个 [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

可以在以下路径找到**注释**服务的消费调用:
```bash
└─ src                            # 主要的源代码。
    └─ api                        # 全球服务
      └─ ADempiere                # ADempiere的具体服务
            └─ window             # 主要服务目录说明

```


从该组件中调用的服务有  <br>
[POST /adempiere-api/logs/list-chat-entries](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-log.html#post-adempiere-api-logs-list-chat-entries)<br>
[POST /api/user-interface/component/notes/create-chat-entry](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#post-api-user-interface-component-notes-create-chat-entry)<br>
[POST /adempiere-api/logs/list-entity-chats](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-log.html#post-adempiere-api-logs-list-entity-chats)
