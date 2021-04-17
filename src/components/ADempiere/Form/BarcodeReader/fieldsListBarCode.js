// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      cssClassName: 'price-inquiry',
      inputSize: 'large',
      handleFocusGained: true,
      handleFocusLost: true,
      handleActionKeyPerformed: true
    }
  },
  // bar code reader
  {
    columnName: 'UPC',
    tableName: 'M_Product',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true
    }
  },
  {
    columnName: 'Value',
    tableName: 'M_Product',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true
    }
  }
]
