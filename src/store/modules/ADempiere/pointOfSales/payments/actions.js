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
  requestGetConversionRate,
  createPayment,
  deletePayment,
  updatePayment,
  getPaymentsList
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

/**
 * Payments Actions
 */
export default {
  /**
   * creating boxes with the payment list
   */
  setPaymentBox({ state, commit, getters }, {
    quantityCahs,
    bankUuid,
    referenceNo,
    description,
    amount,
    convertedAmount,
    paymentDate,
    tenderTypeCode,
    currencyUuid
  }) {
    const payments = getters.getPaymentBox.find(element => {
      if (tenderTypeCode === 'X' && element.currencyUuid === currencyUuid) {
        return element
      }
    })
    if (isEmptyValue(payments)) {
      commit('addPaymentBox', {
        quantityCahs,
        bankUuid,
        referenceNo,
        description,
        amount,
        convertedAmount,
        paymentDate,
        tenderTypeCode,
        currencyUuid
      })
    } else {
      const addPayment = getters.getPaymentBox.map(item => {
        if ((item.tenderTypeCode === tenderTypeCode) && item.currencyUuid === currencyUuid) {
          return {
            ...item,
            payAmt: item.amount + amount,
            quantityCahs: item.quantityCahs + quantityCahs
          }
        }
        return item
      })
      state.paymentBox = addPayment
    }
  },
  // upload orders to theServer
  uploadOrdersToServer({ dispatch }, {
    listPaymentsLocal,
    posUuid,
    orderUuid
  }) {
    listPaymentsLocal.forEach(payment => {
      createPayment({
        posUuid,
        orderUuid,
        bankUuid: payment.bankUuid,
        referenceNo: payment.referenceNo,
        description: payment.description,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        tenderTypeCode: payment.tenderTypeCode,
        currencyUuid: payment.currencyUuid
      })
        .then(response => {
          const orderUuid = response.order_uuid
          dispatch('listPayments', { orderUuid })
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    })
  },
  deleteCollectBox({ state }, key) {
    const payment = state.paymentBox
    payment.splice(key, 1)
  },
  deleteAllCollectBox({ state }) {
    const payment = state.paymentBox
    payment.splice(0)
  },
  searchConversion({ commit }, params) {
    return requestGetConversionRate({
      conversionTypeUuid: params.conversionTypeUuid,
      currencyFromUuid: params.currencyFromUuid,
      currencyToUuid: params.currencyToUuid,
      conversionDate: params.conversionDate
    })
      .then(response => {
        commit('addConversionToList', response)
        return response
      })
      .catch(error => {
        console.warn(`conversionDivideRate: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  conversionDivideRate({ commit, dispatch }, params) {
    return requestGetConversionRate({
      conversionTypeUuid: params.conversionTypeUuid,
      currencyFromUuid: params.currencyFromUuid,
      currencyToUuid: params.currencyToUuid,
      conversionDate: params.conversionDate
    })
      .then(response => {
        commit('setFieldCurrency', response.currencyTo)
        if (!isEmptyValue(response.currencyTo)) {
          const currency = {
            ...response.currencyTo,
            amountConvertion: response.divideRate,
            multiplyRate: response.multiplyRate
          }
          dispatch('addRateConvertion', currency)
        }
        const divideRate = isEmptyValue(response.divideRate) ? 1 : response.divideRate
        const multiplyRate = isEmptyValue(response.multiplyRate) ? 1 : response.multiplyRate
        if (params.containerUuid === 'Collection') {
          commit('currencyMultiplyRateCollection', multiplyRate)
          commit('currencyDivideRateCollection', divideRate)
        } else {
          commit('currencyMultiplyRate', multiplyRate)
          commit('currencyDivideRateCollection', divideRate)
        }
        return response
      })
      .catch(error => {
        console.warn(`conversionDivideRate: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  addRateConvertion({ commit, state, getters }, currency) {
    commit('conversionRate', currency)
  },
  changeMultiplyRate({ commit }, params) {
    commit('currencyMultiplyRate', params)
  },
  changeDivideRate({ commit }, divideRate) {
    commit('currencyDivideRate', divideRate)
  },
  createPayments({ dispatch, state, getters }, {
    posUuid,
    orderUuid,
    invoiceUuid,
    bankUuid,
    referenceNo,
    description,
    amount,
    convertedAmount,
    paymentDate,
    tenderTypeCode,
    currencyUuid
  }) {
    const listPayments = getters.getListPayments.payments.find(payment => {
      if ((payment.tenderTypeCode === tenderTypeCode) && (payment.tenderTypeCode === 'X') && (currencyUuid === payment.currencyUuid)) {
        return payment
      }
      return undefined
    })
    if (isEmptyValue(listPayments)) {
      return createPayment({
        posUuid,
        orderUuid,
        invoiceUuid,
        bankUuid,
        referenceNo,
        description,
        amount,
        convertedAmount,
        paymentDate,
        tenderTypeCode,
        currencyUuid
      })
        .then(response => {
          const orderUuid = response.order_uuid
          dispatch('listPayments', { orderUuid })
          return {
            ...response,
            type: 'Success'
          }
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          return {
            ...error,
            type: 'error'
          }
        })
    } else {
      return updatePayment({
        paymentUuid: listPayments.uuid,
        bankUuid,
        referenceNo,
        description,
        amount: listPayments.amount + amount,
        paymentDate,
        tenderTypeCode
      })
        .then(response => {
          const orderUuid = response.order_uuid
          dispatch('listPayments', { orderUuid })
          return {
            ...response,
            type: 'Success'
          }
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          return {
            ...error,
            type: 'error'
          }
        })
    }
  },
  deletetPayments({ dispatch }, {
    orderUuid,
    paymentUuid
  }) {
    deletePayment({
      paymentUuid
    })
      .then(response => {
        dispatch('listPayments', { orderUuid })
      })
      .catch(error => {
        console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listPayments({ commit, dispatch }, { posUuid, orderUuid }) {
    dispatch('updatePaymentPos', true)
    getPaymentsList({
      posUuid,
      orderUuid
    })
      .then(response => {
        commit('setListPayments', {
          payments: response.listPayments.reverse(),
          isLoaded: true
        })
      })
      .catch(error => {
        console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        dispatch('updatePaymentPos', false)
      })
  },
  currencyDisplaye({ commit }, currency) {
    const displaycurrency = currency.map(item => {
      return {
        currencyUuid: item.uuid,
        currencyId: item.id,
        currencyDisplay: item.label
      }
    })
    commit('setCurrencyDisplaye', displaycurrency)
  },
  addRefundLoaded({ commit, state }, refund) {
    const addRefund = state.refundLoaded
    addRefund.push(refund)
    commit('setRefundLoaded', addRefund)
  }
}
