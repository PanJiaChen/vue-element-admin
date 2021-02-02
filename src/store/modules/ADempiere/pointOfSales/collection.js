
import { requestGetConversionRate } from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const collection = {
  state: {
    paymentBox: [],
    multiplyRate: 1,
    divideRate: 1,
    multiplyRateCollection: 1,
    divideRateCollection: 1
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
    }
  },
  actions: {
    /**
     * creating boxes with the payment list
     */
    setPaymentBox({ state, commit, getters }, params) {
      const payments = getters.getPaymentBox.find(element => {
        if (params.tenderType === 'X' && element.currency.id === params.currency.id) {
          return element
        }
      })
      if (isEmptyValue(payments)) {
        commit('addPaymentBox', params)
      } else {
        const addPayment = getters.getPaymentBox.map(item => {
          if ((item.tenderType === params.tenderType) && item.currency.id === params.currency.id) {
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
    }
  }
}

export default collection
