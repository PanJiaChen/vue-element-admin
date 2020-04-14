// This file is used for set a static values for references of fields,
// currently exists for ADempiere metadata distints display types and are represented for follow:

// Account Element
export const ACCOUNT_ELEMENT = {
  id: 25,
  type: 'FieldText',
  support: false,
  description: 'Account Element',
  valueType: 'INTEGER',
  alias: ['Account']
}

// Number
export const NUMBER = {
  id: 12,
  type: 'FieldNumber',
  support: true,
  description: 'Number with 4 decimals',
  valueType: 'DECIMAL',
  alias: ['Amount']
}

// Resource Assignment
export const RESOURCE_ASSIGNMENT = {
  id: 33,
  type: 'FieldText',
  support: false,
  description: 'Resource Assignment',
  valueType: 'INTEGER',
  alias: ['Assignment']
}

// Binary Data
export const BINARY_DATA = {
  id: 23,
  type: 'FieldBinary',
  description: 'Binary Data',
  support: true,
  valueType: 'INTEGER',
  alias: ['Binary']
}

// Button
export const BUTTON = {
  // this component is hidden
  id: 28,
  type: 'FieldButton',
  description: 'Command Button - starts a process',
  support: true,
  valueType: 'STRING',
  alias: ['Button']
}

// Chart
export const CHART = {
  id: 53370,
  type: 'FieldText',
  support: false,
  description: 'Chart',
  valueType: 'STRING',
  alias: ['Chart']
}

// Color
export const COLOR = {
  id: 27,
  type: 'FieldText',
  support: false,
  description: 'Color element',
  valueType: 'INTEGER',
  alias: ['Color']
}

export const COSTS_PLUS_PRICES = {
  id: 37,
  type: 'FieldNumber',
  support: true,
  description: 'Costs + Prices (minimum currency precision but if exists more)',
  valueType: 'DECIMAL',
  alias: ['Costs+Prices', 'CostsPrices', 'Cost Prices']
}

// Date
export const DATE = {
  id: 15,
  type: 'FieldDate',
  support: true,
  description: 'Date mm/dd/yyyy',
  valueType: 'DATE',
  alias: ['Date']
}

// Date with time
export const DATE_PLUS_TIME = {
  id: 16,
  type: 'FieldDate',
  support: true,
  description: 'Date with time',
  valueType: 'DATE',
  alias: ['DateTime', 'Date Time', 'Date+Time']
}

// Local File
export const LOCAL_FILE = {
  id: 39,
  type: 'FieldText',
  support: true,
  description: 'Local File',
  valueType: 'STRING',
  alias: ['FileName', 'File Name']
}

// Local File Path
export const LOCAL_FILE_PATH = {
  id: 38,
  type: 'FieldText',
  support: true,
  description: 'Local File Path',
  valueType: 'STRING',
  alias: ['FilePath', 'File Path']
}

// Local File Path or Name
export const LOCAL_FILE_PATH_OR_NAME = {
  id: 53670,
  type: 'FieldText',
  support: true,
  description: 'Local File Path or Name',
  valueType: 'STRING',
  alias: ['FilePathOrName', 'File Path Or Name']
}

// ID
export const ID = {
  id: 13,
  type: 'FieldNumber',
  support: true,
  description: '10 Digit Identifier',
  valueType: 'INTEGER',
  alias: ['ID']
}

// Binary Image Data
export const BINARY = {
  id: 32,
  type: 'FieldImage',
  support: true,
  description: 'Binary Image Data',
  valueType: 'INTEGER',
  alias: ['Image']
}

// Integer
export const INTEGER = {
  id: 11,
  type: 'FieldNumber',
  support: true,
  description: '10 Digit numeric',
  valueType: 'INTEGER',
  alias: ['Integer']
}

// Reference List
export const LIST = {
  id: 17,
  type: 'FieldSelect',
  support: true,
  description: 'Reference List',
  valueType: 'STRING',
  alias: ['List']
}

// Location Address
export const LOCATION_ADDRESS = {
  id: 21,
  type: 'FieldText',
  support: false,
  description: 'Location/Address',
  valueType: 'INTEGER',
  alias: ['Location', 'Location (Address)', 'Location/Address']
}

// Warehouse Locator Data type
export const LOCATOR_WAREHOUSE = {
  id: 31,
  type: 'FieldSelect',
  support: true,
  description: 'Warehouse Locator Data type',
  valueType: 'INTEGER',
  alias: ['Locator', 'Locator (WH)', 'Locator/WH']
}

// Memo
export const MEMO = {
  id: 34,
  type: 'FieldTextLong',
  support: true,
  valueType: 'STRING',
  description: 'Reference List',
  alias: ['Memo']
}

// Float Number
export const FLOAT = {
  id: 22,
  type: 'FieldNumber',
  support: true,
  description: 'Float Number',
  valueType: 'DECIMAL',
  alias: ['Number']
}

// Printer Name
export const PRINTER_NAME = {
  id: 42,
  type: 'FieldText',
  support: true,
  description: 'Printer Name',
  valueType: 'STRING',
  alias: ['PrinterName', 'Printer Name']
}

// Product Attribute
export const PRODUCT_ATTRIBUTE = {
  id: 35,
  type: 'FieldText',
  support: false,
  description: 'Product Attribute',
  valueType: 'INTEGER',
  alias: ['ProductAttribute', 'Product Attribute']
}

// Quantity
export const QUANTITY = {
  id: 29,
  type: 'FieldNumber',
  support: true,
  description: 'Quantity data type',
  valueType: 'DECIMAL',
  alias: ['Quantity']
}

// Search
export const SEARCH = {
  id: 30,
  type: 'FieldSelect',
  support: true,
  description: 'Search Field',
  valueType: 'INTEGER',
  alias: ['Search']
}

// Char
export const CHAR = {
  id: 10,
  type: 'FieldText',
  support: true,
  description: 'Character String',
  valueType: 'STRING',
  alias: ['String']
}

// Table List
export const TABLE = {
  id: 18,
  type: 'FieldSelect',
  support: true,
  description: 'Table List',
  valueType: 'INTEGER',
  alias: ['Table']
}

// Table Dir
export const TABLE_DIR = {
  id: 19,
  type: 'FieldSelect',
  support: true,
  description: 'Direct Table Access',
  valueType: 'INTEGER',
  alias: ['TableDirect', 'Table Direct']
}

// Text
export const TEXT = {
  id: 14,
  type: 'FieldText',
  support: true,
  description: 'Character String up to 2000 characters',
  valueType: 'STRING',
  alias: ['Text']
}

// Text Long
export const TEXT_LONG = {
  id: 36,
  type: 'FieldTextLong',
  support: true,
  description: 'Text (Long) - Text > 2000 characters',
  valueType: 'STRING',
  alias: ['TextLong', 'Text Long']
}

// Time
export const TIME = {
  id: 24,
  type: 'FieldTime',
  support: true,
  description: 'Time',
  valueType: 'DATE',
  alias: ['Time']
}

// URL
export const URL = {
  id: 40,
  type: 'FieldText',
  support: true,
  description: 'URL',
  valueType: 'STRING',
  alias: ['URL', 'Url']
}

// Yes No
export const YES_NO = {
  id: 20,
  type: 'FieldYesNo',
  support: true,
  description: 'CheckBox',
  valueType: 'BOOLEAN',
  alias: ['YesNo', 'Yes No', 'Yes-No']
}

/**
 * All references
 * {number} id: Identifiert to field reference
 * {string|array} valueType: to convert and send server with gRPC
 * {boolean} isSupported: Indicate if field is suported
 */
const REFERENCES = [
  ACCOUNT_ELEMENT,
  NUMBER,
  RESOURCE_ASSIGNMENT,
  BINARY_DATA,
  BUTTON,
  CHART,
  COLOR,
  COSTS_PLUS_PRICES,
  DATE,
  DATE_PLUS_TIME,
  LOCAL_FILE,
  LOCAL_FILE_PATH,
  LOCAL_FILE_PATH_OR_NAME,
  ID,
  BINARY,
  INTEGER,
  LIST,
  LOCATION_ADDRESS,
  LOCATOR_WAREHOUSE,
  MEMO,
  FLOAT,
  PRINTER_NAME,
  PRODUCT_ATTRIBUTE,
  QUANTITY,
  SEARCH,
  CHAR,
  TABLE,
  TABLE_DIR,
  TEXT,
  TEXT_LONG,
  TIME,
  URL,
  YES_NO
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

export const FIELDS_DECIMALS = [NUMBER.id, QUANTITY.id, COSTS_PLUS_PRICES.id]

export const FIELDS_QUANTITY = [NUMBER.id, QUANTITY.id, INTEGER.id, COSTS_PLUS_PRICES.id]
