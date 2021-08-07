// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
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

// List of fields to send in search
// import language from '@/lang'

export default [
  {
    columnName: 'C_BPartner_ID',
    tableName: 'M_InOut',
    isFromDictionary: true,
    overwriteDefinition: {
      handleFocusGained: true,
      handleFocusLost: true,
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      size: 24,
      sequence: 3,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // M_Product_ID
  {
    columnName: 'M_Product_ID',
    // elementColumnName: 'M_Product_ID',
    tableName: 'M_MatchInv',
    isFromDictionary: true,
    overwriteDefinition: {
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      size: 24,
      sequence: 4
    }
  },
  // Date From
  {
    elementColumnName: 'Date_From',
    isFromDictionary: true,
    overwriteDefinition: {
      handleFocusGained: true,
      handleFocusLost: true,
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      size: 24,
      name: 'Fecha Desde',
      componentPath: 'FieldDate',
      sequence: 6,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // Date To
  {
    elementColumnName: 'Date_To',
    isFromDictionary: true,
    overwriteDefinition: {
      handleFocusGained: true,
      handleFocusLost: true,
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      size: 24,
      name: 'Fecha Hasta',
      sequence: 7,
      componentPath: 'FieldDate',
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // Assign From
  {
    elementColumnName: 'Assign_From',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 0,
      name: 'Asignar Desde',
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true,
      componentPath: 'FieldSelect'
    }
  },
  // Assign To
  {
    elementColumnName: 'Assign_To',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 1,
      name: 'Asignar Hasta',
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true,
      componentPath: 'FieldSelect'
    }
  },
  // Search Mode
  {
    elementColumnName: 'Search_Mode',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 2,
      name: 'Modo de Búsqueda',
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      isActiveLogics: true,
      componentPath: 'FieldSelect',
      isMandatory: true
    }
  }
]
