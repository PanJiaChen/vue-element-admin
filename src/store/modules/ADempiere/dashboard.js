// Default store for handle dashboard refresh and other functionalities
import { requestLisDashboards, getRecentItems } from '@/api/ADempiere/data'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getCurrentRole } from '@/utils/auth'

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
    listDashboard({ commit, rootGetters }, roleUuid) {
      if (isEmptyValue(roleUuid)) {
        roleUuid = rootGetters.getRoleUuid
      } else if (isEmptyValue(roleUuid)) {
        roleUuid = getCurrentRole()
      }
      return new Promise(resolve => {
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
            console.warn(`Error getting List Dashboards: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    getRecentItemsFromServer({ commit }) {
      return new Promise(resolve => {
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
            console.warn(`Error getting recent items: ${error.message}. Code: ${error.code}.`)
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
