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

import {
  requestListOrderLines
} from '@/api/ADempiere/form/point-of-sales.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
/**
 * Order Line Actions
 */
export default {
  listOrderLine({ commit }, params) {
    commit('setListOrderLine', params)
  },
  listOrderLinesFromServer({ commit }, orderUuid) {
    requestListOrderLines({
      orderUuid
    })
      .then(response => {
        const line = response.orderLineList.map(lineItem => {
          return {
            ...lineItem,
            quantityOrdered: lineItem.quantity,
            priceActual: lineItem.price,
            discount: lineItem.discountRate,
            product: {
              ...lineItem.product,
              priceStandard: lineItem.price,
              help: lineItem.help
            },
            taxIndicator: lineItem.taxRate.taxIndicator,
            grandTotal: lineItem.lineNetAmount
          }
        })
        commit('setListOrderLine', line)
      })
      .catch(error => {
        console.warn(`listOrderLinesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  updateOrderLines({ commit, rootGetters }, params) {
    // const line = rootGetters.getListOrderLine
    const line = rootGetters.posAttributes.currentPointOfSales.currentOrder.lineOrder
    const found = line.map(element => {
      if (element.uuid === params.uuid) {
        return {
          ...element,
          uuid: params.uuid,
          lineDescription: params.lineDescription,
          quantityOrdered: params.quantity,
          priceActual: params.price,
          discount: params.discountRate,
          product: {
            description: params.product.description,
            priceStandard: params.price,
            help: params.help,
            name: params.product.name,
            value: params.product.value
          },
          taxIndicator: params.taxRate.taxIndicator,
          grandTotal: params.lineNetAmount
        }
      }
      return {
        ...element
      }
    })
    commit('setListOrderLine', found)
  },
  currentLine({ commit }, currentLine) {
    commit('setLine', currentLine)
  }
}
