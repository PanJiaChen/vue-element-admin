import { requestWorkflowMetadata } from '@/api/ADempiere/dictionary/workflow'
import { showMessage } from '@/utils/ADempiere/notification'
// import router from '@/router'
import language from '@/lang'

const workflow = {
  state: {
    workflow: []
  },
  mutations: {
    addWorkflow(state, payload) {
      state.workflow.push(payload)
    },
    dictionaryResetCacheWorkflow(state) {
      state.workflow = []
    }
  },
  actions: {
    getWorkflowFromServer({ commit, dispatch }, {
      id,
      containerUuid,
      routeToDelete
    }) {
      return new Promise(resolve => {
        requestWorkflowMetadata({
          uuid: containerUuid,
          id
        })
          .then(workflowResponse => {
            const panelType = 'workflow'

            // Panel for save on store
            const newWorkflow = {
              ...workflowResponse,
              containerUuid,
              fieldsList: [],
              panelType
            }

            commit('addWorkflow', newWorkflow)

            resolve(newWorkflow)

            const actions = []

            // Add process menu
            dispatch('setContextMenu', {
              containerUuid,
              actions
            })
          })
          .catch(error => {
            // router.push({
            //   path: '/dashboard'
            // }, () => {})
            // dispatch('tagsView/delView', routeToDelete)
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
            console.warn(`Dictionary Workflow - Error ${error.code}: ${error.message}.`)
          })
      })
    }
  },
  getters: {
    getWorkflowUuid: (state) => (workflowUuid) => {
      return state.workflow.find(
        item => item.uuid === workflowUuid
      )
    }
  }
}

export default workflow
