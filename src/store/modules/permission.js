import { constantRoutes } from '@/router'
import { getRoutes } from '@/api/route'
// const _import = path => import('@/views/' + path)
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */

export function mapAsyncRoutes(routes) {
  return routes.map(route => {
    const tmp = { ...route }
    if (typeof tmp.component === 'string') {
      const path = tmp.component
      tmp.component = () => import(`@/${path}`)
    }
    if (tmp.children && tmp.children.length) {
      tmp.children = mapAsyncRoutes(tmp.children)
    }
    return tmp
  })
}

export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

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
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      getRoutes().then(res => {
        const asyncRoutes = res.data
        if (roles.includes('admin')) {
          accessedRoutes = mapAsyncRoutes(asyncRoutes || [])
        } else {
          accessedRoutes = mapAsyncRoutes(filterAsyncRoutes(asyncRoutes, roles))
          debugger
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
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
