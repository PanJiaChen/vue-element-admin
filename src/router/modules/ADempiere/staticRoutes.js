// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Leonel Matos lMatos@eroya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
    path: '/PriceChecking',
    component: Layout,
    hidden: true,
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
