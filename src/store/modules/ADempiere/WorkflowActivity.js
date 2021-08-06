import {
  workflowActivities
} from '@/api/ADempiere/workflow.js'
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'

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
    serverListActivity({ commit, state, dispatch, rootGetters }, params) {
      const userUuid = isEmptyValue(params) ? rootGetters['user/getUserUuid'] : params
      const name = language.t('navbar.badge.activity')
      workflowActivities({
        userUuid
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
        .finally(() => {
          const notification = rootGetters.getNotificationProcess.find(notification => {
            if (notification.typeActivity && notification.quantityActivities === state.listActivity.length) {
              return notification
            }
          })
          if (isEmptyValue(notification)) {
            commit('addNotificationProcess', {
              name,
              typeActivity: true,
              quantityActivities: state.listActivity.length
            })
          } else {
            dispatch('updateNotifications', {
              name,
              typeActivity: true,
              quantityActivities: state.listActivity.length
            })
          }
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
