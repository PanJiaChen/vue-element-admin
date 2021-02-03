
import {
  requestGetConversionRate,
  requestCreatePayment,
  requestDeletePayment,
  requestUpdatePayment,
  requestListPayments
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const collection = {
  state: {
    paymentBox: [],
    multiplyRate: 1,
    divideRate: 1,
    multiplyRateCollection: 1,
    divideRateCollection: 1,
    listPayments: [],
    tenderTypeDisplaye: []
  },
  mutations: {
    addPaymentBox(state, paymentBox) {
      state.paymentBox.push(paymentBox)
    },
    currencyMultiplyRate(state, multiplyRate) {
      state.multiplyRate = multiplyRate
    },
    currencyDivideRate(state, divideRate) {
      state.divideRate = divideRate
    },
    currencyMultiplyRateCollection(state, multiplyRateCollection) {
      state.multiplyRateCollection = multiplyRateCollection
    },
    currencyDivideRateCollection(state, divideRateCollection) {
      state.divideRateCollection = divideRateCollection
    },
    setListPayments(state, list) {
      state.listPayments = list
    },
    setTenderTypeDisplaye(state, tenderTypeDisplaye) {
      state.tenderTypeDisplaye = tenderTypeDisplaye
    }
  },
  actions: {
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
        requestCreatePayment({
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
        requestUpdatePayment({
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
      console.log(paymentUuid, orderUuid)
      requestDeletePayment({
        paymentUuid
      })
        .then(response => {
          console.log(response.listPayments)
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
    listPayments({ commit }, { posUuid, orderUuid }) {
      requestListPayments({
        posUuid,
        orderUuid
      })
        .then(response => {
          console.log(response.listPayments)
          commit('setListPayments', response.listPayments)
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
    tenderTypeDisplaye({ commit }, tenderType) {
      const displayTenderType = tenderType.map(item => {
        return {
          tenderTypeCode: item.id,
          tenderTypeDisplay: item.label
        }
      })
      commit('setTenderTypeDisplaye', displayTenderType)
    }
  },
  getters: {
    getPaymentBox: (state) => {
      return state.paymentBox
    },
    getMultiplyRate: (state) => {
      return state.multiplyRate
    },
    getDivideRate: (state) => {
      return state.divideRate
    },
    getMultiplyRateCollection: (state) => {
      return state.multiplyRateCollection
    },
    getDivideRateCollection: (state) => {
      return state.divideRateCollection
    },
    getListPayments: (state) => {
      console.log(state.listPayments)
      return state.listPayments
    },
    getTenderTypeDisplaye: (state) => {
      return state.tenderTypeDisplaye
    }
  }
}

export default collection
