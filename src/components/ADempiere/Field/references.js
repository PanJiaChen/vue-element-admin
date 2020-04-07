
/**
 * All references
 * {number} id: Identifiert to field reference
 * {string|array} valueType: to convert and send server with gRPC
 * {boolean} isSupported: Indicate if field is suported
 */
const REFERENCES = [
  {
    id: 25,
    type: 'FieldText',
    support: false,
    description: 'Account Element',
    valueType: 'INTEGER',
    alias: ['Account']
  },
  {
    id: 12,
    type: 'FieldNumber',
    support: true,
    description: 'Number with 4 decimals',
    valueType: 'DECIMAL',
    alias: ['Amount']
  },
  {
    id: 33,
    type: 'FieldText',
    support: false,
    description: 'Resource Assignment',
    valueType: 'INTEGER',
    alias: ['Assignment']
  },
  {
    id: 23,
    type: 'FieldBinary',
    support: true,
    description: 'Binary Data',
    valueType: 'INTEGER',
    alias: ['Binary']
  },
  {
    // this component is hidden
    id: 28,
    type: 'FieldButton',
    support: true,
    description: 'Command Button - starts a process',
    valueType: 'STRING',
    alias: ['Button']
  },
  {
    id: 53370,
    type: 'FieldText',
    support: false,
    description: 'Chart',
    valueType: 'INTEGER',
    alias: ['Chart']
  },
  {
    id: 27,
    type: 'FieldText',
    support: false,
    description: 'Color element',
    valueType: 'INTEGER',
    alias: ['Color']
  },
  {
    id: 37,
    type: 'FieldNumber',
    support: true,
    description: 'Costs + Prices (minimum currency precision but if exists more)',
    valueType: 'DECIMAL',
    alias: ['Costs+Prices', 'CostsPrices', 'Cost Prices']
  },
  {
    id: 15,
    type: 'FieldDate',
    support: true,
    description: 'Date mm/dd/yyyy',
    valueType: 'DATE',
    alias: ['Date']
  },
  {
    id: 16,
    type: 'FieldDate',
    support: true,
    description: 'Date with time',
    valueType: 'DATE',
    alias: ['DateTime', 'Date Time', 'Date+Time']
  },
  {
    id: 39,
    type: 'FieldText',
    support: true,
    description: 'Local File',
    valueType: 'STRING',
    alias: ['FileName', 'File Name']
  },
  {
    id: 38,
    type: 'FieldText',
    support: true,
    description: 'Local File Path',
    valueType: 'STRING',
    alias: ['FilePath', 'File Path']
  },
  {
    id: 53670,
    type: 'FieldText',
    support: true,
    description: 'Local File Path or Name',
    valueType: 'STRING',
    alias: ['FilePathOrName', 'File Path Or Name']
  },
  {
    id: 13,
    type: 'FieldNumber',
    support: true,
    description: '10 Digit Identifier',
    valueType: 'INTEGER',
    alias: ['ID']
  },
  {
    id: 32,
    type: 'FieldImage',
    support: true,
    description: 'Binary Image Data',
    valueType: 'INTEGER',
    alias: ['Image']
  },
  {
    id: 11,
    type: 'FieldNumber',
    support: true,
    description: '10 Digit numeric',
    valueType: 'INTEGER',
    alias: ['Integer']
  },
  {
    id: 17,
    type: 'FieldSelect',
    support: true,
    description: 'Reference List',
    valueType: 'STRING',
    alias: ['List']
  },
  {
    id: 21,
    type: 'FieldText',
    support: false,
    description: 'Location/Address',
    valueType: 'INTEGER',
    alias: ['Location', 'Location (Address)', 'Location/Address']
  },
  {
    id: 31,
    type: 'FieldSelect',
    support: true,
    description: 'Warehouse Locator Data type',
    valueType: 'INTEGER',
    alias: ['Locator', 'Locator (WH)', 'Locator/WH']
  },
  {
    id: 34,
    type: 'FieldTextLong',
    support: true,
    valueType: 'STRING',
    description: 'Reference List',
    alias: ['Memo']
  },
  {
    id: 22,
    type: 'FieldNumber',
    support: true,
    description: 'Float Number',
    valueType: 'DECIMAL',
    alias: ['Number']
  },
  {
    id: 42,
    type: 'FieldText',
    support: true,
    description: 'Printer Name',
    valueType: 'STRING',
    alias: ['PrinterName', 'Printer Name']
  },
  {
    id: 35,
    type: 'FieldText',
    support: false,
    description: 'Product Attribute',
    valueType: 'INTEGER',
    alias: ['ProductAttribute', 'Product Attribute']
  },
  {
    id: 29,
    type: 'FieldNumber',
    support: true,
    description: 'Quantity data type',
    valueType: 'DECIMAL',
    alias: ['Quantity']
  },
  {
    id: 30,
    type: 'FieldSelect',
    support: true,
    description: 'Search Field',
    valueType: 'INTEGER',
    alias: ['Search']
  },
  {
    id: 10,
    type: 'FieldText',
    support: true,
    description: 'Character String',
    valueType: 'STRING',
    alias: ['String']
  },
  {
    id: 18,
    type: 'FieldSelect',
    support: true,
    description: 'Table List',
    valueType: 'INTEGER',
    alias: ['Table']
  },
  {
    id: 19,
    type: 'FieldSelect',
    support: true,
    description: 'Direct Table Access',
    valueType: 'INTEGER',
    alias: ['TableDirect', 'Table Direct']
  },
  {
    id: 14,
    type: 'FieldText',
    support: true,
    description: 'Character String up to 2000 characters',
    valueType: 'STRING',
    alias: ['Text']
  },
  {
    id: 36,
    type: 'FieldTextLong',
    support: true,
    description: 'Text (Long) - Text > 2000 characters',
    valueType: 'STRING',
    alias: ['TextLong', 'Text Long']
  },
  {
    id: 24,
    type: 'FieldTime',
    support: true,
    description: 'Time',
    valueType: 'DATE',
    alias: ['Time']
  },
  {
    id: 40,
    type: 'FieldText',
    support: true,
    description: 'URL',
    valueType: 'STRING',
    alias: ['URL', 'Url']
  },
  {
    id: 20,
    type: 'FieldYesNo',
    support: true,
    description: 'CheckBox',
    valueType: 'BOOLEAN',
    alias: ['YesNo', 'Yes No', 'Yes-No']
  }
]
export default REFERENCES

export const FIELD_RANGE = [
  {
    id: 12,
    type: 'Amount',
    description: 'Number with 4 decimals',
    alias: ['Amount']
  },
  {
    id: 37,
    type: 'Costs+Prices',
    description: 'Costs + Prices (minimum currency precision but if exists more)',
    alias: ['Costs+Prices', 'CostsPrices', 'Cost Prices']
  },
  {
    id: 15,
    type: 'Date',
    description: 'Date mm/dd/yyyy',
    alias: ['Date']
  },
  {
    id: 16,
    type: 'DateTime',
    description: 'Date with time',
    alias: ['DateTime', 'Date Time', 'Date+Time']
  },
  {
    id: 11,
    type: 'Integer',
    description: '10 Digit numeric',
    alias: ['Integer']
  },
  {
    id: 22,
    type: 'Number',
    description: 'Float Number',
    alias: ['Number']
  },
  {
    id: 29,
    type: 'Quantity',
    description: 'Quantity data type',
    alias: ['Quantity']
  },
  {
    id: 24,
    type: 'Time',
    description: 'Time',
    alias: ['Time']
  }
]

export const FIELD_NOT_SHOWED = [
  {
    id: 28,
    type: 'Button',
    description: 'Command Button - starts a process',
    alias: ['Button']
  }
]

/**
 * Fields with this column name, changed all fields is read only
 */
export const FIELD_READ_ONLY_FORM = [
  {
    columnName: 'IsActive', // column name of field
    defaultValue: true, // default value when loading
    valueIsReadOnlyForm: false, // value that activates read-only form
    isChangedAllForm: false // change the entire form to read only including this field
  },
  {
    columnName: 'Processed',
    defaultValue: false,
    valueIsReadOnlyForm: true,
    isChangedAllForm: true
  },
  {
    columnName: 'Processing',
    defaultValue: true,
    valueIsReadOnlyForm: false,
    isChangedAllForm: true
  }
]

export const FIELDS_DECIMALS = ['Amount', 'Costs+Prices', 'Number', 'Quantity']

export const FIELDS_QUANTITY = ['Amount', 'Costs+Prices', 'Integer', 'Number', 'Quantity']
