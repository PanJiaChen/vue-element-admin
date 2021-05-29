// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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

import language from '@/lang'

export const infoOptionItem = {
  name: language.t('field.info'),
  enabled: true,
  svg: false,
  icon: 'el-icon-info',
  componentRender: () => import('@/components/ADempiere/Field/FieldOptions/contextInfo')
}

/**
 * For operators in advanced query
 */
export const operatorOptionItem = {
  name: language.t('operators.operator'),
  enabled: true,
  svg: false,
  icon: 'el-icon-rank',
  componentRender: () => import('@/components/ADempiere/Field/FieldOptions/operatorComparison')
}

/**
 * For lookup fields with context info
 */
export const zoomInOptionItem = {
  name: language.t('table.ProcessActivity.zoomIn'),
  enabled: true,
  svg: false,
  icon: 'el-icon-files',
  componentRender: () => import('@/components/ADempiere/Field/FieldOptions/contextInfo')
}

/**
 * Only when is translate option
 */
export const translateOptionItem = {
  name: language.t('language'),
  enabled: true,
  svg: true,
  icon: 'language',
  componentRender: () => import('@/components/ADempiere/Field/FieldOptions/translated')
}

/**
 * Displayed calculator option in numeric field
 */
export const calculatorOptionItem = {
  name: language.t('field.calculator'),
  enabled: true,
  svg: false,
  icon: 'el-icon-s-operation',
  componentRender: () => import('@/components/ADempiere/Field/FieldOptions/calculator')
}

export const preferenceOptionItem = {
  name: language.t('field.preference'),
  enabled: true,
  svg: false,
  icon: 'el-icon-notebook-2',
  componentRender: () => import('@/components/ADempiere/Field/FieldOptions/preference')
}

export const logsOptionItem = {
  name: language.t('field.logsField'),
  enabled: true,
  svg: true,
  icon: 'tree-table',
  componentRender: () => import('@/components/ADempiere/Field/FieldOptions/changeLogs')
}

/**
 * For document status field to workflow
 */
export const documentStatusOptionItem = {
  name: language.t('window.documentStatus'),
  enabled: true,
  svg: false,
  icon: 'el-icon-set-up',
  componentRender: () => import('@/components/ADempiere/Field/FieldOptions/documentStatus')
}

export const optionsListStandad = [
  infoOptionItem,
  preferenceOptionItem,
  logsOptionItem
]

export const optionsListAdvancedQuery = [
  infoOptionItem,
  operatorOptionItem
]
