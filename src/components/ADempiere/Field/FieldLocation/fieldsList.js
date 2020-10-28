const fieldBase = {
  tableName: 'C_Location',
  isFromDictionary: true,
  overwriteDefinition: {
    size: 24,
    index: 0
  }
}

export default [
  {
    ...fieldBase,
    columnName: 'C_Location_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      isDisplayed: false,
      index: 1
    }
  },
  {
    ...fieldBase,
    columnName: 'C_Country_ID',
    overwriteDefinition: {
      isCustomField: true,
      isActiveLogics: true, // enable logics
      defaultValue: '@#C_Country_ID@',
      size: 24,
      sequenceFields: 'CO',
      index: 2
    }
  },
  {
    ...fieldBase,
    columnName: 'C_Region_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'R',
      index: 3
    }
  },
  {
    ...fieldBase,
    columnName: 'C_City_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'C',
      index: 4
    }
  },
  {
    ...fieldBase,
    columnName: 'Address1',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A1',
      index: 5
    }
  },
  {
    ...fieldBase,
    columnName: 'Address2',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A2',
      index: 6
    }
  },
  {
    ...fieldBase,
    columnName: 'Address3',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A3',
      index: 7
    }
  },
  {
    ...fieldBase,
    columnName: 'Address4',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A4',
      index: 8
    }
  },
  {
    ...fieldBase,
    columnName: 'Postal',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'P',
      index: 9
    }
  }
]
