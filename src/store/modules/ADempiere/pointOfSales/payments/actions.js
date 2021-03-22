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
 * @author Elsio Sanchez <elsiosanches@gmail.com>
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
  conversionDivideRate({ commit }, params) {
    requestGetConversionRate({
      conversionTypeUuid: params.conversionTypeUuid,
      currencyFromUuid: params.currencyFromUuid,
      currencyToUuid: params.currencyToUuid
    })
      .then(response => {
        const divideRate = isEmptyValue(response.divideRate) ? 1 : response.divideRate
        if (params.containerUuid === 'Collection') {
          commit('currencyDivideRateCollection', divideRate)
        } else {
          commit('currencyDivideRate', divideRate)
        }
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
  conversionMultiplyRate({ commit }, {
    containerUuid,
    conversionTypeUuid,
    currencyFromUuid,
    currencyToUuid
    // conversionDate
  }) {
    requestGetConversionRate({
      conversionTypeUuid,
      currencyFromUuid,
      currencyToUuid
      // conversionDate
    })
      .then(response => {
        const multiplyRate = isEmptyValue(response.multiplyRate) ? 0 : response.multiplyRate
        if (containerUuid === 'Collection') {
          commit('currencyMultiplyRateCollection', multiplyRate)
        } else {
          commit('currencyMultiplyRate', multiplyRate)
        }
      })
      .catch(error => {
        console.warn(`conversionMultiplyRate: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
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
    paymentDate,
    tenderTypeCode,
    currencyUuid
  }) {
    const listPayments = getters.getListPayments.find(payment => {
      if ((payment.tenderTypeCode === tenderTypeCode) && (payment.tenderTypeCode === 'X') && (currencyUuid === payment.currencyUuid)) {
        return payment
      }
      return undefined
    })
    if (isEmptyValue(listPayments)) {
      createPayment({
        posUuid,
        orderUuid,
        invoiceUuid,
        bankUuid,
        referenceNo,
        description,
        amount,
        paymentDate,
        tenderTypeCode,
        currencyUuid
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
    } else {
      updatePayment({
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
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
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
        commit('setListPayments', response.listPayments)
      })
      .catch(error => {
        console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        dispatch('updatePaymentPos', false)
      })
  },
  tenderTypeDisplaye({ commit }, tenderType) {
    const displayTenderType = tenderType.map(item => {
      return {
        tenderTypeCode: item.id,
        tenderTypeDisplay: item.label
      }
    })
    commit('setTenderTypeDisplaye', displayTenderType)
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
  convertionPayment({ commit }, {
    conversionTypeUuid,
    currencyFromUuid,
    currencyToUuid
  }) {
    requestGetConversionRate({
      conversionTypeUuid,
      currencyFromUuid,
      currencyToUuid
    })
      .then(response => {
        commit('setConvertionPayment', response)
      })
      .catch(error => {
        console.warn(`ConvertionPayment: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  }
}
