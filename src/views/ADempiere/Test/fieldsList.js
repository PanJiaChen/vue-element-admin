import { URL, TEXT, AMOUNT, INTEGER, TEXT_LONG, TABLE_DIRECT } from '@/utils/ADempiere/references.js'

export default [
  // URL
  {
    columnName: 'URL',
    definition: {
      name: 'Web',
      handleRequestFocus: true,
      handleContentSelection: true,
      isCustomField: true,
      isActiveLogics: true, // enable logics
      displayType: URL.id
    }
  },
  // From Field UUID, Business Partner lookup field
  {
    isFromDictionary: true,
    uuid: '8ceabe8a-fb40-11e8-a479-7a0060f0aa01'
  },
  // From Column UUID, Paid yes-no field
  {
    isFromDictionary: true,
    columnUuid: '8b4bbb7e-fb40-11e8-a479-7a0060f0aa01'
  },
  // From Element Column Name
  {
    isFromDictionary: true,
    elementColumnName: 'M_RMA_ID'
  },
  // From Table and Column Name
  {
    tableName: 'C_BPartner',
    columnName: 'PaymentRule',
    isFromDictionary: true,
    overwriteDefinition: {
      isMandatory: true
    }
  },
  // Table direct
  // To be define
  {
    columnName: 'C_Currency_ID',
    definition: {
      name: 'Currency',
      displayType: TABLE_DIRECT.id,
      keyColumn: 'C_Currency.C_Currency_ID',
      reference: {
        directQuery: 'SELECT C_Currency.C_Currency_ID,NULL,C_Currency.ISO_Code,C_Currency.IsActive FROM C_Currency WHERE C_Currency.C_Currency_ID=?',
        query: 'SELECT C_Currency.C_Currency_ID,NULL,C_Currency.ISO_Code,C_Currency.IsActive FROM C_Currency ORDER BY 3'
      },
      isCustomField: true,
      isActiveLogics: true // enable logics
    }
  },
  // Text
  {
    columnName: 'Name',
    definition: {
      name: 'Only Name',
      displayType: TEXT.id,
      displayLogic: '@URL@!""',
      handleActionKeyPerformed: true,
      isCustomField: true,
      isActiveLogics: true // enable logics
    }
  },
  // Amount
  {
    columnName: 'Amount',
    definition: {
      name: 'Amount for it',
      displayType: AMOUNT.id,
      readOnlyLogic: '@C_Currency_ID@<>""',
      handleActionKeyPerformed: true,
      isCustomField: true,
      isActiveLogics: true // enable logics
    }
  },
  // Integer
  {
    columnName: 'SeqNo',
    definition: {
      name: 'Sequence for record',
      displayType: INTEGER.id,
      mandatoryLogic: '@URL@!""',
      showControl: 1,
      isCustomField: true,
      isActiveLogics: true // enable logics
    }
  },
  // Text Long
  {
    columnName: 'Description',
    definition: {
      name: 'Only Description',
      displayType: TEXT_LONG.id
    }
  }
]
