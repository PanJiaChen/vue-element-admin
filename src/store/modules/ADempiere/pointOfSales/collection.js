
import { requestGetConversionRate } from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const collection = {
  state: {
    paymentBox: [],
    multiplyRate: 1,
    divideRate: 1
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
    }
  },
  actions: {
    /**
     * creating boxes with the payment list
     */
    setPaymentBox({ state, commit, getters }, params) {
      const payments = getters.getPaymentBox.find(element => {
        if (element.tenderType === params.tenderType && element.currency.id === params.currency.id) {
          return element
        }
      })
      if (isEmptyValue(payments)) {
        commit('addPaymentBox', params)
      } else {
        const addPayment = getters.getPaymentBox.map(item => {
          if (item.tenderType === params.tenderType && item.currency.id === params.currency.id) {
            return {
              ...item,
              payAmt: item.payAmt + params.payAmt,
              quantityCahs: item.quantityCahs + params.quantityCahs
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
        currencyToUuid: params.currencyToUuid,
        conversionDate: params.conversionDate
      })
        .then(response => {
          const divideRate = isEmptyValue(response.divideRate) ? 1 : response.divideRate
          commit('currencyDivideRate', divideRate)
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
      conversionTypeUuid,
      currencyFromUuid,
      currencyToUuid,
      conversionDate
    }) {
      return Promise(resolve => {
        requestGetConversionRate({
          conversionTypeUuid,
          currencyFromUuid,
          currencyToUuid,
          conversionDate
        })
          .then(response => {
            const multiplyRate = isEmptyValue(response.multiplyRate) ? 1 : response.multiplyRate

            commit('currencyMultiplyRate', multiplyRate)
            resolve(multiplyRate)
          })
          .catch(error => {
            console.warn(`conversionMultiplyRate: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      })
    },
    changeMultiplyRate({ commit }, params) {
      commit('currencyMultiplyRate', params)
    },
    changeDivideRate({ commit }, divideRate) {
      commit('currencyDivideRate', divideRate)
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
    }
  }
}

export default collection
