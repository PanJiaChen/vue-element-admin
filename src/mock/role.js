import Mock from 'mockjs'
import { deepClone } from '@/utils'
import { filterAsyncRoutes } from '@/store/modules/permission'
import { asyncRoutes, constantRoutes } from '@/router'

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
    routes: filterAsyncRoutes(routes, ['editor'])
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
  getRoutes() {
    return routes
  },
  getRoles() {
    return roles
  },
  addRole() {
    return Mock.mock('@integer(300, 5000)')
  },
  updateRole() {
    const res = {
      data: 'success'
    }
    return res
  },
  deleteRole() {
    const res = {
      data: 'success'
    }
    return res
  }
}
