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
  // Amont
  {
    tableName,
    elementColumnName: 'PayAmt',
    columnName: 'PayAmt',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 0,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      isNumericField: true,
      isActiveLogics: true,
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
      sequence: 1,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // Currency
  // Bank
  {
    tableName,
    columnName: 'C_Bank_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 2,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      displayLogic: `@TenderType@<>'X'&@TenderType@<>'Z'`,
      size: 24,
      isActiveLogics: true,
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
      sequence: 3,
      isCustomField: true,
      size: 24,
      isMandatory: true,
      displayLogic: `@TenderType@=='P'&@TenderType@=='C'&@TenderType@=='D'`
    }
  },
  // Date
  {
    tableName,
    elementColumnName: 'DateTrx',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 4,
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
  {
    elementColumnName: 'EMail',
    columnName: 'EMail',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 5,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      displayLogic: `@TenderType@=='Z'`,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // ReferenceNo
  {
    tableName: 'HR_Attribute',
    elementColumnName: 'ReferenceNo',
    columnName: 'ReferenceNo',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 6,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      displayLogic: `@TenderType@<>'X'&@TenderType@<>'C' `,
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
