# 活動

組件 “**活動**” 是一個更改日誌，用於保存窗口記錄中進行的所有更改，指示進行更改的業務夥伴，使用其先前值和其當前值進行修改的字段，確切日期以及執行時間。

## ADempiere-ZK 版本

<img :src="$withBase('/images/components/activity/zk-desktop-version-activity.png')" alt="ZK桌面版本變更日誌" width="800px">

## ADempiere-Vue 版本

<img :src="$withBase('/images/components/activity/ui-version-activity.png')" alt="移動和桌面版本的活動" width="800px">

## 它在哪裡？

它位於窗口的第二個選項卡中，由圖標 “**i**”顯示，位於 ADempiere 窗口的右中間部分。

## 是做什麼用的？

它用於查詢對 ADempiere 視窗寄存器進行的更新的詳細信息。

## 功能或觀察

::: tip
更改的詳細信息將根據用戶的日期和時間顯示。
:::

## 在桌面版中如何使用？

在桌面版本中，單擊 ADempiere 窗口右中角的圖標 “**i**”以查看其顯示的窗口，最後選擇選項卡 “**活動**” 以進行訪問對窗口註冊表所做的所有更改。

<img :src="$withBase('/images/components/activity/how-to-use-it-in-the-desktop-version.gif')" />

## 在移動版本中如何使用？

在移動版本中，必須將其放置在窗口的底部，以查看 “**筆記**” 和 “**活動**” 選項卡，然後選擇 “**活動**” 選項卡以訪問所有對窗口註冊表所做的更改。

<img :src="$withBase('/images/components/activity/how-to-use-it-in-the-mobile-version.gif')" />

## 开发者选项

**活动**面板位于导航栏右侧的图标中。

```bash
    └─ src                                  # 主要源代码
        └── components                      # 全局组件
                └──ADempiere                # ADempiere特定组件
                    └── containerInfo       # 记录信息容器
                        └── recordLogs      # 记录日志
```

在以下路径中可以找到**活动**服务消费调用。

```bash
└─ src                      # 主要源代码。
    └─ api                  # 全局服务。
        └─ ADempiere        # 角色服务的主目录。
            └──windows      # 角色服务的主目录。
```

从该组件中调用的服务有：<br>

[POST /adempiere-api/logs/list-entity-logs](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-log.html#post-adempiere-api-logs-list-entity-logs)