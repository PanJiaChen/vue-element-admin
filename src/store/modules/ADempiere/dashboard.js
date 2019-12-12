// Default store for handle dashboard refresh and other functionalities
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
    }
  },
  getters: {
    getDashboard: (state) => (dashboardUuid) => {
      return state.dashboard.find(
        item => item.uuid === dashboardUuid
      )
    }
  }
}

export default dashboard
