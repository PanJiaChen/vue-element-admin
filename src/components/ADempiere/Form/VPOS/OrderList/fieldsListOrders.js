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

const tableName = 'C_Order'

export default [
  {
    tableName,
    elementColumnName: 'DocumentNo',
    columnName: 'DocumentNo',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 0,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'C_BPartner_ID',
    columnName: 'C_BPartner_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 1,
      isMandatory: false
    }
  },
  {
    tableName,
    columnName: 'GrandTotal',
    elementColumnName: 'GrandTotal',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 2,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'OpenAmt',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 3,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'IsPaid',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 4,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'Processed',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 5,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'IsAisleSeller',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 6,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'IsInvoiced',
    columnName: 'IsInvoiced ',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 7,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'DateOrdered',
    columnName: 'DateOrdered',
    isFromDictionary: true,
    overwriteDefinition: {
      columnName: 'DateOrderedFrom',
      size: 8,
      sequence: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'DateOrdered',
    columnName: 'DateOrderedTo',
    isFromDictionary: true,
    overwriteDefinition: {
      columnName: 'DateOrderedTo',
      size: 8,
      sequence: 9,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'SalesRep_ID',
    columnName: 'SalesRep_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 10,
      isMandatory: false
    }
  }
]
