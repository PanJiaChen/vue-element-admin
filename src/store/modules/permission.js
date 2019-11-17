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
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      return loadMainMenu().then(menu => {
        commit('SET_ROUTES', menu)
        resolve(menu)
      }).catch(err => console.log(err))
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
