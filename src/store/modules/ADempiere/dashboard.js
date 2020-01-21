// Default store for handle dashboard refresh and other functionalities
import { requestLisDashboards, getRecentItems } from '@/api/ADempiere/data'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils'

const dashboard = {
  state: {
    dashboard: [],
    recentItems: []
  },
  mutations: {
    addDashboard(state, payload) {
      state.dashboard.push(payload)
    },
    notifyDashboardRefresh: (state, payload) => {

    },
    setRecentItems(state, payload) {
      state.recentItems = payload
    }
  },
  actions: {
    refreshDashboard({ commit }, parameters) {
      commit('notifyDashboardRefresh', parameters)
    },
    listDashboard({ commit }, roleUuid) {
      return new Promise((resolve, reject) => {
        requestLisDashboards({ roleUuid })
          .then(dashboardResponse => {
            const roleDashboards = {
              roleUuid: roleUuid,
              ...dashboardResponse
            }
            commit('addDashboard', roleDashboards)
            resolve(roleDashboards)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getRecentItemsFromServer({ commit }) {
      return new Promise((resolve, reject) => {
        getRecentItems({ pageToken: undefined, pageSize: undefined })
          .then(recentItemsResponse => {
            const recentItems = recentItemsResponse.recentItemsList.map(item => {
              const actionConverted = convertAction(item.action)
              return {
                ...item,
                originalAction: item.action,
                action: actionConverted.name,
                icon: actionConverted.icon
              }
            })
            commit('setRecentItems', recentItems)
            resolve(recentItems)
          })
          .catch(error => {
            console.warn(`Error gettin recent items: ${error.message}. Code: ${error.code}.`)
            reject(error)
          })
      })
    }
  },
  getters: {
    getDashboard: (state) => (dashboardUuid) => {
      return state.dashboard.find(
        item => item.uuid === dashboardUuid
      )
    },
    getDashboardByRole: (state) => (roleUuid) => {
      return state.dashboard.find(
        item => item.roleUuid === roleUuid
      )
    },
    getRecentItems: (state) => {
      return state.recentItems
    }
  }
}

export default dashboard
