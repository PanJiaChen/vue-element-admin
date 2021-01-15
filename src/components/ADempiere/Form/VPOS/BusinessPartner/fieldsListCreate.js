// List of fields to send for create new
const tableName = 'C_BPartner'
export default [
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'Name2',
    columnName: 'Name2',
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'EMail',
    columnName: 'EMail',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'Phone',
    columnName: 'Phone',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'C_Location_ID',
    columnName: 'C_Location_ID',
    tableName: 'C_BPartner_Location',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      componentPath: 'FieldLocation',
      handleActionPerformed: false,
      isSendParentValues: true,
      popoverPlacement: 'top'
    }
  }
]
