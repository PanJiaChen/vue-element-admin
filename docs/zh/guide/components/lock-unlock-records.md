# 鎖定/解鎖記錄

允許您阻止記錄，以便只有阻止它的用戶才能查看它。當記錄被鎖定時，將選擇相同的鎖定圖標來解鎖記錄，並且所有用戶都可以查看。

## ADempiere-ZK 版本

<img :src="$withBase('/images/components/lock-unlock-records/zk-desktop-version-lock-unlock-records.png')" alt="鎖定/解鎖ZK桌面版本中的記錄" width="800px">

## ADempiere-Vue 版本

<img :src="$withBase('/images/components/lock-unlock-records/ui-version-lock-unlock-records.png')" alt="在移動和台式機版本中鎖定/解鎖記錄" width="800px">

## 它在哪裡？

它位於用戶所在的選項卡名稱的左側。

## 是做什麼用的？

它用於阻止和取消阻止特定記錄。

## 功能或觀察

::: tip
鎖定註冊表時，選項卡名稱從藍色更改為紅色。
:::

## 在桌面版中如何使用？

在桌面版本中，位於註冊表所在的選項卡上，最後選擇了位於選項卡名稱左側的鎖定圖標。要解鎖註冊表，請執行相同的過程。

<img :src="$withBase('/images/components/lock-unlock-records/how-to-use-it-in-the-desktop-version.gif')" />

## 在移動版本中如何使用？

在移動版本中，找到記錄所在的選項卡，最後選擇位於選項卡名稱左側的鎖定圖標。要解鎖註冊表，請執行相同的過程。

<img :src="$withBase('/images/components/lock-unlock-records/how-to-use-it-in-the-mobile-version.gif')" />

## 开发者选项

锁定/解锁记录的**按钮位于以下路径中。

```bash
└── src                  # 主要数据来源
    └── components       # 全局组件
        └── ADempiere    # ADempiere的特殊组件
            └── Tab      # 主目录，其中有 Bloquear/Desbloquear Registros 的按钮。
```

在这里你可以看到一个[演示](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

锁定/解锁记录**服务消费调用位于以下路径

```bash
└─ src                                  # 主要源代码。
    └─ api                              # 全局服务。
      └─ ADempiere                      # ADempiere特定服务。
            └── actions                 # 注册动作服务的主目录。
                └── private-access      # 锁定/解锁日志服务的主目录。
```
该组件的调用服务是。

[POST /api/user-interface/component/private-access/unlock-private-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#post-api-user-interface-component-private-access-unlock-private-access)

[POST /api/user-interface/component/private-access/lock-private-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#post-api-user-interface-component-private-access-lock-private-access)

[GET /api/user-interface/component/private-access/private-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-component-private-access-private-access)
