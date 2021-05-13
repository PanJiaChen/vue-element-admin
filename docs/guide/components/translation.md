# Translation

Allows you to add the Spanish translation of the value entered in a given field.

## ADempiere-ZK version

<img :src="$withBase('/images/components/translation/zk-desktop-version-translation.png')" alt="ZK Desktop Version Preference" width="800px">

## ADempiere-Vue version

<img :src="$withBase('/images/components/translation/translation-desktop-mobile.png')" alt="Preference for Mobile and Desktop Version" width="800px">

## Where it is located?

It is located in the fields of the windows that contain the "**Translation**" tab.

## What is it for?

It is used to establish the translation of the value entered in a specific field.

## Functions or Observations

::: tip
This component replaces the "**Translation**" tab that some ADempiere-ZK windows contain.
:::

## How is it used in the Desktop version?

In the desktop version, click on the field to view the menu displayed by it, then select the option "**Language**", to view the information of the field with its respective translation.

<img :src="$withBase('/images/components/translation/how-to-use-it-in-the-desktop-version.gif')" />

## How is it used in the mobile version?

In the desktop version, click on the field to view the menu displayed by it, then select the option "**Language**", to view the information of the field with its respective translation.


<img :src="$withBase('/images/components/translation/how-to-use-it-in-the-mobile-version.gif')" />
![How to use it in the mobile version]('/images/components/translation/how-to-use-it-in-the-mobile-version.gif' "How to use it in the mobile version")

## Developer Options

The **Translation** dialog is located in the following path:

```bash
└── src                             # Main source code
    └── components                  # Global components
        └── ADempiere               # specific components de ADempiere
            └── field               # Field
                └── contextMenu     # Context Menu
                    └── translated  # Translation home directory

```
Here you can see a [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

The **Translation** service consumption call can be found in the following path:
```bash
└─ src                            # Main source code
    └─ api                        # Global Services
      └─ ADempiere                # ADempiere's specific services
            └─ persistence        # Main service directory Translation


```


The called services of the component are <br>
[GET adempiere-api/ui/getTranslations]()<br>

