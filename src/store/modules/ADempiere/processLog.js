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

import {
  requestListProcessesLogs
} from '@/api/ADempiere/process.js'
import { showNotification } from '@/utils/ADempiere/notification.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import language from '@/lang'

/**
 * Process Vuex Module
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 */
const processLog = {
  state: {
    sessionProcess: [],
    inRequestMetadata: []
  },

  mutations: {
    setSessionProcess(state, payload) {
      state.sessionProcess = payload.processList
    },

    // Add process in request metadata from server
    addInRequestMetadata(state, payload) {
      state.inRequestMetadata.push(payload)
    },

    // Delete process in request metadata
    deleteInRequestMetadata(state, payload) {
      state.inRequestMetadata = state.inRequestMetadata.filter(item => item !== payload)
    }
  },

  actions: {
    /**
     * List log of process/reports executed
     * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
     * @param {string} pageToken
     * @param {number} pageSize default 50
     */
    getSessionProcessFromServer({ commit, dispatch, getters, rootGetters }, {
      pageToken,
      pageSize
    }) {
      // process Activity
      return requestListProcessesLogs({ userUuid: getters['user/getUserUuid'], pageToken, pageSize })
        .then(processActivityResponse => {
          const responseList = processActivityResponse.processLogsList.map(processLogItem => {
            const { uuid: containerUuid } = processLogItem
            const processMetadata = rootGetters.getProcess(containerUuid)

            // if no exists metadata into store
            if (isEmptyValue(processMetadata)) {
              const processRequest = getters.getInRequestMetadata(containerUuid)
              // if no request dictionary metadata in progess
              if (isEmptyValue(processRequest)) {
                commit('addInRequestMetadata', containerUuid)

                dispatch('getProcessFromServer', {
                  containerUuid
                })
                  .finally(() => {
                    commit('deleteInRequestMetadata', containerUuid)
                  })
              }
            }

            const process = {
              ...processLogItem,
              processUuid: containerUuid
            }
            return process
          })

          const processResponseList = {
            recordCount: processActivityResponse.recordCount,
            processList: responseList,
            nextPageToken: processActivityResponse.nextPageToken
          }
          commit('setSessionProcess', processResponseList)

          return processResponseList
        })
        .catch(error => {
          showNotification({
            title: language.t('notifications.error'),
            message: error.message,
            type: 'error'
          })
          console.warn(`Error getting process activity: ${error.message}. Code: ${error.code}.`)
        })
    }
  },

  getters: {
    /**
     * Process request metadata from server filter form uuid process
     */
    getInRequestMetadata: (state) => (containerUuid) => {
      return state.inRequestMetadata.find(item => item === containerUuid)
    },

    /**
     * Process receibed from server associated whith this session
     */
    getAllSessionProcess: (state) => {
      return state.sessionProcess
    }
  }
}

export default processLog
