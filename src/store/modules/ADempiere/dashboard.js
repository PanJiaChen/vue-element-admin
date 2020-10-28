// Default store for handle dashboard refresh and other functionalities
import { requestLisDashboards } from '@/api/ADempiere/dashboard/dashboard'
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
    listDashboard({ commit, rootGetters }, {
      roleId,
      roleUuid
    }) {
      if (isEmptyValue(roleUuid)) {
        roleUuid = rootGetters.getRoleUuid
        if (isEmptyValue(roleUuid)) {
          roleUuid = getCurrentRole()
        }
      }

      return new Promise(resolve => {
        requestLisDashboards({
          roleId,
          roleUuid
        })
          .then(dashboardResponse => {
            // TODO: verify it with uuid
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
    }
  }
}

export default dashboard
