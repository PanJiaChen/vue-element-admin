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
