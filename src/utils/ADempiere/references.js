// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// This file is used for set a static values for references of fields,
// currently exists for ADempiere metadata distints display types and are represented for follow:
export const DEFAULT_SIZE = {
  xs: 6,
  sm: 8,
  md: 2,
  lg: 6,
  xl: 6
}

// Account Element
export const ACCOUNT_ELEMENT = {
  id: 25,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Amount (Number with 4 decimals)
export const AMOUNT = {
  id: 12,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Resource Assignment
export const RESOURCE_ASSIGNMENT = {
  id: 33,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Binary Data (display type BLOB)
export const BINARY_DATA = {
  id: 23,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldBinary',
  size: {
    xs: 6,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6
  }
}

// Button
export const BUTTON = {
  // this component is hidden
  id: 28,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldButton',
  size: {
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0
  }
}

// Chart
export const CHART = {
  id: 53370,
  isSupported: false,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Color
export const COLOR = {
  id: 27,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldColor',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Cost or Prices
export const COSTS_PLUS_PRICES = {
  id: 37,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Date
export const DATE = {
  id: 15,
  isSupported: true,
  valueType: 'DATE',
  componentPath: 'FieldDate',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Date with time
export const DATE_PLUS_TIME = {
  id: 16,
  isSupported: true,
  valueType: 'DATE',
  componentPath: 'FieldDate',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Local File
export const LOCAL_FILE = {
  id: 39,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Local File Path
export const LOCAL_FILE_PATH = {
  id: 38,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Local File Path or Name
export const LOCAL_FILE_PATH_OR_NAME = {
  id: 53670,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// ID
export const ID = {
  id: 13,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Binary Image Data
export const IMAGE = {
  id: 32,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldImage',
  size: {
    xs: 6,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6
  }
}

// Integer
export const INTEGER = {
  id: 11,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Reference List
export const LIST = {
  id: 17,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldSelect',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Location Address
export const LOCATION_ADDRESS = {
  id: 21,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldLocation',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Warehouse Locator Data type
export const LOCATOR_WAREHOUSE = {
  id: 31,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldLocator',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Memo
export const MEMO = {
  id: 34,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldTextLong',
  size: {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24
  }
}

// Float Number
export const NUMBER = {
  id: 22,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Printer Name
export const PRINTER_NAME = {
  id: 42,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Product Attribute
export const PRODUCT_ATTRIBUTE = {
  id: 35,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Quantity
export const QUANTITY = {
  id: 29,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Search
export const SEARCH = {
  id: 30,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldSelect',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Char (display type String)
export const CHAR = {
  id: 10,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Table List
export const TABLE = {
  id: 18,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldSelect',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Table Dir
export const TABLE_DIRECT = {
  id: 19,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldSelect',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Text
export const TEXT = {
  id: 14,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Text Long
export const TEXT_LONG = {
  id: 36,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldTextLong',
  size: {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24
  }
}

// Time
export const TIME = {
  id: 24,
  isSupported: true,
  valueType: 'DATE',
  componentPath: 'FieldTime',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// URL
export const URL = {
  id: 40,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Yes No
export const YES_NO = {
  id: 20,
  isSupported: true,
  valueType: 'BOOLEAN',
  componentPath: 'FieldYesNo',
  size: {
    xs: 14,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 4
  }
}

export const FIELDS_LOOKUP = [
  LIST.id,
  TABLE.id,
  TABLE_DIRECT.id,
  SEARCH.id,
  ACCOUNT_ELEMENT.id,
  LOCATION_ADDRESS.id,
  LOCATOR_WAREHOUSE.id,
  PRODUCT_ATTRIBUTE.id,
  RESOURCE_ASSIGNMENT.id
]

// Some helper methods
export function isLookup(displayType) {
  return FIELDS_LOOKUP.includes(displayType)
}

/**
 * All references
 * {number} id: Identifiert to field reference
 * {string|array} valueType: to convert and send server with gRPC
 * {boolean} isSupported: Indicate if field is suported
 */
const REFERENCES = [
  ACCOUNT_ELEMENT,
  AMOUNT,
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
  IMAGE,
  INTEGER,
  LIST,
  LOCATION_ADDRESS,
  LOCATOR_WAREHOUSE,
  MEMO,
  NUMBER,
  PRINTER_NAME,
  PRODUCT_ATTRIBUTE,
  QUANTITY,
  SEARCH,
  // String as CHAR
  CHAR,
  TABLE,
  TABLE_DIRECT,
  TEXT,
  TEXT_LONG,
  TIME,
  URL,
  YES_NO
]
export default REFERENCES

export const FIELDS_RANGE = [
  AMOUNT,
  COSTS_PLUS_PRICES,
  DATE,
  DATE_PLUS_TIME,
  INTEGER,
  NUMBER,
  QUANTITY,
  TIME
]

/**
 * Fields not showed in panel's
 */
export const FIELDS_HIDDEN = [
  BUTTON
]

export const COLUMN_IS_ACTIVE = {
  columnName: 'IsActive', // column name of field
  defaultValue: true, // default value when loading
  valueIsReadOnlyForm: false, // value that activates read-only form
  isChangedAllForm: false // change the entire form to read only including this field
}

export const COLUMN_PROCESSED = {
  columnName: 'Processed',
  defaultValue: false,
  valueIsReadOnlyForm: true,
  isChangedAllForm: true
}

export const COLUMN_PROCESSING = {
  columnName: 'Processing',
  defaultValue: true,
  valueIsReadOnlyForm: false,
  isChangedAllForm: true
}

export const COLUMNS_NAME_READ_ONLY = [
  COLUMN_IS_ACTIVE.columnName,
  COLUMN_PROCESSED.columnName,
  COLUMN_PROCESSING.columnName
]

export const COLUMNS_NAME_DOCUMENT_STATUS = [
  'DocStatus',
  'O_DocStatus'
]

/**
 * Fields with this column name, changed all fields is read only
 */
export const COLUMNS_READ_ONLY_FORM = [
  COLUMN_IS_ACTIVE,
  COLUMN_PROCESSED,
  COLUMN_PROCESSING
]

export const FIELDS_DECIMALS = [
  AMOUNT.id,
  COSTS_PLUS_PRICES.id,
  NUMBER.id,
  QUANTITY.id
]

export const FIELDS_QUANTITY = [
  AMOUNT.id,
  COSTS_PLUS_PRICES.id,
  INTEGER.id,
  NUMBER.id,
  QUANTITY.id
]

/**
 * Manage the currency prefix/sufix in the format to display
 */
export const FIELDS_CURRENCY = [
  AMOUNT.id,
  COSTS_PLUS_PRICES.id
]
