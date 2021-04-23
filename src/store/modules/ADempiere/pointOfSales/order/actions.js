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
  requestCreateOrder,
  requestGetOrder,
  requestUpdateOrder,
  requestCreateOrderLine,
  requestListOrders
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue, extractPagingToken } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

/**
 * Order Actions
 */
export default {
  /**
   * Create Sales Order
   * @param {string} posUuid Current POS Uuid
   * @param {string} customerUuid Customer Uuid
   * @param {string} salesRepresentativeUuid Sales Representative Uuid
   */
  createOrder({ commit, dispatch }, {
    posUuid,
    customerUuid,
    salesRepresentativeUuid
  }) {
    return requestCreateOrder({
      posUuid,
      customerUuid,
      salesRepresentativeUuid
    })
      .then(order => {
        commit('setOrder', order)
        dispatch('fillOrde', { attribute: order })

        commit('setIsReloadListOrders')
        return order
      })
      .catch(error => {
        console.error(error.message)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  /**
   * Update Sales Order
   * @param {string} posUuid Current POS Uuid
   * @param {string} posUuid Order Uuid
   * @param {string} customerUuid Customer Uuid
   */
  updateOrder({ commit, dispatch }, {
    orderUuid,
    posUuid,
    customerUuid
  }) {
    requestUpdateOrder({
      orderUuid,
      posUuid,
      customerUuid
    })
      .then(response => {
        dispatch('reloadOrder', { orderUuid: response.uuid })
      })
      .catch(error => {
        console.error(error.message)
        this.$message({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },

  /**
   * Create order line from order uuid and product
   * @param {string} orderUuid Order Uuid
   * @param {string} productUuid Product Uuid
   * @param {string} description Product description
   * @param {number} quantity Quantity Producto
   * @param {number} price Price Producto
   * @param {number} discountRate DiscountRate Producto
   */
  createOrderLine({ commit, dispatch }, {
    orderUuid,
    warehouseUuid,
    productUuid,
    chargeUuid,
    description,
    quantity,
    price,
    discountRate
  }) {
    requestCreateOrderLine({
      orderUuid,
      productUuid
    })
      .then(orderLine => {
        dispatch('updateOrderLines', orderLine)
        // this.fillOrderLine(orderLine)
        this.reloadOrder(true, orderUuid)
      })
      .catch(error => {
        console.warn(error.message)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  /**
   * Reload Order
   * @param {string} orderUuid Order Uuid
   */
  reloadOrder({ commit, dispatch, rootGetters }, { orderUuid }) {
    if (isEmptyValue(orderUuid)) {
      orderUuid = rootGetters.posAttributes.currentPointOfSales.currentOrder.uuid // this.currentOrder.uuid
    }
    if (!isEmptyValue(orderUuid)) {
      requestGetOrder(orderUuid)
        .then(orderResponse => {
          dispatch('fillOrde', {
            attribute: orderResponse,
            setToStore: false
          })
          dispatch('currentOrder', orderResponse)
        // dispatch('listOrderLinesFromServer', orderResponse.uuid)
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }
  },
  /**
   * Fill Order
   * @param {object} attribute Attributes of the Order
   * @param {boolean} setToStore set To Store
   */
  fillOrde({ commit, dispatch }, {
    attribute,
    setToStore = true
  }) {
    const orderToPush = {
      uuid: attribute.uuid,
      id: attribute.id,
      businessPartner: attribute.businessPartner, // description, duns, id, lastName, naics, name, taxId, uuid, value
      documentNo: attribute.documentNo,
      dateOrdered: attribute.dateOrdered,
      documentStatus: attribute.documentStatus, // value, name, description
      documentType: attribute.documentType, // name, printName
      salesRepresentative: attribute.salesRepresentative, // id, uuid, name, description,
      totalLines: attribute.totalLines,
      grandTotal: attribute.grandTotal
    }
    // if (setToStore) {
    dispatch('setOrder', {
      ...orderToPush
    })
    // }
  },
  /**
   * Set page number of pagination list
   * @param {number}  pageNumber
   */
  setOrdersListPageNumber({ commit, dispatch }, pageNumber) {
    commit('setOrdersListPageNumber', pageNumber)
    dispatch('listOrdersFromServer', {})
  },
  listOrdersFromServer({ state, commit, getters }, {
    posUuid,
    documentNo,
    businessPartnerUuid,
    grandTotal,
    openAmount,
    isPaid,
    isProcessed,
    isAisleSeller,
    isInvoiced,
    dateOrderedFrom,
    dateOrderedTo,
    salesRepresentativeUuid
  }) {
    if (isEmptyValue(posUuid)) {
      posUuid = getters.posAttributes.currentPointOfSales.uuid
    }

    let { pageNumber, token } = state.listOrder
    if (isEmptyValue(pageNumber)) {
      pageNumber = 1
    }
    let pageToken
    if (!isEmptyValue(token)) {
      pageToken = token + '-' + pageNumber
    }
    requestListOrders({
      posUuid,
      documentNo,
      businessPartnerUuid,
      grandTotal,
      openAmount,
      isPaid,
      isProcessed,
      isAisleSeller,
      isInvoiced,
      dateOrderedFrom,
      dateOrderedTo,
      salesRepresentativeUuid,
      pageToken
    })
      .then(responseOrdersList => {
        if (isEmptyValue(token) || isEmptyValue(pageToken)) {
          token = extractPagingToken(responseOrdersList.nextPageToken)
        }

        commit('setListOrder', {
          ...responseOrdersList,
          isLoaded: true,
          isReload: false,
          posUuid,
          token,
          pageNumber
        })
      })
      .catch(error => {
        console.warn(`listOrdersFromServer: ${error.message}. Code: ${error.code}.`)
        // showMessage({
        //   type: 'info',
        //   message: error.message,
        //   showClose: true
        // })
      })
  },
  setOrder({ commit, dispatch }, order) {
    dispatch('listOrderLinesFromServer', order.uuid)
    commit('setOrder', order)
  },
  currentOrder({ commit }, findOrder) {
    commit('findOrder', findOrder)
  },
  findOrderServer({ commit }, orderUuid) {
    if (typeof orderUuid === 'string' && !isEmptyValue(orderUuid)) {
      requestGetOrder(orderUuid)
        .then(responseOrder => {
          commit('findOrder', responseOrder)
        })
        .catch(error => {
          console.warn(`findOrderServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'info',
            message: error.message,
            showClose: true
          })
        })
    }
    commit('findOrder', {})
  }
}
