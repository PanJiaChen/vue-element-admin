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

import { requestMenu } from '@/api/user.js'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils.js'
import staticRoutes from '@/router/modules/ADempiere/staticRoutes.js'
import testRoutes from '@/router/modules/ADempiere/testRoutes.js'
import Layout from '@/layout'

/**
 * Get Menu from server
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {string} sessionUuid
 * @param {string} roleUuid
 * @param {string} organizationUuid
 */
export function loadMainMenu({
  sessionUuid,
  roleUuid = 0,
  organizationUuid = 0,
  role
}) {
  return new Promise(resolve => {
    requestMenu({
      sessionUuid
    }).then(menuResponse => {
      const asyncRoutesMap = []

      menuResponse.childs.forEach(menuElement => {
        const optionMenu = getRouteFromMenuItem({
          menu: menuElement,
          roleUuid,
          organizationUuid
        })

        if (optionMenu.meta.isSummary) {
          menuElement.childs.forEach(menu => {
            const childsSumaryConverted = getChildFromAction({
              menu,
              index: 0,
              roleUuid,
              organizationUuid
            })
            optionMenu.children.push(childsSumaryConverted)
            optionMenu.meta.childs.push(childsSumaryConverted)
          })
        } else {
          const childsConverted = getChildFromAction({
            menu: menuElement,
            index: undefined,
            roleUuid,
            organizationUuid
          })

          optionMenu.children.push(childsConverted)
          optionMenu.meta.childs.push(childsConverted)
        }
        asyncRoutesMap.push(optionMenu)
      })

      const permiseStactiRoutes = hidenStactiRoutes({
        staticRoutes,
        permiseRole: role
      })
      const menuRoutes = permiseStactiRoutes
        .concat(asyncRoutesMap)
        .concat(testRoutes)

      resolve(menuRoutes)
    }).catch(error => {
      console.warn(`Error getting menu: ${error.message}. Code: ${error.code}.`)
    })
  })
}

/**
 * Get Only Child
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {object} menu
 * @param {number} index
 * @param {string} roleUuid
 * @param {string} organizationUuid
 */
function getChildFromAction({ menu, index, roleUuid, organizationUuid }) {
  const { component, icon, name: type } = convertAction(menu.action)
  const routeIdentifier = type + '/' + menu.id
  const isIndex = menu.is_summary
  const option = {
    path: '/' + roleUuid + '/' + organizationUuid + '/' + routeIdentifier,
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
      type,
      uuid: menu.reference_uuid,
      childs: []
    },
    children: []
  }

  if (isIndex) {
    menu.childs.forEach(child => {
      const menuConverted = getChildFromAction({
        menu: child,
        index: 1,
        roleUuid,
        organizationUuid
      })
      option.children.push(menuConverted)
      option.meta.childs.push(menuConverted)
    })
  }

  return option
}

/**
 * Convert menu item from server to Route
 * @author elsiosanchez <elsiosanches@gmail.com>
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {object} menu
 * @param {string} roleUuid
 * @param {string} organizationUuid
 */
function getRouteFromMenuItem({ menu, roleUuid, organizationUuid }) {
  // use component of convertAction
  const { icon, name: type } = convertAction(menu.action)
  const isIndex = menu.is_summary
  const optionMenu = {
    path: '/' + roleUuid + '/' + organizationUuid + '/' + menu.id,
    redirect: '/' + menu.id,
    component: Layout,
    name: menu.uuid,
    meta: {
      description: menu.description,
      icon,
      isIndex,
      isReadOnly: menu.is_read_only,
      isSummary: menu.is_summary,
      isSalesTransaction: menu.is_sales_transaction,
      noCache: true,
      referenceUuid: menu.reference_uuid,
      title: menu.name,
      type,
      childs: []
    },
    children: []
  }
  return optionMenu
}

/**
 * Grant visibility to static routes based on current role permissions
 * @author elsiosanchez <elsiosanches@gmail.com>
 * @param {object} staticRoutes static routes
 * @param {object} permiseRole role permissions
 * @returns {object} routes with hidden/show
 */
function hidenStactiRoutes({ staticRoutes, permiseRole }) {
  const { isAllowInfoProduct } = permiseRole
  if (!isAllowInfoProduct) {
    // does not change the hidden visibility of ProductInfo
    return staticRoutes
  }

  return staticRoutes.map(route => {
    if (route.path === '/ProductInfo') {
      return {
        ...route,
        // is hidden by default, change to be visible
        hidden: !isAllowInfoProduct
      }
    }
    return {
      ...route
    }
  })
}
