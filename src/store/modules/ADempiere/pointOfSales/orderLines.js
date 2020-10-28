import {
  requestListOrderLines
} from '@/api/ADempiere/form/point-of-sales.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const orderLine = {
  state: {
    listOrderLine: []
  },
  mutations: {
    setListOrderLine(state, listOrderLine) {
      state.listOrderLine = listOrderLine
    }
  },
  actions: {
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
      const line = rootGetters.getListOrderLine
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
    }
  },
  getters: {
    getListOrderLine: (state) => {
      return state.listOrderLine
    }
  }
}

export default orderLine
