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

export default [
  // Product Code
  {
    elementColumnName: 'ProductValue',
    columnName: 'ProductValue',
    tabindex: '1',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      handleFocusGained: true,
      handleActionPerformed: true,
      handleActionKeyPerformed: true
    }
  }
  // {
  //   elementColumnName: 'QtyEntered',
  //   columnName: 'QtyEntered',
  //   tabindex: '2',
  //   isFromDictionary: true,
  //   overwriteDefinition: {
  //     size: 24,
  //     sequence: 8,
  //     handleActionPerformed: true,
  //     handleContentSelection: true,
  //     handleActionKeyPerformed: true
  //   }
  // },
  // {
  //   elementColumnName: 'PriceEntered',
  //   columnName: 'PriceEntered',
  //   tabindex: '3',
  //   isFromDictionary: true,
  //   overwriteDefinition: {
  //     size: 24,
  //     sequence: 9,
  //     isReadOnly: true,
  //     handleActionPerformed: true,
  //     handleContentSelection: true,
  //     handleActionKeyPerformed: true
  //   }
  // },
  // {
  //   elementColumnName: 'Discount',
  //   columnName: 'Discount',
  //   tabindex: '4',
  //   isFromDictionary: true,
  //   overwriteDefinition: {
  //     size: 24,
  //     sequence: 10,
  //     isReadOnly: true,
  //     handleActionPerformed: true,
  //     handleContentSelection: true,
  //     handleActionKeyPerformed: true
  //   }
  // },
  // {
  //   tableName: 'C_Order',
  //   columnName: 'C_Currency_ID',
  //   isFromDictionary: true,
  //   overwriteDefinition: {
  //     size: 24,
  //     handleActionKeyPerformed: true,
  //     handleActionPerformed: true,
  //     validationCode: 'C_Currency.C_Currency_ID = 100',
  //     isActiveLogics: false,
  //     isMandatory: true
  //   }
  // }
  // // TenderType
  // {
  //   tableName: 'C_Payment',
  //   elementColumnName: 'TenderType',
  //   columnName: 'TenderType',
  //   isFromDictionary: true,
  //   overwriteDefinition: {
  //     defaultValue: 'X',
  //     handleActionKeyPerformed: true,
  //     handleContentSelection: true,
  //     handleActionPerformed: true,
  //     size: 24,
  //     isActiveLogics: false,
  //     isMandatory: true
  //   }
  // }
]
