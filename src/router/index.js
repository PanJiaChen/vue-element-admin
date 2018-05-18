import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/login/register'), hidden: true },
  { path: '/resetpwd', component: () => import('@/views/login/resetpwd'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    name: '首页',
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },

  {
    name: '工厂设置',
    path: '/user/centerUserResourceBundle',
    component: Layout,
    redirect: '/user/centerUserResourceBundle/list',
    meta: { title: '工厂设置', icon: 'setting' },
    children: [{
      name: '我的资源包',
      path: 'list',
      component: () => import('@/views/centerUserResourceBundle/list'),
      meta: { title: '我的资源包', icon: 'ziyuan' }
    },
    {
      name: '我的资源包2',
      path: 'dashboard3',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '我的资源包2', icon: 'setting' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

