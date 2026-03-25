import Layout from '@/layout'
import ParentView from '@/layout/components/ParentView'
import { constantRoutes } from '@/router'
import { buildBackendRouteTree } from '@/utils/backend-menu'

const viewLoaders = {
  'views/dashboard/index': () => import('@/views/dashboard/index')
}

function resolveView(componentKey) {
  if (componentKey === 'Layout') {
    return Layout
  }
  if (componentKey === 'ParentView') {
    return ParentView
  }
  return viewLoaders[componentKey] || (() => import('@/views/backend-page/index'))
}

function hydrateRoutes(routes) {
  return routes.map(route => {
    const record = {
      ...route,
      component: resolveView(route.componentKey)
    }

    if (record.meta) {
      record.meta = {
        ...record.meta,
        componentKey: route.componentKey
      }
    }

    delete record.componentKey

    if (record.children && record.children.length) {
      record.children = hydrateRoutes(record.children)
    }

    return record
  })
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
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = hydrateRoutes(buildBackendRouteTree(menus)).concat([
        { path: '*', redirect: '/404', hidden: true }
      ])
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
