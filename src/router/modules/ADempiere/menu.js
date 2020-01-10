import { getMenu } from '@/api/user'
import { getToken } from '@/utils/auth'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils'

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
          title: 'ReportViewer'
        }
      }
    ]
  }
]

// Get Menu from server
export function loadMainMenu() {
  return getMenu(getToken()).then(menu => {
    const asyncRoutesMap = []
    menu.childsList.forEach(menu => {
      const optionMenu = getRouteFromMenuItem(menu)
      if (menu.isSummary) {
        menu.childsList.forEach(menu => {
          const childsSumaryConverted = getChildFromAction(menu, 0)

          optionMenu.children.push(childsSumaryConverted)
          optionMenu.children[0].meta.childs.push(childsSumaryConverted)
          optionMenu.meta.childs.push(childsSumaryConverted)
        })
      } else {
        const childsConverted = getChildFromAction(menu)

        optionMenu.children.push(childsConverted)
        optionMenu.meta.childs.push(childsConverted)
      }
      asyncRoutesMap.push(optionMenu)
    })
    return staticRoutes.concat(asyncRoutesMap)
  }).catch(error => {
    console.warn(`Error getting menu: ${error.message}. Code: ${error.code}`)
  })
}

// Get Only Child
function getChildFromAction(menu, index) {
  const action = menu.action
  const actionAttributes = convertAction(action)
  let routeIdentifier = actionAttributes.name + '/' + menu.id
  if (menu.isSummary) {
    routeIdentifier = '/' + menu.id
  }

  const option = {
    path: routeIdentifier,
    component: actionAttributes.component,
    name: menu.uuid,
    hidden: index > 0,
    meta: {
      isIndex: actionAttributes.isIndex,
      title: menu.name,
      description: menu.description,
      uuid: menu.referenceUuid,
      tabUuid: '',
      type: actionAttributes.name,
      parentUuid: menu.parentUuid,
      icon: actionAttributes.icon,
      alwaysShow: true,
      noCache: false,
      childs: []
    }
  }

  if (actionAttributes.isIndex || actionAttributes.name === 'summary') {
    option['children'] = []
    menu.childsList.forEach(child => {
      const menuConverted = getChildFromAction(child, 1)
      option.children.push(menuConverted)
      option.meta.childs.push(menuConverted)
    })
  }
  return option
}

// Convert menu item from server to Route
function getRouteFromMenuItem(menu) {
  const action = menu.action
  const actionAttributes = convertAction(action)
  const optionMenu = {
    path: '/' + menu.id,
    redirect: '/' + menu.id + '/index',
    component: Layout,
    name: menu.uuid,
    meta: {
      title: menu.name,
      description: menu.description,
      type: actionAttributes.name,
      icon: actionAttributes.icon,
      noCache: true,
      childs: []
    },
    children: [{
      path: 'index',
      component: actionAttributes.component,
      name: menu.uuid + '-index',
      hidden: true,
      meta: {
        isIndex: actionAttributes.isIndex,
        parentUuid: menu.uuid,
        title: menu.name,
        description: menu.description,
        type: actionAttributes.name,
        icon: actionAttributes.icon,
        noCache: true,
        breadcrumb: false,
        childs: []
      }
    }]
  }
  return optionMenu
}
