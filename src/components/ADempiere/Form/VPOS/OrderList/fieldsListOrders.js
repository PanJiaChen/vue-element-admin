const tableName = 'C_Order'

export default [
  {
    tableName,
    elementColumnName: 'DocumentNo',
    columnName: 'DocumentNo',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'C_BPartner_ID',
    columnName: 'C_BPartner_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    columnName: 'GrandTotal',
    elementColumnName: 'GrandTotal',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'OpenAmt',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'IsPaid',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'Processed',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'IsAisleSeller',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'IsInvoiced',
    columnName: 'IsInvoiced ',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'DateOrdered',
    columnName: 'DateOrdered',
    isFromDictionary: true,
    overwriteDefinition: {
      columnName: 'DateOrderedFrom',
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'DateOrdered',
    columnName: 'DateOrderedTo',
    isFromDictionary: true,
    overwriteDefinition: {
      columnName: 'DateOrderedTo',
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'SalesRep_ID',
    columnName: 'SalesRep_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  }
]
