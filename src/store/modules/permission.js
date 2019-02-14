import { asyncRouterMap, constantRouterMap, routerMode } from '@/router'

import { validatenull } from '@/utils/validate'
// for get menus from server
import { getMenuByRole } from '@/api/menu'
import Layout from '@/views/layout/Layout'

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

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    ADD_MENU_ROUTERS: (state, routers) => {
      state.addRouters = state.addRouters.concat(routers)
      state.routers = state.routers.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      if (routerMode === 'local') {
        return new Promise(resolve => {
          const { roles } = data
          let accessedRouters
          if (roles.includes('admin')) {
            accessedRouters = asyncRouterMap
          } else {
            accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
          }
          commit('SET_ROUTERS', accessedRouters)
          // return for add to router
          resolve(accessedRouters)
        })
      } else {
        const { roles } = data

        return new Promise((resolve, reject) => {
          getMenuByRole(roles[0]).then(response => {
            if (!response.data) {
              reject('GenerateRoutesFromServer failed, please try later again.')
            }
            const menus = response.data

            if (menus.length === 0) {
              reject('menus data is null')
            }

            const accessedRouters = buildRouter(menus)
            const menuRouters = buildMenuRouter(menus)
            // final add 404
            accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
            // commit to stores
            commit('SET_ROUTERS', accessedRouters)
            commit('ADD_MENU_ROUTERS', menuRouters)

            // return for add to router
            resolve(accessedRouters)
          })
        })
      }
    }
  }
}

/** ************************************
 * build Router by menu api
 * add 20190213
***************************************/

function buildMenuRouter(aMenu) {
  const aRouter = []

  aMenu.forEach(item => {
    if (!validatenull(item.component)) {
      const oRouter = {
        meta: { 'title': '', 'icon': '' },
        children: []
      }

      if (item.component === 'Iframe') {
        oRouter.path = item.path
        oRouter.name = item.name
        oRouter.id = item.id || null
        oRouter.redirect = item.redirect || null
        oRouter.meta.icon = item.icon
        oRouter.meta.title = item.title
        oRouter.meta.noCache = item.noCache || false
        oRouter.meta.breadcrumb = item.breadcrumb || true
        oRouter.children = validatenull(item.children) ? [] : buildMenuRouter(item.children)

        aRouter.push(oRouter)
      }
    }
  })

  return aRouter
}

function buildRouter(aMenu) {
  const aRouter = []

  aMenu.forEach(item => {
    if (!validatenull(item.component)) {
      const oRouter = {
        meta: { 'title': '', 'icon': '' },
        children: []
      }

      if (item.component !== 'Iframe') {
        if (item.component === 'Layout') {
          oRouter.component = Layout
        } else {
          oRouter.component = require('@/views/' + item.component + '.vue').default
        }

        oRouter.path = item.path
        oRouter.name = item.name
        oRouter.id = item.id || null
        oRouter.redirect = item.redirect || null
        oRouter.meta.icon = item.icon
        oRouter.meta.title = item.title
        oRouter.meta.noCache = item.noCache || false
        oRouter.meta.breadcrumb = item.breadcrumb || true
        oRouter.children = validatenull(item.children) ? [] : buildRouter(item.children)

        aRouter.push(oRouter)
      }
    }
  })

  return aRouter
}

/** ************************************
 * build Router by menu api end
***************************************/

export default permission
