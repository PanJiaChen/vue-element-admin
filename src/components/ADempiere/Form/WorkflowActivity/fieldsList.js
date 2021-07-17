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
import language from '@/lang'

export default [
  // History
  {
    elementColumnName: 'History',
    isFromDictionary: true,
    overwriteDefinition: {
      handleFocusGained: true,
      handleFocusLost: true,
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      name: language.t('form.activity.filtersSearch.history'),
      componentPath: 'FieldText',
      size: 24,
      sequence: 4,
      isActiveLogics: true,
      isMandatory: true,
      isReadOnly: true
    }
  },
  // Messages
  {
    elementColumnName: 'TextMsg',
    isFromDictionary: true,
    overwriteDefinition: {
      handleFocusGained: true,
      handleFocusLost: true,
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      size: 24,
      sequence: 5,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // Forward
  {
    elementColumnName: 'Forward',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 6,
      name: language.t('form.activity.filtersSearch.forward'),
      handleFocusGained: true,
      handleFocusLost: true,
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      componentPath: 'FieldSelect'
    }
  }
]
