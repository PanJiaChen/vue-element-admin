import {
  requestGetOrder,
  requestListOrders
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue, extractPagingToken } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

const ordes = {
  state: {
    order: {},
    findOrder: {},
    listOrder: {
      ...withoutResponse,
      isShowPopover: false
    }
  },
  mutations: {
    setOrder(state, order) {
      state.order = order
    },
    setListOrder(state, listOrder) {
      state.listOrder = {
        ...state.listOrder,
        ...listOrder
      }
    },
    setOrdersListPageNumber(state, pageNumber) {
      state.listOrder.pageNumber = pageNumber
    },
    showListOrders(state, isShow) {
      state.listOrder.isShowPopover = isShow
    },
    setIsReloadListOrders(state) {
      state.listOrder.isReload = true
    },
    currentOrder(state, currentOrder) {
      state.currentOrder = currentOrder
    },
    findOrder(state, findOrder) {
      state.findOrder = findOrder
    }
  },
  actions: {
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
        posUuid = getters.getPointOfSalesUuid
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
          showMessage({
            type: 'info',
            message: error.message,
            showClose: true
          })
        })
    },
    setOrder({ commit }, order) {
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
  },
  getters: {
    getOrder: (state) => {
      return state.order
    },
    getListOrder: (state) => {
      if (isEmptyValue(state.listOrder)) {
        return {
          ...withoutResponse,
          ordersList: []
        }
      }
      return state.listOrder
    },
    getCurrentOrder: (state) => {
      return state.currentOrder
    },
    getFindOrder: (state) => {
      return state.findOrder
    }
  }
}

export default ordes
