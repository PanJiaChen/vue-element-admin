
export const OPERATORS = [
  {
    operator: 'EQUAL',
    symbol: '='
  },
  {
    operator: 'NOT_EQUAL',
    symbol: '<>'
  },
  {
    operator: 'LIKE',
    symbol: '%'
  },
  {
    operator: 'NOT_LIKE',
    symbol: '!%'
  },
  {
    operator: 'GREATER',
    symbol: '>'
  },
  {
    operator: 'GREATER_EQUAL',
    symbol: '>='
  },
  {
    operator: 'LESS',
    symbol: '<'
  },
  {
    operator: 'LESS_EQUAL',
    symbol: '<='
  },
  {
    operator: 'BETWEEN',
    symbol: '>-<'
  },
  {
    operator: 'NOT_NULL',
    symbol: ''
  },
  {
    operator: 'NULL',
    symbol: ''
  },
  {
    operator: 'IN',
    symbol: '()'
  },
  {
    operator: 'NOT_IN',
    symbol: '!()'
  }
]

// Components associated with search type
export const FIELD_OPERATORS_LIST = [
  {
    type: 'FieldBinary',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'IN', 'NOT_IN', 'NULL', 'NOT_NULL']
  },
  {
    type: 'FieldButton',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'IN', 'NOT_IN', 'NULL', 'NOT_NULL']
  },
  {
    type: 'FieldDate',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'GREATER', 'GREATER_EQUAL', 'LESS', 'LESS_EQUAL', 'IN', 'NOT_IN', 'NULL', 'NOT_NULL']
  },
  {
    type: 'FieldImage',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'IN', 'NOT_IN', 'NULL', 'NOT_NULL']
  },
  {
    type: 'FieldNumber',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'GREATER', 'GREATER_EQUAL', 'LESS', 'LESS_EQUAL', 'IN', 'NOT_IN', 'NULL', 'NOT_NULL']
  },
  {
    type: 'FieldSelect',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'IN', 'NOT_IN', 'IN', 'NOT_IN', 'NULL', 'NOT_NULL']
  },
  {
    type: 'FieldText',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'LIKE', 'NOT_LIKE', 'IN', 'NOT_IN', 'NULL', 'NOT_NULL']
  },
  {
    type: 'FieldTextLong',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'LIKE', 'NOT_LIKE', 'IN', 'NOT_IN', 'NULL', 'NOT_NULL']
  },
  {
    type: 'FieldTime',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'GREATER', 'GREATER_EQUAL', 'LESS', 'LESS_EQUAL', 'IN', 'NOT_IN', 'NULL', 'NOT_NULL']
  },
  {
    type: 'FieldYesNo',
    isRange: false,
    conditionsList: ['EQUAL', 'NOT_EQUAL', 'NULL', 'NOT_NULL']
  }
]
