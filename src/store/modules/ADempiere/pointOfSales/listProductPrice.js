import Vue from 'vue'
import {
  requestListProductPrice
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue, extractPagingToken } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

const listProductPrice = {
  state: {
    productPrice: {
      ...withoutResponse,
      isShowPopoverField: false, // with field
      isShowPopoverMenu: false // with menu
    },
    searchProduct: ''
  },
  mutations: {
    setListProductPrice(state, productsPrices) {
      state.productPrice = {
        ...state.productPrice,
        ...productsPrices
      }
    },
    setProductPicePageNumber(state, pageNumber) {
      state.productPrice.pageNumber = pageNumber
    },
    showListProductPrice(state, payload) {
      Vue.set(state.productPrice, payload.attribute, payload.isShowed)
    },
    setIsReloadProductPrice(state) {
      Vue.set(state.productPrice, 'isReload', true)
      Vue.set(state.productPrice, 'isLoaded', false)
    },
    updtaeSearchProduct(state, searchProduct) {
      state.searchProduct = searchProduct
    }
  },
  actions: {
    setProductPicePageNumber({ commit }, pageNumber) {
      commit('setProductPicePageNumber', pageNumber)
      commit('setIsReloadProductPrice')

      // Not reload, watch in component to reload
      // dispatch('listProductPriceFromServer', {})
    },
    listProductPriceFromServer({ state, commit, rootGetters }, {
      containerUuid = 'Products-Price-List',
      pageNumber, // 1
      searchValue
    }) {
      const posUuid = rootGetters.getPointOfSalesUuid
      if (isEmptyValue(posUuid)) {
        const message = language.t('notifications.errorPointOfSale')
        showMessage({
          type: 'info',
          message
        })
        console.warn(message)
        return
      }
      commit('setIsReloadProductPrice')
      let pageToken, token
      if (isEmptyValue(pageNumber)) {
        pageNumber = state.productPrice.pageNumber
        if (isEmptyValue(pageNumber)) {
          pageNumber = 1
        }

        token = state.productPrice.token
        if (!isEmptyValue(token)) {
          pageToken = token + '-' + pageNumber
        }
      }

      const { priceList, templateBusinessPartner } = rootGetters.getCurrentPOS
      const { uuid: businessPartnerUuid } = templateBusinessPartner
      const { uuid: priceListUuid } = priceList
      const { uuid: warehouseUuid } = rootGetters['user/getWarehouse']

      if (isEmptyValue(searchValue)) {
        searchValue = rootGetters.getValueOfField({
          containerUuid,
          columnName: 'ProductValue'
        })
      }
      return new Promise(resolve => {
        requestListProductPrice({
          searchValue,
          priceListUuid,
          businessPartnerUuid,
          warehouseUuid,
          pageToken
        }).then(responseProductPrice => {
          if (isEmptyValue(token) || isEmptyValue(pageToken)) {
            token = extractPagingToken(responseProductPrice.nextPageToken)
          }

          commit('setListProductPrice', {
            ...responseProductPrice,
            isLoaded: true,
            isReload: false,
            businessPartnerUuid,
            warehouseUuid,
            token,
            pageNumber
          })

          resolve(responseProductPrice)
        }).catch(error => {
          console.warn(`getKeyLayoutFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
      })
    },
    listProductPriceFromServerProductInfo({ state, commit, rootGetters }, {
      containerUuid = 'Products-Price-List-ProductInfo',
      pageNumber, // 1
      searchValue
    }) {
      const posUuid = rootGetters.getPointOfSalesUuid
      if (isEmptyValue(posUuid)) {
        const message = 'Sin punto de venta seleccionado'
        showMessage({
          type: 'info',
          message
        })
        console.warn(message)
        return
      }
      commit('setIsReloadProductPrice')
      let pageToken, token
      if (isEmptyValue(pageNumber)) {
        pageNumber = state.productPrice.pageNumber
        if (isEmptyValue(pageNumber)) {
          pageNumber = 1
        }

        token = state.productPrice.token
        if (!isEmptyValue(token)) {
          pageToken = token + '-' + pageNumber
        }
      }

      const { priceList, templateBusinessPartner } = rootGetters.getCurrentPOS
      const { uuid: businessPartnerUuid } = templateBusinessPartner
      const { uuid: priceListUuid } = priceList
      const { uuid: warehouseUuid } = rootGetters['user/getWarehouse']

      if (isEmptyValue(searchValue)) {
        searchValue = rootGetters.getValueOfField({
          containerUuid,
          columnName: 'ProductValue'
        })
      }
      return new Promise(resolve => {
        requestListProductPrice({
          searchValue,
          priceListUuid,
          businessPartnerUuid,
          warehouseUuid,
          pageToken
        }).then(responseProductPrice => {
          if (isEmptyValue(token) || isEmptyValue(pageToken)) {
            token = extractPagingToken(responseProductPrice.nextPageToken)
          }

          commit('setListProductPrice', {
            ...responseProductPrice,
            isLoaded: true,
            isReload: false,
            businessPartnerUuid,
            warehouseUuid,
            token,
            pageNumber
          })

          resolve(responseProductPrice)
        }).catch(error => {
          console.warn(`getKeyLayoutFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
      })
    },
    updateSearch({ commit }, newValue) {
      commit('updtaeSearchProduct', newValue)
    }
  },
  getters: {
    getProductPrice: (state) => {
      if (isEmptyValue(state.productPrice) || !state.productPrice.isLoaded) {
        return {
          ...withoutResponse,
          productPricesList: []
        }
      }
      return state.productPrice
    },
    getSearchProduct: (state) => {
      return state.searchProduct
    }
  }
}

export default listProductPrice
