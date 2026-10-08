const Mock = require('mockjs')
const { deepClone } = require('../utils')
const { asyncRoutes, constantRoutes } = require('./routes.js')

const routes = deepClone([...constantRoutes, ...asyncRoutes])

const roles = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'editor',
    name: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

function userRoutes(token) {
  const role = roles.find(item => token === item.key + '-token')
  if (!role) return null
  const publicPaths = constantRoutes.map(route => route.path || '/')
  // Public pages stay in the local router; only protected pages are added here.
  const protectedRoutes = role.routes.filter(route => !publicPaths.includes(route.path || '/') && route.path !== '*')
  // Keep the public not-found page reachable even after a role's menus are edited.
  const notFoundRoute = asyncRoutes.find(route => route.path === '*')
  return deepClone(notFoundRoute ? protectedRoutes.concat(notFoundRoute) : protectedRoutes)
}

function notFound() {
  return { code: 50000, message: 'Role does not exist.' }
}

module.exports = [
  {
    url: '/vue-element-admin/user/routes',
    type: 'get',
    response: config => {
      const data = userRoutes(config.query.token)
      return data ? { code: 20000, data } : { code: 50008, message: 'Invalid user token.' }
    }
  },
  // mock get all routes form server
  {
    url: '/vue-element-admin/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: routes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/vue-element-admin/roles',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: roles
      }
    }
  },

  // add role
  {
    url: '/vue-element-admin/role',
    type: 'post',
    response: config => {
      const key = String(Mock.mock('@guid'))
      const role = { ...deepClone(config.body), key }
      roles.push(role)
      return { code: 20000, data: deepClone(role) }
    }
  },

  // update role
  {
    url: '/vue-element-admin/role/[^/]+$',
    type: 'put',
    response: config => {
      const key = config.url.split('?')[0].split('/').pop()
      const index = roles.findIndex(role => role.key === key)
      if (index === -1) return notFound()
      roles.splice(index, 1, { ...deepClone(config.body), key })
      return { code: 20000, data: { status: 'success' } }
    }
  },

  // delete role
  {
    url: '/vue-element-admin/role/[^/]+$',
    type: 'delete',
    response: config => {
      const key = config.url.split('?')[0].split('/').pop()
      const index = roles.findIndex(role => role.key === key)
      if (index === -1) return notFound()
      roles.splice(index, 1)
      return { code: 20000, data: { status: 'success' } }
    }
  }
]
