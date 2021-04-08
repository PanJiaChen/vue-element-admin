// List of fields to send for create new
const tableName = 'C_BPartner'
export default [
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    isFromDictionary: true,
    tabindex: '0',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    tableName,
    tabindex: '1',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'Name2',
    columnName: 'Name2',
    tableName,
    tabindex: '2',
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
    tabindex: '3',
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
    tabindex: '4',
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
    tabindex: '5',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      componentPath: 'FieldLocation',
      handleActionPerformed: false,
      isSendParentValues: true,
      popoverPlacement: 'top',
      isMandatory: true
    }
  }
]
