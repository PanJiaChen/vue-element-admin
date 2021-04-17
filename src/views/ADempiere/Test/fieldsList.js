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
