import {
  receipts,
  invoces,
  processReceipt
} from '@/api/ADempiere/form/match.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const match = {
  invoices: [],
  receipts: [],
  selectedReceipt: [],
  selectedInvoce: []
}

export default {
  state: match,
  mutations: {
    setInvoiceLisMatch(state, list) {
      state.invoices = list
    },
    setReceiptsListMatch(state, list) {
      state.receipts = list
    },
    setSelectedReceiptMatch(state, select) {
      state.selectedReceipt = select
    },
    setSelectedInvoceMatch(state, select) {
      state.selectedInvoce = select
    }
  },
  actions: {
    serverReceiptsList({ commit }, {
      businessPartnerUuid,
      formUuid
    }) {
      receipts({
        businessPartnerUuid,
        formUuid
      })
        .then(response => {
          commit('setReceiptsListMatch', response)
        })
        .catch(error => {
          console.warn(`serverReceiptsList: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    serverInvocesList({ commit }, {
      businessPartnerUuid,
      formUuid
    }) {
      invoces({
        businessPartnerUuid,
        formUuid
      })
        .then(response => {
          commit('setInvoiceLisMatch', response)
        })
        .catch(error => {
          console.warn(`serverInvocesList: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    processAssignment({ commit }, {
      businessPartnerUuid,
      receiptUuid,
      invoceUuid,
      formUuid
    }) {
      processReceipt({
        businessPartnerUuid,
        receiptUuid,
        invoceUuid,
        formUuid
      })
        .then(response => {
          showMessage({
            type: 'success',
            message: response.message,
            showClose: true
          })
        })
        .catch(error => {
          console.warn(`processAssignment: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    selectedelectedReceiptsMatch({ commit }, select) {
      commit('setSelectedReceiptMatch', select)
    },
    selectedInvoceMatch({ commit }, select) {
      console.log({ select })
      commit('setSelectedInvoceMatch', select)
    }
  },
  getters: {
    getInvoiceMatch: (state) => {
      return state.invoices
    },
    getReceiptsMatch: (state) => {
      return state.receipts
    },
    getSelectedReceiptsMatch: (state) => {
      return state.selectedReceipt
    },
    getSelectedInvoceMatch: (state) => {
      return state.selectedInvoce
    }
  }
}
