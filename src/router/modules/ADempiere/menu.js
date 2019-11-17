import { getMenu } from '@/api/user'
import { getToken } from '@/utils/auth'

/* Layout  */
import Layout from '@/layout'

// Get Menu from server
export function loadMainMenu() {
  return getMenu(getToken()).then(menu => {
    const asyncRouterMap = [
      {
        path: '*',
        redirect: '/404',
        hidden: true
      },
      {
        path: '/ProcessActivity',
        component: Layout,
        meta: { title: 'ProcessActivity', icon: 'tree-table', noCache: true, breadcrumb: false },
        redirect: '/ProcessActivity/index',
        children: [
          {
            path: 'index',
            component: () => import('@/views/ADempiere/ProcessActivity'),
            name: 'ProcessActivity',
            meta: { title: 'ProcessActivity', icon: 'tree-table', noCache: true, isIndex: true }
          }
        ]
      },
      {
        path: '/report-viewer',
        component: Layout,
        hidden: true,
        redirect: 'report-viewer/:processId/:instanceUuid/:fileName',
        children: [
          {
            path: ':processId/:instanceUuid/:fileName',
            component: () => import('@/views/ADempiere/ReportViewer'),
            name: 'Report Viewer',
            meta: {
              title: 'ReportViewer'
            }
          }
        ]
      }
    ]
    menu.getChildsList().forEach(menu => {
      const optionMenu = getRouteFromMenuItem(menu)
      if (menu.getIssummary()) {
        menu.getChildsList().forEach((menu, index) => {
          optionMenu.children.push(getChildFromAction(menu, index = 0))
          optionMenu.children[0].meta.childs.push(getChildFromAction(menu, index = 0))
          optionMenu.meta.childs.push(getChildFromAction(menu, index = 0))
        })
      } else {
        optionMenu.children.push(getChildFromAction(menu))
        optionMenu.meta.childs.push(getChildFromAction(menu))
      }
      asyncRouterMap.push(optionMenu)
    })
    return asyncRouterMap
  }).catch(error => {
    console.log('Error with Login: ' + error)
  })
}

// Get Only Child
function getChildFromAction(menu, index) {
  const action = menu.getAction()
  var actionAttributes = convertAction(action)
  var routeIdentifier = actionAttributes.name + '/' + menu.getId()
  let selectedComponent
  if (action === 'W') {
    selectedComponent = () => import('@/views/ADempiere/Window')
    routeIdentifier = actionAttributes.name + '/' + menu.getId()
  } else if (action === 'S') {
    selectedComponent = () => import('@/views/ADempiere/Browser')
  } else if (action === 'P' || action === 'R') {
    selectedComponent = () => import('@/views/ADempiere/Process')
  } else if (action === 'B' || action === 'F' || action === 'T' || action === 'X') {
    selectedComponent = () => import('@/views/ADempiere/Unsupported')
  } else {
    selectedComponent = () => import('@/views/ADempiere/Summary')
    routeIdentifier = '/' + menu.getId()
  }
  var option = {
    path: routeIdentifier,
    component: selectedComponent,
    name: menu.getUuid(),
    hidden: index > 0,
    meta: {
      isIndex: actionAttributes.isIndex,
      title: menu.getName(),
      description: menu.getDescription(),
      uuid: menu.getReferenceuuid(),
      tabUuid: '',
      type: actionAttributes.name,
      parentUuid: menu.getParentuuid(),
      icon: actionAttributes.icon,
      alwaysShow: true,
      noCache: false,
      childs: []
    }
  }
  if (option.meta.type === 'summary') {
    option['children'] = []
    menu.getChildsList().forEach((child, index) => {
      option.children.push(getChildFromAction(child, index = 1))
      option.meta.childs.push(getChildFromAction(child, index = 1))
    })
  }
  return option
}

// Convert menu item from server to Route
function getRouteFromMenuItem(menu) {
  const action = menu.getAction()
  var actionAttributes = convertAction(action)
  var optionMenu = []
  optionMenu = {
    path: '/' + menu.getId(),
    redirect: '/' + menu.getId() + '/index',
    component: Layout,
    name: menu.getUuid(),
    meta: {
      title: menu.getName(),
      description: menu.getDescription(),
      type: actionAttributes.name,
      icon: actionAttributes.icon,
      noCache: true,
      childs: []
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/ADempiere/Summary'),
        name: menu.getUuid() + '-index',
        hidden: true,
        meta: {
          isIndex: actionAttributes.isIndex,
          parentUuid: menu.getUuid(),
          title: menu.getName(),
          description: menu.getDescription(),
          type: actionAttributes.name,
          icon: actionAttributes.icon,
          noCache: true,
          breadcrumb: false,
          childs: []
        }
      }
    ]
  }
  return optionMenu
}

// Convert action to action name for route
function convertAction(action) {
  var actionAttributes = {
    name: '',
    icon: '',
    hidden: false,
    isIndex: false
  }
  switch (action) {
    case 'B':
      actionAttributes.name = 'workbech'
      actionAttributes.icon = 'peoples'
      break
    case 'F':
      actionAttributes.name = 'workflow'
      actionAttributes.icon = 'example'
      break
    case 'P':
      actionAttributes.name = 'process'
      actionAttributes.icon = 'component'
      break
    case 'R':
      actionAttributes.name = 'report'
      actionAttributes.icon = 'skill'
      break
    case 'S':
      actionAttributes.name = 'browser'
      actionAttributes.icon = 'search'
      break
    case 'T':
      actionAttributes.name = 'task'
      actionAttributes.icon = 'size'
      break
    case 'W':
      actionAttributes.name = 'window'
      actionAttributes.icon = 'tab'
      break
    case 'X':
      actionAttributes.name = 'form'
      actionAttributes.icon = 'form'

      break
    default:
      actionAttributes.name = 'summary'
      actionAttributes.icon = 'nested'
      // actionAttributes.hidden = true
      actionAttributes.isIndex = true
      break
  }
  return actionAttributes
}
