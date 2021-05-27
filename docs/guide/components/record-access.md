# Record Access

Allows you to configure the access that each role will have to a specific record or view based on the following parameters:

  - **Available Roles**: There are all the roles created in ADempiere, which do not have any configuration of the registry which is positioned
  - **Configured Roles**: There are the roles which will have a configuration of access or blocking to a specific record, these accesses or
  locks depends on the following options:
    - Block: When this option is checked, the role is blocked from accessing and viewing the registry, having this option enabled enables the following option:
      - Dependent Entities: Checking this option leaves only one records active and the other records dependent on it blocks them
    - Unlock: Checking this option enables or activates the visualization of the records, having this option enabled the following options are enabled:
      - Read Only: You can view in read mode (You cannot edit or create) the records that are associated with the role
      - Editable: You can view in read and write mode (you can edit or create)

## ADempiere-ZK version

<img :src="$withBase('/images/components/record-access/ad-zk-window-record-access.png')" alt="Acceso a Registro Versión de Escritorio ZK" width="800px">

## ADempiere-Vue version

<img :src="$withBase('/images/components/record-access/ad-vue-window-record-access.png')" alt="Acceso a Registro ADempiere-Vue de Escritorio" width="800px">

By using this configuration by records, you are customizing the display and access that each role will have in ADempiere, where you can activate the display of 
a record, block or simply exclude, when the role is in the "Available Roles" section, it would indicate that It does not have any configuration on that record, 
if you want to activate any configuration, whether to activate or block, you would have to pass the role to the "Configured Roles" section and apply the option 
you want with that role on that specific record.

It should be noted that this action in ADempiere applies only records per record and per role; a practical case for the functions of the "Access to Registry" is 
the following:

It is required to give access to two types of documents, one read and write, another read only and block the view of another type of document
  
  - For reading and writing access to the document: The document type must be located in ADempiere, go to the "Access to Registry" action, locate the role and go to the "Configured Roles" section, select the "Unblock" option and " Editable "
  
  - To access the document only read: The type of document must be located in ADempiere, go to the action "Access to Registry", locate the role and go to the section "Configured Roles", select the option "Unblock" and "Only Read "
  - To block a document: ADempiere the type of document must be located, go to the action "Access to Registry", locate the role and go to the section "Configured Roles" and select the option "Block"

## Where it is located?

This action is located those windows that have in the actions menu

<img :src="$withBase('/images/components/record-access/ad-vue-location-record-access.png')" alt="Acceso a Registro ADempiere-Vue Escritorio" width="800px">


## What is it for?

It is used to configure the accesses and locks of a role in a specific registry

## Functions or Observations
- Function: Configuration of roles to give access or block a record
- Observation: It only applies by registers and by roles, that is, if you want to configure one or more registers, they must do one by one


## How is it used in the Desktop version?

In the written version, this component is used as follows:

- First of all, the actions menu button must be located, then check the option "Access to Registry"

- When this option is checked, a window will be displayed showing the list of roles which will configure the accesses or locks of the registry in which it is positioned.


## How is it used in the mobile version?

In the mobile version this component is used as follows:

- First of all, the actions menu button must be located, then check the option "Access to Registry"

- When this option is checked, a window will be displayed on the right side where it shows a list of roles which will configure the accesses or locks of the registry in which it is positioned.


## Developer Options

The **Records Access** dialog is located in the following path:

```bash
└── src                             # Main source code
    └── components                  # Global components
        └── ADempiere               # ADempiere specific components
            └── RecordAccess        # Records Access main directory

```
Here you can see a [Demo](https://demo-ui.erpya.com/#/7aa4242a-93c0-42d8-92be-8250002d3e3c/d97027fd-4cd5-445e-8fd8-ef5d3f7959b4/window/147?tabParent=0&tabChild=0&action=43adbe9d-04a7-4cf6-9582-895c1e40da0b&typeAction=recordAccess)

The **Records Access** service consumption call can be found in the following path:
```bash
└─ src                            # Main source code.
    └─ api                        # Global services
      └─ ADempiere                # ADempiere specific services
            └─ actions            # Actions
                └─ record-access  # Records Access main service directory

```


The services called from the component are <br>
[GET /api/user-interface/component/record-access/record-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-component-record-access-record-access)<br>
[POST /api/user-interface/component/record-access/record-access](https://adempiere.github.io/proxy-adempiere-api/guide/default-modules/adempiere-api/user-interface.html#get-api-user-interface-component-record-access-record-access)

