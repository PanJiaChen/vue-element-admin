const tableName = 'C_Order'

export default [
  // Currency
  {
    tableName,
    columnName: 'C_Currency_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      validationCode: 'C_Currency.C_Currency_ID = 100',
      isActiveLogics: true,
      isMandatory: true
    }
  }
]
