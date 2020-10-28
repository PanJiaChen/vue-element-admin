import { requestMenu } from '@/api/user.js'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils'
import staticRoutes from '@/router/modules/ADempiere/staticRoutes.js'
/* Layout  */
import Layout from '@/layout'

// Get Menu from server
export function loadMainMenu({
  sessionUuid,
  clientId = 0,
  organizationId = 0
}) {
  return new Promise(resolve => {
    requestMenu({
      sessionUuid
    }).then(menuResponse => {
      const asyncRoutesMap = []

      menuResponse.childs.forEach(menuElement => {
        const optionMenu = getRouteFromMenuItem({
          menu: menuElement,
          clientId,
          organizationId
        })

        if (optionMenu.meta.isSummary) {
          menuElement.childs.forEach(menu => {
            const childsSumaryConverted = getChildFromAction({
              menu,
              index: 0,
              clientId,
              organizationId
            })
            optionMenu.children.push(childsSumaryConverted)
            optionMenu.children[0].meta.childs.push(childsSumaryConverted)
            optionMenu.meta.childs.push(childsSumaryConverted)
          })
        } else {
          const childsConverted = getChildFromAction({
            menu: menuElement,
            index: undefined,
            clientId,
            organizationId
          })

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

/**
 * Get Only Child
 * @param {object} menu
 * @param {number} index
 * @param {number} clientId
 * @param {number} organizationId
 */
function getChildFromAction({ menu, index, clientId, organizationId }) {
  const { component, icon, name, isIndex } = convertAction(menu.action)
  const routeIdentifier = name + '/' + menu.id

  const option = {
    path: '/' + clientId + '/' + organizationId + '/' + routeIdentifier,
    component,
    name: menu.uuid,
    hidden: index > 0,
    meta: {
      alwaysShow: true,
      description: menu.description,
      icon,
      isIndex,
      isReadOnly: menu.is_read_only,
      isSummary: menu.is_summary,
      isSalesTransaction: menu.is_sales_transaction,
      parentUuid: menu.parent_uuid,
      noCache: false,
      referenceUuid: menu.reference_uuid,
      tabUuid: '',
      title: menu.name,
      type: name,
      uuid: menu.reference_uuid,
      childs: []
    }
  }

  if (isIndex || name === 'summary') {
    option['children'] = []
    menu.childs.forEach(child => {
      const menuConverted = getChildFromAction({
        menu: child,
        index: 1,
        clientId,
        organizationId
      })
      option.children.push(menuConverted)
      option.meta.childs.push(menuConverted)
    })
  }

  return option
}

/**
 * Convert menu item from server to Route
 * @param {object} menu
 * @param {number} clientId
 * @param {number} organizationId
 */
function getRouteFromMenuItem({ menu, clientId, organizationId }) {
  const { component, icon, name, isIndex } = convertAction(menu.action)

  const optionMenu = {
    path: '/' + clientId + '/' + organizationId + '/' + menu.id,
    redirect: '/' + menu.id + '/index',
    component: Layout,
    name: menu.uuid,
    meta: {
      description: menu.description,
      icon,
      isReadOnly: menu.is_read_only,
      isSummary: menu.is_summary,
      isSalesTransaction: menu.is_sales_transaction,
      noCache: true,
      referenceUuid: menu.reference_uuid,
      title: menu.name,
      type: name,
      childs: []
    },
    children: [{
      path: 'index',
      component,
      name: menu.uuid + '-index',
      hidden: true,
      meta: {
        breadcrumb: false,
        description: menu.description,
        icon,
        isIndex,
        isReadOnly: menu.is_read_only,
        isSalesTransaction: menu.is_sales_transaction,
        noCache: true,
        parentUuid: menu.uuid,
        referenceUuid: menu.reference_uuid,
        title: menu.name,
        type: name,
        childs: []
      }
    }]
  }
  return optionMenu
}
