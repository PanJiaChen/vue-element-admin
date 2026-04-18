/** 用户管理路由模块 **/

import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'User',
  meta: {
    title: '用户管理',
    icon: 'people'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/user/index'),
      name: 'UserList',
      meta: { title: '用户列表', icon: 'peoples' }
    }
  ]
}

export default userRouter
