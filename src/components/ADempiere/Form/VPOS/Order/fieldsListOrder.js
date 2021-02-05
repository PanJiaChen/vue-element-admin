export default [
  // Product Code
  {
    elementColumnName: 'ProductValue',
    columnName: 'ProductValue',
    tabindex: '1',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      handleFocusGained: true,
      handleActionPerformed: true,
      handleActionKeyPerformed: true
    }
  },
  {
    elementColumnName: 'QtyEntered',
    columnName: 'QtyEntered',
    tabindex: '2',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 8,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true
    }
  },
  {
    elementColumnName: 'PriceEntered',
    columnName: 'PriceEntered',
    tabindex: '3',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 9,
      isReadOnly: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true
    }
  },
  {
    elementColumnName: 'Discount',
    columnName: 'Discount',
    tabindex: '4',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      isReadOnly: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true
    }
  },
  {
    tableName: 'C_Order',
    columnName: 'C_Currency_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      validationCode: 'C_Currency.C_Currency_ID = 100',
      isActiveLogics: false,
      isMandatory: true
    }
  },
  // TenderType
  {
    tableName: 'C_Payment',
    elementColumnName: 'TenderType',
    columnName: 'TenderType',
    isFromDictionary: true,
    overwriteDefinition: {
      defaultValue: 'X',
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      isActiveLogics: false,
      isMandatory: true
    }
  }
]
