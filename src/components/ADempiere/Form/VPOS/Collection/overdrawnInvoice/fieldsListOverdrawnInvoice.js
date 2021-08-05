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

const tableName = 'C_Payment'

export default [
  // Name
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    tableName: 'C_BPartner',
    tabindex: '1',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 0,
      isCustomField: true,
      size: 24,
      isMandatory: true
    }
  },
  // Code
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    isFromDictionary: true,
    tabindex: '0',
    overwriteDefinition: {
      sequence: 1,
      isCustomField: true,
      size: 24,
      isMandatory: true
    }
  },
  // Phone
  {
    elementColumnName: 'Phone',
    columnName: 'Phone',
    tableName: 'AD_user',
    tabindex: '4',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 2,
      isCustomField: true,
      size: 24,
      isMandatory: true
    }
  },
  // TenderType
  {
    tableName,
    elementColumnName: 'TenderType',
    columnName: 'TenderType',
    isFromDictionary: true,
    overwriteDefinition: {
      defaultValue: 'X',
      sequence: 3,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'EMail',
    columnName: 'EMail',
    tableName: 'AD_user',
    tabindex: '3',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 4,
      isCustomField: true,
      displayLogic: `@TenderType@=='D'`,
      size: 24
    }
  },
  {
    tableName,
    elementColumnName: 'DateTrx',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 5,
      handleFocusGained: true,
      handleFocusLost: true,
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      size: 24,
      displayLogic: `@TenderType@=='K'`,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // Bank
  {
    tableName,
    columnName: 'C_Bank_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 6,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      displayLogic: `@TenderType@<>'X'`,
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // type credit card
  {
    tableName,
    elementColumnName: 'CreditCardType',
    columnName: 'CreditCardType',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 7,
      defaultValue: 'M',
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      displayLogic: `@TenderType@=='C'`,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // number credit card
  {
    tableName,
    elementColumnName: 'CreditCardNumber',
    columnName: 'CreditCardNumber',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 8,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      displayLogic: `@TenderType@=='C'`,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // accountno
  {
    tableName,
    elementColumnName: 'AccountNo',
    columnName: 'AccountNo',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 9,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      displayLogic: `@TenderType@=='M'`,
      isActiveLogics: true,
      isMandatory: true
    }
  }
]
