/** User Management Router Module **/

import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'User',
  meta: {
    title: 'User Management',
    icon: 'user'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/user/list'),
      name: 'UserList',
      meta: { title: 'User List' }
    },
    {
      path: 'create',
      component: () => import('@/views/user/create'),
      name: 'UserCreate',
      meta: { title: 'Create User' }
    },
    {
      path: 'edit/:id(\d+)',
      component: () => import('@/views/user/edit'),
      name: 'UserEdit',
      meta: { title: 'Edit User', noCache: true },
      hidden: true
    }
  ]
}

export default userRouter
