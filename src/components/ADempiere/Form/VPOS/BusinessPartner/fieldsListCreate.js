// List of fields to send for create new
export default [
  {
    columnName: 'Value',
    // displayType: CHAR.id,
    definition: {
      name: 'Search Key',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Name',
    // displayType: CHAR.id,
    definition: {
      name: 'Name',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Contact',
    // displayType: CHAR.id,
    definition: {
      name: 'Contact Name',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'EMail',
    // displayType: CHAR.id,
    definition: {
      name: 'E-Mail Address',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Postal',
    // displayType: CHAR.id,
    definition: {
      name: 'Postal Code',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Phone',
    // displayType: CHAR.id,
    definition: {
      name: 'Phone',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'C_Location_ID',
    tableName: 'C_BPartner_Location',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      handleActionPerformed: false,
      isSendParentValues: true,
      popoverPlacement: 'top'
    }
  }
]
