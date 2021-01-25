export default [
  // Product Code
  {
    elementColumnName: 'ProductValue',
    columnName: 'ProductValue',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      handleActionPerformed: true,
      handleActionKeyPerformed: true
    }
  },
  {
    elementColumnName: 'QtyEntered',
    columnName: 'QtyEntered',
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
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      isReadOnly: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true
    }
  }
]
