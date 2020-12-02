
/* Layout  */
import Layout from '@/layout'

const staticRoutes = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/ProcessActivity',
    component: Layout,
    meta: {
      title: 'ProcessActivity',
      icon: 'tree-table',
      noCache: true,
      breadcrumb: false
    },
    redirect: '/ProcessActivity/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/ADempiere/ProcessActivity'),
        name: 'ProcessActivity',
        meta: {
          title: 'ProcessActivity',
          icon: 'tree-table',
          noCache: true,
          isIndex: true
        }
      }
    ]
  },
  {
    path: '/report-viewer',
    component: Layout,
    hidden: true,
    redirect: 'report-viewer/:processId/:instanceUuid/:fileName/:tableName?',
    children: [
      {
        path: ':processId/:instanceUuid/:fileName/:tableName?',
        component: () => import('@/views/ADempiere/ReportViewer'),
        name: 'Report Viewer',
        meta: {
          title: 'ReportViewer',
          reportFormat: ''
        }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/test',
        component: () => import('@/views/ADempiere/Test'),
        name: 'Test View',
        meta: {
          title: 'Test View',
          isIndex: true
        }
      }
    ]
  },
  {
    path: '/PriceChecking',
    component: Layout,
    hidden: false,
    children: [
      {
        path: '/PriceChecking',
        component: () => import('@/views/ADempiere/Form'),
        name: 'PriceChecking',
        meta: {
          icon: 'shopping',
          title: 'PriceChecking',
          isIndex: true
        }
      }
    ]
  },
  {
    path: '/BarcodeReader',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/BarcodeReader',
        component: () => import('@/views/ADempiere/Form'),
        name: 'BarcodeReader',
        meta: {
          icon: 'search',
          title: 'BarcodeReader',
          isIndex: true
        }
      }
    ]
  },
  {
    path: '/ProductInfo',
    component: Layout,
    hidden: false,
    children: [
      {
        path: '/ProductInfo',
        component: () => import('@/views/ADempiere/Form'),
        name: 'ProductInfo',
        meta: {
          title: 'ProductInfo',
          icon: 'search',
          isIndex: true
        }
      }
    ]
  }
]

export default staticRoutes
