import {
  workflowActivities
} from '@/api/ADempiere/workflow.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const activity = {
  listActivity: [],
  currentActivity: {}
}

export default {
  state: activity,
  mutations: {
    setActivity(state, activity) {
      state.listActivity = activity
    },
    setCurrentActivity(state, activity) {
      state.currentActivity = activity
    }
  },
  actions: {
    serverListActivity({ commit, getters, rootGetters }) {
      workflowActivities({
        userUuid: rootGetters['user/getUserUuid']
      })
        .then(response => {
          const { listWorkflowActivities } = response
          commit('setActivity', listWorkflowActivities)
        })
        .catch(error => {
          console.warn(`serverListActivity: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    selectedActivity({ commit }, activity) {
      commit('setCurrentActivity', activity)
    }
  },
  getters: {
    getCurrentActivity: (state) => {
      return state.currentActivity
    },
    getActivity: (state) => {
      return state.listActivity
    }
  }
}
