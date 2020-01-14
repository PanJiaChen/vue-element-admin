import { getProcess as getProcessMetadata } from '@/api/ADempiere'
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
     *
     * @param {string} containerUuid
     * @param {object} routeToDelete, route to close in tagView when fail
     */
    getProcessFromServer({ commit, dispatch }, {
      containerUuid,
      routeToDelete
    }) {
      var printFormatsAvailable
      dispatch('requestPrintFormats', { processUuid: containerUuid })
        .then(response => {
          printFormatsAvailable = response
        })
      return new Promise((resolve, reject) => {
        getProcessMetadata(containerUuid)
          .then(responseProcess => {
            responseProcess.printFormatsAvailable = printFormatsAvailable
            const { processDefinition, actions } = generateProcess({
              processToGenerate: responseProcess
            })
            dispatch('addPanel', processDefinition)
            commit('addProcess', processDefinition)

            //  Add process menu
            dispatch('setContextMenu', {
              containerUuid: processDefinition.uuid,
              relations: [],
              actions: actions,
              references: []
            })
            resolve(processDefinition)
          })
          .catch(error => {
            router.push({ path: '/dashboard' })
            dispatch('tagsView/delView', routeToDelete)
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
            console.warn(`Dictionary Process (State) - Error ${error.message}`)
            reject(error)
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
          processToGenerate: processToGenerate
        })

        dispatch('addPanel', processDefinition)
        commit('addProcess', processDefinition)

        //  Add process menu
        dispatch('setContextMenu', {
          containerUuid: processDefinition.uuid,
          relations: [],
          actions: actions,
          references: []
        })

        resolve(processDefinition)
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
