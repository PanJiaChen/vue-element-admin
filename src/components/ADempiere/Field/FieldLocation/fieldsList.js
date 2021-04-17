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

const fieldBase = {
  tableName: 'C_Location',
  isFromDictionary: true,
  overwriteDefinition: {
    size: 24,
    index: 0
  }
}

export default [
  {
    ...fieldBase,
    elementColumnName: 'C_Location_ID',
    columnName: 'C_Location_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      isDisplayed: false,
      index: 1
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_Country_ID',
    columnName: 'C_Country_ID',
    overwriteDefinition: {
      isCustomField: true,
      isActiveLogics: true, // enable logics
      defaultValue: '@#C_Country_ID@',
      size: 24,
      sequenceFields: 'CO',
      index: 2,
      isMandatory: true
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_Region_ID',
    columnName: 'C_Region_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'R',
      index: 3,
      isMandatory: true
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_City_ID',
    columnName: 'C_City_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'C',
      index: 4,
      isMandatory: true
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address1',
    columnName: 'Address1',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A1',
      index: 5
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address2',
    columnName: 'Address2',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A2',
      index: 6
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address3',
    columnName: 'Address3',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A3',
      index: 7
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address4',
    columnName: 'Address4',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A4',
      index: 8
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Postal',
    columnName: 'Postal',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'P',
      index: 9
    }
  }
]
