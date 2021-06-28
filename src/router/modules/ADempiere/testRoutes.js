// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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

const testRoutes = [
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
    path: '/test/window/standard',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/test/window/standard',
        component: () => import('@/views/ADempiere/Test/Window'),
        name: 'Window Test View',
        meta: {
          title: 'Window Test View',
          isIndex: true
        }
      }
    ]
  },

  {
    path: '/test/multitab/window',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/test/multitab/window',
        component: () => import('@/views/ADempiere/Test/MultiTabWindow'),
        name: 'Multi Tab Window View',
        meta: {
          title: 'Multi Tab Window View',
          isIndex: true
        }
      }
    ]
  },

  {
    path: '/test/process/standard',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/test/process/standard',
        component: () => import('@/views/ADempiere/Test/Process'),
        name: 'Process Test View',
        meta: {
          title: 'Process Test View',
          isIndex: true
        }
      }
    ]
  },

  {
    path: '/test/smart-browser/standard',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/test/smart-browser/standard',
        component: () => import('@/views/ADempiere/Test/SmartBrowser'),
        name: 'Smart Browser Test View',
        meta: {
          title: 'SmartBrowser Test View',
          isIndex: true
        }
      }
    ]
  }
]

export default testRoutes
