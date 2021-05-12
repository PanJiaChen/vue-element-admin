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

import { convertContextInfo } from '@/utils/ADempiere/apiConverts/core.js'
import { camelizeObjectKeys, renameObjectKey } from '../transformObject'

export function convertField(field) {
  const convertedField = camelizeObjectKeys(field)
  convertedField.fieldGroup = convertFieldGroup(field.Fieldgroup)
  delete convertedField['Fieldgroup']
  convertedField.reference = convertReference(field.reference)
  convertedField.contextInfo = convertContextInfo(field.context_info)
  convertedField.fieldDefinition = convertFieldDefinition(field.Fielddefinition)
  delete convertedField['Fielddefinition']
  convertedField.valueMin = field.value_max
  renameObjectKey(convertedField, 'columnSql', 'columnSQL')
  return convertedField
}

export function convertFieldGroup(fieldGroup) {
  if (!fieldGroup) {
    return {}
  }
  const convertedFieldGroup = camelizeObjectKeys(fieldGroup)
  convertedFieldGroup.groupName = convertedFieldGroup.name
  convertedFieldGroup.groupType = convertedFieldGroup.fieldGroupType
  return convertedFieldGroup
}

export function convertReference(reference) {
  if (!reference) {
    return {
      zoomWindows: []
    }
  }
  const convertedReference = camelizeObjectKeys(reference)
  convertedReference.zoomWindows = reference.zoom_windows.map(zoomWindowItem => convertZoomWindow(zoomWindowItem))
  return convertedReference
}

export function convertZoomWindow(zoomWindowToConvert) {
  if (!zoomWindowToConvert) {
    return {}
  }
  const convertedwindow = camelizeObjectKeys(zoomWindowToConvert)
  return convertedwindow
}

export function convertFieldDefinition(fieldDefinition) {
  if (!fieldDefinition) {
    return { conditions: [] }
  }
  const convertedDefinition = camelizeObjectKeys(fieldDefinition)
  renameObjectKey(convertedDefinition, 'Value', 'value')
  convertedDefinition.conditions = fieldDefinition.conditions
    .map(itemCondition => connvertFieldCondition(itemCondition))
  return convertedDefinition
}

function connvertFieldCondition(fieldConditionToConvert) {
  if (!fieldConditionToConvert) {
    return {}
  }
  return camelizeObjectKeys(fieldConditionToConvert)
}
