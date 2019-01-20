import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
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
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/notice/:id(\\d+)',
    component: () => import('@/views/notice/show'),
    hidden: true,
    meta: { title: 'notice', icon: 'notice', noCache: true }
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'documentation', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/list',
    name: 'Notice',
    meta: {
      title: 'notice',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/components-demo/uEditor'),
        name: 'CreateNotice',
        meta: { title: 'createNotice', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/components-demo/uEditor'),
        name: 'EditNotice',
        meta: { title: '公告编辑', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/notice/list'),
        name: 'NoticeList',
        meta: { title: 'noticeList', icon: 'list' }
      }
    ]
  },

  {
    path: '/laoshiguanli',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/teacher/complexTable'),
        name: 'laoshiguanli',
        meta: { title: 'laoshiguanli', icon: 'laoshiguanli' }
      }
    ]
  },
  {
    path: '/nianjiguanli',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/grade/complexTable'),
        name: 'nianjiguanli',
        meta: { title: 'nianjiguanli', icon: 'nianjiguanli' }
      }
    ]
  },
  {
    path: '/xueshengguanli',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/student/complexTable'),
        name: 'xueshengguanli',
        meta: { title: 'xueshengguanli', icon: 'xueshengguanli', noCache: true }
      }
    ]
  },
  {
    path: '/myclass',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/myclass/index'),
        name: '执教班级',
        meta: { title: '执教班级', icon: 'tab' }
      }
    ]
  },
  {
    path: '/group',
    component: Layout,
    redirect: '/group/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/group/index'),
        name: 'group',
        meta: { title: 'group', icon: 'group' }
      }
    ]
  },
  {
    path: '/leave',
    component: Layout,
    redirect: '/leave/list',
    name: 'Leave',
    meta: {
      title: '请假',
      icon: 'qingjia'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/components-demo/uEditor'),
        name: 'CreateLeave',
        meta: { title: '创建请假', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/components-demo/uEditor'),
        name: 'EditNotice',
        meta: { title: '编辑请假', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/leave/list'),
        name: 'LeaveList',
        meta: { title: '我的请假', icon: 'list' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    redirect: '/form/list',
    name: 'Form',
    meta: {
      title: '表单',
      icon: 'biaodan'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/form/create'),
        name: 'CreateForm',
        meta: { title: '新建表单', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/components-demo/uEditor'),
        name: 'EditNotice',
        meta: { title: '编辑请假', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/leave/list'),
        name: 'LeaveList',
        meta: { title: '我的请假', icon: 'list' }
      }
    ]
  },
  {
    path: '/module',
    component: Layout,
    redirect: '/module/list',
    name: 'Module',
    meta: {
      title: '模块管理',
      icon: 'biaodan'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/form/create'),
        name: 'CreateForm',
        meta: { title: '新建模块', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/components-demo/uEditor'),
        name: 'EditNotice',
        meta: { title: '编辑请假', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/module/complexTable'),
        name: 'ModuleList',
        meta: { title: '模块列表', icon: 'list' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/list',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'biaodan'
    },
    children: [
      {
        path: 'school',
        component: () => import('@/views/system/schoolForm'),
        name: 'SchoolForm',
        meta: { title: '系统管理', icon: 'edit' }
      },
      {
        path: 'wechatTemplate',
        component: () => import('@/views/system/wechatTemplate'),
        name: 'WechatTemplate',
        meta: { title: '微信消息模板', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/components-demo/uEditor'),
        name: 'EditNotice',
        meta: { title: '编辑请假', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/module/complexTable'),
        name: 'ModuleList',
        meta: { title: '模块列表', icon: 'list' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
