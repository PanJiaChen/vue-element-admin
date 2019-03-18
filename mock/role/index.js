import Mock from 'mockjs'
import { deepClone } from '../../src/utils/index.js'
import { asyncRoutes, constantRoutes } from './routes.js'

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

export default {
  '/routes': () => {
    return routes
  },
  '/roles': () => {
    return roles
  },
  '/roles/add': () => {
    return Mock.mock('@integer(300, 5000)')
  },
  '/roles/update/\/[A-Za-z0-9]': () => {
    const res = {
      data: 'success'
    }
    return res
  },
  '/roles/delete/\/[A-Za-z0-9]'() {
    const res = {
      data: 'success'
    }
    return res
  }
}
