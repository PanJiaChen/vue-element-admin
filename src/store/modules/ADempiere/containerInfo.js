import {
  requestListEntityLogs,
  requestListWorkflowsLogs,
  requestListWorkflows
} from '@/api/ADempiere/window'
import { isEmptyValue } from '@/utils/ADempiere'

const initStateContainerInfo = {
  listworkflowLog: [],
  listRecordLogs: [],
  listWorkflows: []
}

const containerInfo = {
  state: initStateContainerInfo,
  mutations: {
    addListWorkflow(state, payload) {
      state.listworkflowLog = payload
    },
    addListWorkflows(state, payload) {
      state.listWorkflows = payload
    },
    addListRecordLogs(state, payload) {
      state.listRecordLogs = payload
    },
    resetStateContainerInfo(state) {
      state = initStateContainerInfo
    }
  },
  actions: {
    listRecordLogs({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      const pageSize = 0
      const pageToken = 0
      if (isEmptyValue(tableName) && (isEmptyValue(recordId) || isEmptyValue(recordUuid))) {
        return
      }
      return requestListEntityLogs({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(response => {
          const listRecord = {
            recordCount: response.recordCount,
            entityLogs: response.entityLogsList
          }
          commit('addListRecordLogs', listRecord)
          return listRecord
        })
        .catch(error => {
          console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
        })
    },
    listWorkflowLogs({ commit, dispatch }, {
      tableName,
      recordId,
      recordUuid
    }) {
      const pageSize = 0
      const pageToken = 0
      dispatch('listWorkflows', tableName)
      return requestListWorkflowsLogs({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(response => {
          const workflowLog = {
            recordCount: response.recordCount,
            workflowLogsList: response.workflowLogsList,
            nextPageToken: response.nextPageToken
          }
          commit('addListWorkflow', workflowLog)
          return workflowLog
        })
        .catch(error => {
          console.warn(`Error getting List workflow: ${error.message}. Code: ${error.code}.`)
        })
    },
    listWorkflows({ commit }, tableName) {
      const pageSize = 0
      const pageToken = 0
      return requestListWorkflows({
        tableName,
        pageSize,
        pageToken
      })
        .then(responseWorkFlowList => {
          commit('addListWorkflows', responseWorkFlowList.workflowsList)
          return responseWorkFlowList
        })
        .catch(error => {
          console.warn(`Error getting List workflow: ${error.message}. Code: ${error.code}.`)
        })
    }
  },
  getters: {
    getWorkflow: (state) => {
      return state.listworkflowLog.workflowLogsList
    },
    getNodeWorkflow: (state) => {
      return state.listWorkflows
    },
    getRecordLogs: (state) => {
      return state.listRecordLogs
    }
  }
}

export default containerInfo
