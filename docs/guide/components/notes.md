# Notes

In the ADempiere-UI version, the notes represent the "**Comments**" icon of the ADempiere-ZK version. It allows to establish notes or comments to the records of ADempiere windows.

## ADempiere-ZK version

<img :src="$withBase('/images/components/notes/zk-desktop-version-notes.png')" alt="Comments on ZK Desktop Version" width="800px">

## ADempiere-Vue version

<img :src="$withBase('/images/components/notes/notes-desktop-mobile.png')" alt="Notes in Mobile and Desktop UI Version" width="800px">

By adding a note or comment to a record in a window, it will be available to all users who have access to that record.

Similarly, the record of the note or comment can be deleted.

## Where it is located?

It is located in the central part of the right side of the windows, represented by the icon "**i**".

## What is it for?

Used to add notes or comments to a record.

## Functions or Observations

::: tip
It allows adding images and information to the notes, applying "**Markdown**" format to the text of the note.
:::

## How is it used in the Desktop version?

In the desktop version, click on the "**i**" icon to view the menu displayed by it, then enter the information in the box on the left side. The information entered in the box on the left side is automatically displayed in the box on the right side, with the format applied.

### Create Notes

<img :src="$withBase('/images/components/notes/create-notes-in-desktop-version.gif')" />

## How is it used in the mobile version?

In the mobile version, it must be positioned at the bottom of the window to view the options "**Notes**" and "**Activity**", then enter the information in the box on the left side. The information entered in the box on the left side is automatically displayed in the box on the right side, with the format applied.

### Create Notes

<img :src="$withBase('/images/components/notes/create-notes-in-the-mobile-version.gif')" />

## Developer Options

The **Notes** panel is located in the following path:

```bash
└── src                      # Main source code.
    └── components           # Global components.
        └── ADempiere        # ADempiere specific components.
            └── ChatEntries  # Main component directory Notes.

```
Here you can see a [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/53418?tabParent=0&action=fa50908e-40f1-11e9-91a1-0242ac140002)

The **Notes** service consumption call can be found in the following path:
```bash
└─ src                            # Main source code.
    └─ api                        # Global Services
      └─ ADempiere                # ADempiere's specific services
            └─ window             # Main service directory Notes

```


The services called from the component are  <br>
[POST /adempiere-api/logs/list-chat-entries](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-log.html#post-adempiere-api-logs-list-chat-entries)<br>
[POST /api/user-interface/component/notes/create-chat-entry](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#post-api-user-interface-component-notes-create-chat-entry)<br>
[POST /adempiere-api/logs/list-entity-chats](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-log.html#post-adempiere-api-logs-list-entity-chats)