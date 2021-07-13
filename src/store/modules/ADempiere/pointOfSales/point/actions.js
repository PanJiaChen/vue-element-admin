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
  listPointOfSales,
  listWarehouse,
  listPrices,
  listCurrencies
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
    let pos, pontOfSalesList
    listPointOfSales({
      userUuid
    })
      .then(response => {
        pontOfSalesList = response.sellingPointsList
        if (!isEmptyValue(posToSet)) {
          pos = pontOfSalesList.find(itemPOS => itemPOS.id === parseInt(posToSet))
        }
        if (isEmptyValue(pos) && isEmptyValue(posToSet)) {
          pos = pontOfSalesList.find(itemPOS => itemPOS.salesRepresentative.uuid === userUuid)
        }
        if (isEmptyValue(pos)) {
          pos = pontOfSalesList[0]
        }
        commit('setPointOfSalesList', pontOfSalesList)
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
  listWarehouseFromServer({ commit }, posUuid) {
    listWarehouse({
      posUuid
    })
      .then(response => {
        commit('setWarehousesList', response.records)
      })
      .catch(error => {
        console.warn(`listWarehouseFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listPricesFromServer({ commit }, point) {
    listPrices({
      posUuid: point.uuid
    })
      .then(response => {
        commit('setPricesList', response.records)
      })
      .catch(error => {
        console.warn(`listPricesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listCurrenciesFromServer({ commit }, posUuid) {
    listCurrencies({
      posUuid
    })
      .then(response => {
        commit('setCurrenciesList', response.records)
      })
      .catch(error => {
        console.warn(`listPricesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  setCurrentPOS({ commit, dispatch, state, rootGetters }, posToSet) {
    commit('setCurrentPointOfSales', posToSet)
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
    state.currenciesList = []
    dispatch('listWarehouseFromServer', posToSet.uuid)
    dispatch('listCurrenciesFromServer', posToSet.uuid)
    dispatch('listPricesFromServer', posToSet)
    commit('setCurrentPriceList', posToSet.priceList)
    commit('setCurrentWarehousePos', rootGetters['user/getWarehouse'])
    commit('resetConversionRate', [])
    commit('setIsReloadKeyLayout')
    commit('setIsReloadProductPrice')
    commit('setIsReloadListOrders')
    commit('setShowPOSKeyLayout', false)
  }
}
