// Default store for handle dashboard refresh and other functionalities
import { requestLisDashboards } from '@/api/ADempiere/data'
const dashboard = {
  state: {
    dashboard: []
  },
  mutations: {
    addDashboard(state, payload) {
      state.dashboard.push(payload)
    },
    notifyDashboardRefresh: (state, payload) => {

    }
  },
  actions: {
    refreshDashboard({ commit, getters }, parameters) {
      commit('notifyDashboardRefresh', parameters)
    },
    listDashboard({ commit }, roleUuid) {
      return new Promise((resolve, reject) => {
        requestLisDashboards(roleUuid)
          .then(response => {
            const dashboards = response.getDashboardsList().map(item => {
              return {
                windowUuid: item.getWindowuuid(),
                browserUuid: item.getBrowseruuid(),
                dashboardName: item.getDashboardname(),
                dashboardDescription: item.getDashboarddescription(),
                dashboardHtml: item.getDashboardhtml(),
                columnNo: item.getColumnno(),
                lineNo: item.getLineno(),
                isCollapsible: item.getIscollapsible(),
                isOpenByDefault: item.getIsopenbydefault(),
                isEventRequired: item.getIseventrequired(),
                fileName: item.getFilename()
              }
            })
            const roleDashboards = {
              roleUuid: roleUuid,
              recordCount: response.getRecordcount(),
              dashboardList: dashboards,
              nextPageToken: response.getNextPageToken()
            }
            commit('addDashboard', roleDashboards)
            resolve(roleDashboards)
          })
          .catch(error => {
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
    }
  }
}

export default dashboard
