/** Class Management Router Module **/

import Layout from '@/layout'

const classRouter = {
  path: '/class',
  component: Layout,
  redirect: '/class/list',
  name: 'Class',
  meta: {
    title: 'Class Management',
    icon: 'el-icon-document'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/class/list'),
      name: 'ClassList',
      meta: { title: 'Class List' }
    },
    {
      path: 'create',
      component: () => import('@/views/class/create'),
      name: 'ClassCreate',
      meta: { title: 'Create Class' }
    },
    {
      path: 'edit/:id(\d+)',
      component: () => import('@/views/class/edit'),
      name: 'ClassEdit',
      meta: { title: 'Edit Class', noCache: true },
      hidden: true
    }
  ]
}

export default classRouter
