import { requestProcessMetadata } from '@/api/ADempiere/dictionary/process.js'
import { showMessage } from '@/utils/ADempiere'
import { generateProcess } from '@/utils/ADempiere/dictionaryUtils'
import language from '@/lang'
import router from '@/router'

const process = {
  state: {
    process: []
  },
  mutations: {
    addProcess(state, payload) {
      state.process.push(payload)
    },
    dictionaryResetCacheProcess(state) {
      state.process = []
    }
  },
  actions: {
    /**
     * Get Process/Report metadata from server
     * @param {string} containerUuid
     * @param {number} processId
     * @param {object} routeToDelete, route to close in tagView when fail
     */
    getProcessFromServer({ commit, dispatch }, {
      containerUuid,
      processId,
      routeToDelete
    }) {
      return new Promise(resolve => {
        requestProcessMetadata({
          uuid: containerUuid,
          id: processId
        })
          .then(async responseProcess => {
            let printFormatsAvailable = []
            if (responseProcess.isReport) {
              printFormatsAvailable = await dispatch('getListPrintFormats', {
                processUuid: containerUuid,
                processId: responseProcess.id
              })
            }

            const { processDefinition, actions } = generateProcess({
              processToGenerate: {
                ...responseProcess,
                printFormatsAvailable
              }
            })

            dispatch('addPanel', processDefinition)
            commit('addProcess', processDefinition)
            resolve(processDefinition)

            //  Add process menu
            dispatch('setContextMenu', {
              containerUuid,
              actions
            })
          })
          .catch(error => {
            router.push({
              path: '/dashboard'
            }, () => {})
            dispatch('tagsView/delView', routeToDelete)
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
            console.warn(`Dictionary Process - Error ${error.message}.`)
          })
      })
    },
    /**
     * Add process associated in window or smart browser
     * @param {object} processToGenerate
     */
    addProcessAssociated({ commit, dispatch }, {
      processToGenerate
    }) {
      return new Promise(resolve => {
        const { processDefinition, actions } = generateProcess({
          processToGenerate
        })

        dispatch('addPanel', processDefinition)
        commit('addProcess', processDefinition)
        resolve(processDefinition)

        //  Add process menu
        dispatch('setContextMenu', {
          containerUuid: processDefinition.uuid,
          actions
        })
      })
    }
  },
  getters: {
    getProcess: (state) => (processUuid) => {
      return state.process.find(
        item => item.uuid === processUuid
      )
    },
    getProcessById: (state) => (processId) => {
      return state.process.find(
        item => item.id === parseInt(processId)
      )
    }
  }
}

export default process
