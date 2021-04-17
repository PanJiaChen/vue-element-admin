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

// List of fields to send for create new
const tableName = 'C_BPartner'
export default [
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    isFromDictionary: true,
    tabindex: '0',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    tableName,
    tabindex: '1',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'Name2',
    columnName: 'Name2',
    tableName,
    tabindex: '2',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'EMail',
    columnName: 'EMail',
    tableName: 'AD_user',
    tabindex: '3',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'Phone',
    columnName: 'Phone',
    tableName: 'AD_user',
    tabindex: '4',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'C_Location_ID',
    columnName: 'C_Location_ID',
    tableName: 'C_BPartner_Location',
    tabindex: '5',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      componentPath: 'FieldLocation',
      handleActionPerformed: false,
      isSendParentValues: true,
      popoverPlacement: 'top',
      isMandatory: true
    }
  }
]
