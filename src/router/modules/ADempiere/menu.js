import { getMenu } from '@/api/user'
import { getToken } from '@/utils/auth'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils'
import store from '@/store'

/* Layout  */
import Layout from '@/layout'
import { isEmptyValue } from '@adempiere/grpc-core-client'

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
  }
]

// Get Menu from server
export function loadMainMenu(organizationId = 0) {
  return new Promise(resolve => {
    organizationId = isEmptyValue(store.getters['user/getOrganization']) ? 0 : store.getters['user/getOrganization'].id
    getMenu(getToken()).then(menuResponse => {
      const asyncRoutesMap = []
      menuResponse.childsList.forEach(menuElement => {
        const optionMenu = getRouteFromMenuItem(menuElement, organizationId)
        if (menuElement.isSummary) {
          menuElement.childsList.forEach(menu => {
            const childsSumaryConverted = getChildFromAction({ menu, index: 0, organizationId })
            optionMenu.children.push(childsSumaryConverted)
            optionMenu.children[0].meta.childs.push(childsSumaryConverted)
            optionMenu.meta.childs.push(childsSumaryConverted)
          })
        } else {
          const childsConverted = getChildFromAction({ menu: menuElement, index: undefined, organizationId })

          optionMenu.children.push(childsConverted)
          optionMenu.meta.childs.push(childsConverted)
        }
        asyncRoutesMap.push(optionMenu)
      })
      resolve(staticRoutes.concat(asyncRoutesMap))
    }).catch(error => {
      console.warn(`Error getting menu: ${error.message}. Code: ${error.code}.`)
    })
  })
}

// Get Only Child
function getChildFromAction({ menu, index, organizationId }) {
  const action = menu.action
  const actionAttributes = convertAction(action)
  const clientId = store.getters['user/getRole'].clientId
  let routeIdentifier = actionAttributes.name + '/' + menu.id
  if (menu.isSummary) {
    routeIdentifier = '/' + menu.id
  }

  const option = {
    path: '/' + clientId + '/' + organizationId + '/' + routeIdentifier,
    component: actionAttributes.component,
    name: menu.uuid,
    hidden: index > 0,
    meta: {
      alwaysShow: true,
      description: menu.description,
      icon: actionAttributes.icon,
      isIndex: actionAttributes.isIndex,
      isReadOnly: menu.isReadOnly,
      isSummary: menu.isSummary,
      isSOTrx: menu.isSOTrx,
      parentUuid: menu.parentUuid,
      noCache: false,
      referenceUuid: menu.referenceUuid,
      tabUuid: '',
      title: menu.name,
      type: actionAttributes.name,
      uuid: menu.referenceUuid,
      childs: []
    }
  }

  if (actionAttributes.isIndex || actionAttributes.name === 'summary') {
    option['children'] = []
    menu.childsList.forEach(child => {
      const menuConverted = getChildFromAction({ menu: child, index: 1, organizationId })
      option.children.push(menuConverted)
      option.meta.childs.push(menuConverted)
    })
  }
  return option
}

// Convert menu item from server to Route
function getRouteFromMenuItem(menu, organizationId) {
  const action = menu.action
  const actionAttributes = convertAction(action)
  const clientId = store.getters['user/getRole'].clientId
  const optionMenu = {
    path: '/' + clientId + '/' + organizationId + '/' + menu.id,
    redirect: '/' + menu.id + '/index',
    component: Layout,
    name: menu.uuid,
    meta: {
      description: menu.description,
      icon: actionAttributes.icon,
      isReadOnly: menu.isReadOnly,
      isSummary: menu.isSummary,
      isSOTrx: menu.isSOTrx,
      noCache: true,
      referenceUuid: menu.referenceUuid,
      title: menu.name,
      type: actionAttributes.name,
      childs: []
    },
    children: [{
      path: 'index',
      component: actionAttributes.component,
      name: menu.uuid + '-index',
      hidden: true,
      meta: {
        breadcrumb: false,
        description: menu.description,
        icon: actionAttributes.icon,
        isIndex: actionAttributes.isIndex,
        isReadOnly: menu.isReadOnly,
        isSOTrx: menu.isSOTrx,
        noCache: true,
        parentUuid: menu.uuid,
        referenceUuid: menu.referenceUuid,
        title: menu.name,
        type: actionAttributes.name,
        childs: []
      }
    }]
  }
  return optionMenu
}
