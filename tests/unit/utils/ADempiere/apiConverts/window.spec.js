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
  convertEntityLog,
  convertEntityChat,
  convertChatEntry,
  convertWorkflowProcess,
  convertWorkflowDefinition
} from '@/utils/ADempiere/apiConverts/window'
import entityLog from './objects/fromApi/entityLog.json'
import convertedEntityLog from './objects/converted/entityLog.json'
import entityChat from './objects/fromApi/entityChat.json'
import convertedEntityChat from './objects/converted/entityChat.json'
import chatEntry from './objects/fromApi/chatEntry.json'
import convertedChatEntry from './objects/converted/chatEntry.json'
import workflowProcess from './objects/fromApi/workflowProcess.json'
import convertedWorkflowProcess from './objects/converted/workflowProcess.json'
import workflowDefinition from './objects/fromApi/workflowDefinition.json'
import convertedWorkflowDefinition from './objects/converted/workflowDefinition.json'

describe('entityLog', () => {
  it('should return a converted entityLog object', () => {
    const actualEntityLog = convertEntityLog(entityLog)
    expect(actualEntityLog).toEqual(convertedEntityLog)
  })
})

describe('entityChat', () => {
  it('should return a converted entityChat object', () => {
    const actualEntityChat = convertEntityChat(entityChat)
    expect(actualEntityChat).toEqual(convertedEntityChat)
  })
})

describe('chatEntry', () => {
  it('should return a converted chatEntry object', () => {
    const actualChatEntry = convertChatEntry(chatEntry)
    expect(actualChatEntry).toEqual(convertedChatEntry)
  })
})

describe('workflowProcess', () => {
  it('should return a converted workflowProcess object', () => {
    const actualWorkflowProcess = convertWorkflowProcess(workflowProcess)
    expect(actualWorkflowProcess).toEqual(convertedWorkflowProcess)
  })
})

describe('workflowDefinition', () => {
  it('should return a converted workflowDefinition object', () => {
    const actualWorkflowDefinition = convertWorkflowDefinition(workflowDefinition)
    expect(actualWorkflowDefinition).toEqual(convertedWorkflowDefinition)
  })
})
