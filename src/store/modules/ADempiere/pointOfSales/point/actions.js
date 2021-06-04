// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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

import router from '@/router'
import {
  listPointOfSales
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

/**
 * Pos Actions
 */
export default {
  /**
   * List point of sales terminal
   * @param {number} posToSet id to set
   */
  listPointOfSalesFromServer({ commit, getters, dispatch }, posToSet = null) {
    const userUuid = getters['user/getUserUuid']
    let pos, listPos
    listPointOfSales({
      userUuid
    })
      .then(response => {
        listPos = response.sellingPointsList
        if (!isEmptyValue(posToSet)) {
          pos = listPos.find(itemPOS => itemPOS.id === parseInt(posToSet))
        }
        if (isEmptyValue(pos) && isEmptyValue(posToSet)) {
          pos = listPos.find(itemPOS => itemPOS.salesRepresentative.uuid === userUuid)
        }
        if (isEmptyValue(pos)) {
          pos = listPos[0]
        }
        commit('listPointOfSales', listPos)
        dispatch('setCurrentPOS', pos)
      })
      .catch(error => {
        console.warn(`listPointOfSalesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  setCurrentPOS({ commit, dispatch }, posToSet) {
    commit('currentPointOfSales', posToSet)
    const oldRoute = router.app._route
    router.push({
      name: oldRoute.name,
      params: {
        ...oldRoute.params
      },
      query: {
        ...oldRoute.query,
        pos: posToSet.id
      }
    }, () => {})

    commit('resetConversionRate', [])
    commit('setIsReloadKeyLayout')
    commit('setIsReloadProductPrice')
    commit('setIsReloadListOrders')
    commit('setShowPOSKeyLayout', false)
  }
}
