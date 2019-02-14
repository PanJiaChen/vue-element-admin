import { constantRoutes, generalRoutes } from '@/router'
import { fetchAsyncRoutes } from '@/api/routes'

const _import = path => () => import(`@/views/${path}`)
/**
 * 通过meta.role判断是否与当前用户权限匹配
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

// 将从服务器获得的路由表转换为vue-router的路由表
function mapAsyncRoutes(asyncRoutes) {
  return asyncRoutes.map(route => {
    route.component && (route.component = _import(route.component))
    if (route.children) {
      route.children = mapAsyncRoutes(route.children)
    }
    return route
  })
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
function filterAsyncRoutes(routes, roles) {
  return routes.filter(route => {
    if (!hasPermission(roles, route)) {
      return false
    }
    if (route.children) {
      route.children = filterAsyncRoutes(route.children, roles)
    }
    return true
  })
}

const permission = {
  state: {
    routers: [],
    addRouters: [],
    asyncRoutes: []
  },
  mutations: {
    SET_ROUTERS: (state, routes) => {
      state.addRouters = routes
      state.routers = constantRoutes.concat(routes)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRoutes
        fetchAsyncRoutes().then(res => {
          const asyncRoutes = res.data
          if (roles.includes('admin')) {
            accessedRoutes = mapAsyncRoutes(asyncRoutes).concat(generalRoutes)
          } else {
            accessedRoutes = mapAsyncRoutes(filterAsyncRoutes(asyncRoutes, roles)).concat(generalRoutes)
          }
          commit('SET_ROUTERS', accessedRoutes)
          resolve(accessedRoutes)
        })
      })
    }
  }
}

export default permission
