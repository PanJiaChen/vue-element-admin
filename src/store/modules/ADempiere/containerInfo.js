import { requestListRecordsLogs, requestListWorkflowsLogs, requestListRecordChats, requestListChatEntries } from '@/api/ADempiere/data'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const containerInfo = {
  state: {
    listworkflowLog: [],
    listRecordLogs: [],
    listRecordChats: [],
    listChatEntries: []
  },
  mutations: {
    addListWorkflow(state, payload) {
      state.listworkflowLog = payload
    },
    addListRecordLogs(state, payload) {
      state.listRecordLogs = payload
    },
    addListRecordChats(state, payload) {
      state.listRecordChats = payload
    },
    addListChatEntries(state, payload) {
      state.listChatEntries = payload
    }
  },
  actions: {
    listWorkflowLogs({ commit, state }, params) {
      const tableName = params.tableName
      const recordId = params.recordId
      const page_size = 0
      const page_token = 0
      return requestListWorkflowsLogs({ tableName, recordId, page_size, page_token })
        .then(response => {
          commit('addListWorkflow', response)
        })
        .catch(error => {
          console.warn(`Error getting List workflow: ${error.message}. Code: ${error.code}.`)
        })
    },
    listRecordLogs({ commit, state }, params) {
      const tableName = params.tableName
      const recordId = params.recordId
      const page_size = 0
      const page_token = 0
      return requestListRecordsLogs({ tableName, recordId, page_size, page_token })
        .then(response => {
          var listRecord = {
            recordCount: response.recordCount,
            recorLogs: response.recordLogsList
          }
          commit('addListRecordLogs', listRecord)
        })
        .catch(error => {
          console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
        })
    },
    listChatEntries({ commit, state }, params) {
      const tableName = params.tableName
      const recordId = params.recordId
      const page_size = 0
      const page_token = 0
      return requestListRecordChats({ tableName, recordId, page_size, page_token })
        .then(response => {
          console.log('requestListRecordChats response =>', response)
          commit('addListChatEntries', response)
        })
        .catch(error => {
          console.warn(`Error getting List Chat: ${error.message}. Code: ${error.code}.`)
        })
    },
    listRecordChat({ commit, state }, params) {
      const uuid = params.uuid
      const page_size = 0
      const page_token = 0
      return requestListChatEntries({ uuid, page_size, page_token })
        .then(response => {
          console.log('requestListChatEntries response =>', response)
          commit('addListChatEntries', response)
        })
        .catch(error => {
          console.warn(`Error getting List Chat: ${error.message}. Code: ${error.code}.`)
        })
    }
  },
  getters: {
    getWorkflow: (state) => {
      return state.listworkflowLog.workflowLogsList
    },
    getRecordLogs: (state) => {
      const recordLogs = state.listRecordLogs.recorLogs
      if (isEmptyValue(recordLogs)) {
        var listRecord = [{
          columnName: 'Compañía',
          description: 'Compañía',
          displayColumnName: 'Compañía',
          eventType: 0,
          eventTypeName: 'INSERT',
          logDate: 0,
          logUuid: 'e0c976cc-b49e-40fd-b52b-f2f5020436f6',
          newDisplayValue: '',
          newValue: '',
          oldDisplayValue: '',
          oldValue: '',
          recordId: 100000,
          sessionUuid: '',
          tableName: '',
          transactionName: '',
          userName: '',
          userUuid: ''
        },
        {
          columnName: 'Compañía',
          description: 'Compañía',
          displayColumnName: 'Compañía',
          eventType: 0,
          eventTypeName: 'INSERT',
          logDate: 0,
          logUuid: 'e0c976cc-b49e-40fd-b52b-f2f5020436f6',
          newDisplayValue: '',
          newValue: '',
          oldDisplayValue: '',
          oldValue: '',
          recordId: 100000,
          sessionUuid: '',
          tableName: '',
          transactionName: '',
          userName: '',
          userUuid: ''
        }]
        return listRecord
      } else {
        return state.listRecordLogs
      }
    },
    getChatEntries: (state) => {
      return state.listChatEntries
    }
  }
}

export default containerInfo
