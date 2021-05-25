# 變更角色

允許角色更改而無需註銷。為此，必須選擇位於窗口右上方的 ADempiere 圖標，然後在 “**角色**” 字段中選擇需要更改的角色。

## ADempiere-ZK 版本

<img :src="$withBase('/images/components/change-role/zk-desktop-version-change-role.png')" alt="更改ZK桌面版本中的角色" width="800px">

## ADempiere-Vue 版本

<img :src="$withBase('/images/components/change-role/ui-version-change-role.png')" alt="更改移動和桌面版本中的角色" width="800px">

## 它在哪裡？

它位於選擇窗口右上角的 ADempiere 圖標時顯示的菜單的 “**角色**” 字段中。

## 是做什麼用的？

它用於快速，輕鬆地更改角色，而無需註銷即可通過選擇所需角色來重新開始。

## 功能或觀察

::: tip
ADempiere 自動執行角色更改，並更新視圖，以便僅顯示先前選擇的角色有權訪問的窗口，進程和報告。用戶可以從一個角色更改為任何其他角色，只要已為其分配了不同的所需角色即可。
:::

## 在桌面版中如何使用？

在桌面版本中，單擊窗口右上角的 ADempiere 圖標 “**AD**”，以查看顯示的菜單並在 “**角色**” 字段中選擇角色。

<img :src="$withBase('/images/components/change-role/how-to-use-it-in-the-desktop-version.gif')" />

## 在移動版本中如何使用？

在移動版本中，單擊窗口右上方的 ADempiere 圖標 “**AD**”，以查看顯示的菜單並在 “**角色**” 字段中選擇角色。

<img :src="$withBase('/images/components/change-role/how-to-use-it-in-the-mobile-version.gif')" />

导航栏##开发者选项

**改变角色**面板位于导航栏中右侧的图标上。

```bash
└── src                                   # 主要源代码
    └── views                             # 观点
        └── profile                       # 形象
                └── components            # 组成部分
                    └── RolesNavbar       # 导航栏的作用
```
在这里你可以看到一个 [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

在以下路径中可以找到**改变角色**的服务消费调用:

```bash
└─ src                            # 主要源代码
    └─ api                        # 全球服务
        └─ role                   # 角色服务的主要目录
```

从该组件中调用的服务有 <br>
[GET /api/user/roles](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user.html#get-api-user-roles)<br>
[POST /api/user/change-role](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user.html#post-api-user-change-role)<br>
