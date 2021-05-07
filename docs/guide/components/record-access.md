# Access to Records

Allows you to configure the access that each role will have to a specific record or view based on the following parameters:

  - ** Available Roles **: There are all the roles created in ADempiere, which do not have any configuration of the registry which is positioned
  - ** Configured Roles **: There are the roles which will have a configuration of access or blocking to a specific record, these accesses or
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
