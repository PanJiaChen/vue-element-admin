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

import {
  convertField,
  convertFieldGroup
} from '@/utils/ADempiere/apiConverts/field.js'
import { convertContextInfo } from '@/utils/ADempiere/apiConverts/core.js'
import { camelizeObjectKeys } from '../transformObject'

export function convertProcess(process) {
  const convertedProcess = camelizeObjectKeys(process)
  convertedProcess.parameters = process.parameters.map(parameter => convertField(parameter))
  return convertedProcess
}

// Convert report export type
export function convertReportExportType(reportExportType) {
  return camelizeObjectKeys(reportExportType)
}

export function convertBrowser(browser) {
  const convertedBrowser = camelizeObjectKeys(browser)
  convertedBrowser.window = convertWindow(browser.window)
  convertedBrowser.process = convertProcess(browser.process)
  convertedBrowser.fields = browser.fields.map(fieldItem => convertField(fieldItem))
  return convertedBrowser
}

export function convertForm(form) {
  return camelizeObjectKeys(form)
}

export function convertWindow(windowToConvert) {
  const convertedWindow = camelizeObjectKeys(windowToConvert)
  convertedWindow.contextInfo = convertContextInfo(windowToConvert.context_info)
  convertedWindow.tabs = windowToConvert.tabs.map(tab => convertTab(tab))
  return convertedWindow
}

// convert Tabs
export function convertTab(tab) {
  const convertedTab = camelizeObjectKeys(tab)
  convertedTab.contextInfo = convertContextInfo(tab.context_info)
  convertedTab.fieldGroup = convertFieldGroup(tab.field_group)
  convertedTab.processes = tab.processes.map(process => convertProcess(process))
  convertedTab.fields = tab.fields.map(field => convertField(field))
  return convertedTab
}

//  Convert Validation Rule
export function convertValidationRule(validationRule) {
  return camelizeObjectKeys(validationRule)
}
