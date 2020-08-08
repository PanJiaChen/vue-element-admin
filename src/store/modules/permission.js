import { constantRoutes } from '@/router'
import { loadMainMenu } from '@/router/modules/ADempiere/menu'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, organizationId) {
    return new Promise(resolve => {
      loadMainMenu(organizationId).then(menuResponse => {
        commit('SET_ROUTES', menuResponse)
        resolve(menuResponse)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
