import router, { constantRoutes, resetRouter } from '@/router'
import { loadMainMenu } from '@/router/modules/ADempiere/menu'
import { getToken } from '@/utils/auth'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import NProgress from 'nprogress' // progress bar

const state = {
  routes: [],
  addRoutes: [],
  timeOutMenu: null
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  setTimeOutMenu(state, payload) {
    state.timeOutMenu = payload
  },
  clearTimeOutMenu(state) {
    clearTimeout(state.timeOutMenu)
  }
}

const actions = {
  generateRoutes({ commit, rootGetters }, organizationId = 0) {
    return new Promise(resolve => {
      const organization = rootGetters['user/getOrganization']
      let organizationUuid
      if (!isEmptyValue(organization)) {
        organizationId = organization.id
        organizationUuid = organization.uuid
      }

      const role = rootGetters['user/getRole']
      let roleUuid
      let clientId = 0
      if (!isEmptyValue(role)) {
        roleUuid = role.uuid
        clientId = role.clientId
      }

      const sessionUuid = getToken()

      loadMainMenu({
        sessionUuid,
        clientId,
        roleUuid,
        organizationId,
        organizationUuid
      }).then(menuResponse => {
        commit('SET_ROUTES', menuResponse)
        resolve(menuResponse)
      })
    })
  },
  sendRequestMenu({ commit, dispatch }, organizationId = null) {
    commit('clearTimeOutMenu')
    const timeOutMenu = setTimeout(async() => {
      NProgress
        .configure({
          // NProgress Configuration
          showSpinner: false
        })
        .start()

      resetRouter()
      dispatch('generateRoutes', organizationId)
        .then(accessRoutes => {
          router.addRoutes(accessRoutes)
        })
        .finally(() => {
          // finish progress bar
          NProgress.done()
        })
    }, 2500)
    commit('setTimeOutMenu', timeOutMenu)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
