// List of fields to send for create new
const tableName = 'C_BPartner'
export default [
  {
    columnName: 'Value',
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      // name: 'Search Key',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Name',
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      // name: 'Name',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Name2',
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      // name: 'Contact Name',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'EMail',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      // name: 'E-Mail Address',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Phone',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
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
