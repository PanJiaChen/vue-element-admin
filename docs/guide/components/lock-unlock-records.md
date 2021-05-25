# Lock / Unlock Records

Allows you to block a record so that it can only be viewed by the user who blocks it. When the record is locked, the same lock icon is selected to unlock the record and can be viewed by all users.

## ADempiere-ZK version

<img :src="$withBase('/images/components/lock-unlock-records/zk-desktop-version-lock-unlock-records.png')" alt="Lock / Unlock Records in ZK Desktop Version" width="800px">

## ADempiere-Vue version

<img :src="$withBase('/images/components/lock-unlock-records/ui-version-lock-unlock-records.png')" alt="Lock / Unlock Records in Mobile and Desktop Version" width="800px">

## Where it is located?

It is located on the left side of the name of the tab where the user is located.

## What is it for?

It is used to block and unblock a specific record.

## Functions or Observations

::: tip
When locking the registry, the tab name changes from blue to red.
:::

## How is it used in the Desktop version?

In the desktop version, the tab where the registry is located is located and finally the lock icon located on the left side of the name of the tab is selected. To unlock the registry, the same procedure is performed.

<img :src="$withBase('/images/components/lock-unlock-records/how-to-use-it-in-the-desktop-version.gif')" />

## How is it used in the mobile version?

In the mobile version, the tab where the record is located is located and finally the lock icon located on the left side of the name of the tab is selected. To unlock the registry, the same procedure is performed.

<img :src="$withBase('/images/components/lock-unlock-records/how-to-use-it-in-the-mobile-version.gif')" />

## Developer Options

The **Lock/Unlock Records** button is located in the following path:

```bash
└── src                     # main source code
    └── components          # Global components.
        └─── ADempiere      # ADempiere specific components.
            └─── Tab        # Main directory where the Lock/Unlock Records button is located.
```

Here you can see a [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

The **Lock/Unlock Records** service consumption call is located in the following path:

```bash
└─ src                              # Main source code.
    └─ api                          # Global services.
      └─ ADempiere                  # ADempiere specific services.
            └─ actions              # Main directory of registration actions services.
                └─ private-access   # Main directory of the Lock/Unlock Logs service.
```

The called services of the component are:

[POST /api/user-interface/component/private-access/unlock-private-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#post-api-user-interface-component-private-access-unlock-private-access)

[POST /api/user-interface/component/private-access/lock-private-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#post-api-user-interface-component-private-access-lock-private-access)

[GET /api/user-interface/component/private-access/private-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-component-private-access-private-access)
