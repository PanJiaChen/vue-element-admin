# Change Role

Allows role change without logging out. To do this, you must select the ADempiere icon located in the upper right part of the window, and then select in the field "**Role**", the role for which you need to change.

## ADempiere-ZK version

<img :src="$withBase('/images/components/change-role/zk-desktop-version-change-role.png')" alt="Change Role in ZK Desktop Version" width="800px">

## ADempiere-Vue version

<img :src="$withBase('/images/components/change-role/ui-version-change-role.png')" alt="Change Role in Mobile and Desktop Version" width="800px">

## Where it is located?

It is located in the "**Role**" field of the menu that is displayed when selecting the ADempiere icon that is located in the upper right part of the window.

## What is it for?

It is used to change roles quickly and easily, without having to log out to start again by selecting the required role.

## Functions or Observations

::: tip
ADempiere performs the role change automatically, updating the view so that only the windows, processes and reports to which the previously selected role has access are displayed. The user can make the change from one role to any other, as long as it is assigned the different required roles.
:::

## How is it used in the Desktop version?

In the desktop version, click on the ADempiere icon "**AD**", located in the upper right part of the window, to view the menu that is displayed and select the role in the field "**Role**".

<img :src="$withBase('/images/components/change-role/how-to-use-it-in-the-desktop-version.gif')" />

## How is it used in the mobile version?

In the mobile version, click on the ADempiere icon "**AD**", located in the upper right part of the window, to view the menu that is displayed and select the role in the field "**Role**".

<img :src="$withBase('/images/components/change-role/how-to-use-it-in-the-mobile-version.gif')" />

## Developer Options

The **Change Role** panel is located on the icon to the right in the navigation bar.

```bash
└── src                                   # Main source code
    └── views                             # Views
        └── profile                       # Profile
                └── components            # Components
                    └── RolesNavbar       # Navbar Roles
```
Here you can see a [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

The **Change Role** service consumption call can be found in the following path:

```bash
└─ src                            # Main source code
    └─ api                        # Global Services
        └─ role                   # Main directory of role services
```

The services called from the component are <br>
[GET /api/user/roles](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user.html#get-api-user-roles)<br>
[POST /api/user/change-role](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user.html#post-api-user-change-role)<br>
