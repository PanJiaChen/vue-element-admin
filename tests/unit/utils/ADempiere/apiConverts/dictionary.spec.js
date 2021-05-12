// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Sofia Calderon sofia.ester.calderon@gmail.com www.westfalia-it.com
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
  convertBrowser,
  convertForm,
  convertProcess,
  convertReportExportType,
  convertTab,
  convertValidationRule,
  convertWindow
} from '../../../../../src/utils/ADempiere/apiConverts/dictionary'
import process from './objects/fromApi/process.json'
import convertedProcess from './objects/converted/process.json'
import processWithUndefined from './objects/fromApi/processWithUndefined.json'
import convertedProcessWithUndefined from './objects/converted/processWithUndefined.json'
import reportExportType from './objects/fromApi/reportExportType.json'
import convertedReportExportType from './objects/converted/reportExportType.json'
import tab from './objects/fromApi/tab.json'
import convertedTab from './objects/converted/tab.json'
import windowObj from './objects/fromApi/window.json'
import convertedWindow from './objects/converted/window.json'
import browser from './objects/fromApi/browser.json'
import convertedBrowser from './objects/converted/browser.json'
import form from './objects/fromApi/form.json'
import convertedForm from './objects/converted/form.json'
import validationRule from './objects/fromApi/validationRule.json'
import convertedValidationRule from './objects/converted/validationRule.json'

describe('process', () => {
  it('should convert a process with all fields defined', () => {
    const actualConvertedProcess = convertProcess(process)
    expect(actualConvertedProcess).toEqual(convertedProcess)
  })

  it('should convert a process with some fields undefined', () => {
    const actualConvertedProcess = convertProcess(processWithUndefined)
    expect(actualConvertedProcess).toEqual(convertedProcessWithUndefined)
  })
})

describe('report export type', () => {
  it('should return a converted report export type object', () => {
    const actualExportType = convertReportExportType(reportExportType)
    expect(actualExportType).toEqual(convertedReportExportType)
  })
})

describe('tab', () => {
  it('should return a converted tab object', () => {
    const actualTab = convertTab(tab)
    expect(actualTab).toEqual(convertedTab)
  })
})

describe('window', () => {
  it('should return a converted window object', () => {
    const actualWindow = convertWindow(windowObj)
    expect(actualWindow).toEqual(convertedWindow)
  })
})

describe('browser', () => {
  it('should return a converted browser object', () => {
    const actualBrowser = convertBrowser(browser)
    expect(actualBrowser).toEqual(convertedBrowser)
  })
})

describe('form', () => {
  it('should return a converted form object', () => {
    const actualForm = convertForm(form)
    expect(actualForm).toEqual(convertedForm)
  })
})

describe('validation rule', () => {
  it('should return a converted validation rule object', () => {
    const actualValidationRule = convertValidationRule(validationRule)
    expect(actualValidationRule).toEqual(convertedValidationRule)
  })
})
