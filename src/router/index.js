import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '安全生产看板', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/insp',
    component: Layout,
    redirect: '/insp/safe_insp',
    name: '安全点巡检',
    meta: {
      title: '安全点巡检',
      icon: 'clipboard'
    },
    children: [
      {
        path: 'safe_insp',
        component: () => import('@/views/safe_insp/index'),
        name: '安全点巡检',
        meta: { title: '安全点巡检', icon: 'list', noCache: true }
      },
      {
        path: 'edit_form/create',
        component: () => import('@/views/safe_insp/components/create/index'),
        name: 'EditForm',
        hidden: true,
        meta: { title: '安全点巡检新增', icon: 'list', noCache: true }
      },
      {
        path: 'edit_form/audit/:id',
        component: () => import('@/views/safe_insp/components/edit_form/index'),
        name: 'EditForm',
        hidden: true,
        meta: { title: '安全点巡检编辑', icon: 'list', noCache: true }
      },
      {
        path: 'insp_name',
        component: () => import('@/views/insp_name/index'),
        name: '点巡检标准项',
        meta: { title: '点巡检标准项', icon: 'edit', noCache: true }
      }
    ]
  },
  {
    path: '/hidden_danger',
    component: Layout,
    redirect: '/hidden_danger/hidden_check',
    name: '隐患排查治理',
    meta: {
      title: '隐患排查治理',
      icon: 'el-icon-s-order'
    },
    children: [
      {
        path: 'hidden_check',
        component: () => import('@/views/hidden_check/index'),
        name: '隐患排查',
        meta: { title: '隐患排查', icon: 'form', noCache: true }
      },
      {
        path: 'hidden_check/create',
        component: () => import('@/views/hidden_check/components/create/index'),
        name: 'create',
        hidden: true,
        meta: { title: '隐患排查新增', icon: 'list', noCache: true }
      },
      {
        path: 'hidden_check/audit/:id',
        component: () => import('@/views/hidden_check/components/edit_form/index'),
        name: 'audit',
        hidden: true,
        meta: { title: '隐患排查编辑', icon: 'list', noCache: true }
      },
      {
        path: 'hidden_reform',
        component: () => import('@/views/hidden_reform/index'),
        name: '隐患整改',
        meta: { title: '隐患整改', icon: 'el-icon-s-management', noCache: true }
      },
      {
        path: 'hidden_reform/create',
        component: () => import('@/views/hidden_reform/components/create/index'),
        name: 'create',
        hidden: true,
        meta: { title: '隐患整改新增', icon: 'list', noCache: true }
      },
      {
        path: 'hidden_reform/audit/:id',
        component: () => import('@/views/hidden_reform/components/edit_form/index'),
        name: 'audit',
        hidden: true,
        meta: { title: '隐患整改编辑', icon: 'list', noCache: true }
      },
      {
        path: 'hidden_review',
        component: () => import('@/views/hidden_review/index'),
        name: '隐患验收',
        meta: { title: '隐患验收', icon: 'el-icon-s-opportunity', noCache: true }
      },
      {
        path: 'hidden_review/create',
        component: () => import('@/views/hidden_review/components/create/index'),
        name: 'create',
        hidden: true,
        meta: { title: '隐患验收新增', icon: 'list', noCache: true }
      },
      {
        path: 'hidden_review/audit/:id',
        component: () => import('@/views/hidden_review/components/edit_form/index'),
        name: 'audit',
        hidden: true,
        meta: { title: '隐患验收编辑', icon: 'list', noCache: true }
      }
    ]
  },
  {
    path: '/sys_dept',
    component: Layout,
    redirect: '/sys_dept/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/sys_dept/index'),
        name: '组织管理',
        meta: { title: '组织管理', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/sys_user',
    component: Layout,
    redirect: '/sys_user/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/sys_user/index'),
        name: '用户管理',
        meta: { title: '用户管理', icon: 'el-icon-user-solid', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
