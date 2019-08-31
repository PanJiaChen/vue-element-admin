import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import tableRouter from './modules/table'

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
    icon: 'svg-name'             the icon show in the sidebar
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
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/accounts',
    component: Layout,
    redirect: '/accounts/list',
    name: 'Accounts',
    meta: {
      title: 'Accounts',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/accounts/create'),
        name: 'CreateAccount',
        meta: { title: 'Create Account', icon: 'edit' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/accounts/edit'),
        name: 'EditAccount',
        meta: { title: 'Edit Account', noCache: true, activeMenu: '/accounts/list' },
        hidden: true
      },
      {
        path: 'buyer-list',
        component: () => import('@/views/accounts/list'),
        name: 'BuyerAccountList',
        meta: { title: 'Buyer Account List', icon: 'list', type: 'buyer' }
      },
      {
        path: 'seller-list',
        component: () => import('@/views/accounts/list'),
        name: 'SellerAccountList',
        meta: { title: 'Seller Account List', icon: 'list', type: 'seller' }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/list',
    name: 'Users',
    meta: {
      title: 'Users',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/users/create'),
        name: 'CreateUser',
        meta: { title: 'Create User', icon: 'edit' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/users/edit'),
        name: 'EditUser',
        meta: { title: 'Edit User', noCache: true, activeMenu: '/users/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/users/list'),
        name: 'UsersList',
        meta: { title: 'User List', icon: 'list' }
      }
    ]
  },
  {
    path: '/regions',
    component: Layout,
    redirect: '/regions/list',
    name: 'Regions',
    meta: {
      title: 'Regions',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/regions/create'),
        name: 'CreateRegion',
        meta: { title: 'Create Region', icon: 'edit' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/regions/edit'),
        name: 'EditRegion',
        meta: { title: 'Edit Region', noCache: true, activeMenu: '/regions/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/regions/list'),
        name: 'RegionsList',
        meta: { title: 'Region List', icon: 'list' }
      }
    ]
  },
  {
    path: '/terminals',
    component: Layout,
    redirect: '/terminals/list',
    name: 'Terminals',
    meta: {
      title: 'Terminals',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/terminals/create'),
        name: 'CreateRegion',
        meta: { title: 'Create Terminal', icon: 'edit' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/terminals/edit'),
        name: 'EditTerminal',
        meta: { title: 'Edit Terminal', noCache: true, activeMenu: '/terminals/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/terminals/list'),
        name: 'TerminalsList',
        meta: { title: 'Terminal List', icon: 'list' }
      }
    ]
  },
  {
    path: '/products',
    component: Layout,
    redirect: '/products/list',
    name: 'Products',
    meta: {
      title: 'Products',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/products/create'),
        name: 'CreateProduct',
        meta: { title: 'Create Product', icon: 'edit' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/products/edit'),
        name: 'EditProducts',
        meta: { title: 'Edit Product', noCache: true, activeMenu: '/products/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/products/list'),
        name: 'ProductssList',
        meta: { title: 'Products List', icon: 'list' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  tableRouter,
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://plattform.onlinefuels.de',
        meta: { title: 'Plattform', icon: 'link' }
      }
    ]
  },

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
