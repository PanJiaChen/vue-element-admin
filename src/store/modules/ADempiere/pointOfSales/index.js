import Vue from 'vue'
import router from '@/router'
import {
  requestListPointOfSales
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

const pointOfSales = {
  state: {
    showPOSOptions: false,
    showPOSKeyLayout: false,
    showPOSCollection: false,
    pointOfSales: {
      ...withoutResponse
    }
  },
  mutations: {
    resetStatePointOfSales(state) {
      state = {}
    },
    setPontOfSales(state, pos) {
      state.pointOfSales = pos
    },
    setCurrentPOS(state, pos) {
      Vue.set(state.pointOfSales, 'currentPOS', pos)
    },
    setShowPOSOptions(state, isShowedOptions) {
      state.showPOSOptions = isShowedOptions
    },
    setShowPOSKeyLayout(state, isShowedKeyLayout) {
      state.showPOSKeyLayout = isShowedKeyLayout
    },
    setShowPOSCollection(state, isShowedCollection) {
      state.showPOSCollection = isShowedCollection
    }
  },
  actions: {
    /**
     * List point of sales terminal
     * @param {number} posToSet id to set
     */
    listPointOfSalesFromServer({ commit, getters, dispatch }, posToSet = null) {
      const userUuid = getters['user/getUserUuid']

      requestListPointOfSales({
        userUuid
      })
        .then(response => {
          // TODO: Add organization
          commit('setPontOfSales', {
            ...response,
            userUuid
          })

          const posList = response.sellingPointsList
          const getterPos = getters.getPointOfSalesUuid
          let pos
          if (!isEmptyValue(posList)) {
            if (!isEmptyValue(getterPos)) {
              pos = posList.find(itemPOS => itemPOS.uuid === getterPos)
            }

            // match with route.query.pos
            if (isEmptyValue(pos) && !isEmptyValue(posToSet)) {
              pos = posList.find(itemPOS => itemPOS.id === posToSet)
            }

            // set first element in array list
            if (isEmptyValue(pos)) {
              pos = posList[0]
            }
          }
          if (isEmptyValue(pos)) {
            pos = {
              uuid: undefined
            }
          }
          if (pos.uuid !== getterPos) {
            dispatch('setCurrentPOS', pos)
          }
        })
        .catch(error => {
          console.warn(`listPointOfSalesFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    setCurrentPOS({ commit, dispatch }, posToSet) {
      commit('setCurrentPOS', posToSet)

      const oldRoute = router.app._route
      router.push({
        name: oldRoute.name,
        params: {
          ...oldRoute.params
        },
        query: {
          ...oldRoute.query,
          pos: posToSet.id
        }
      }, () => {})

      commit('setIsReloadKeyLayout')
      commit('setIsReloadProductPrice')
      commit('setIsReloadListOrders')
      commit('setShowPOSKeyLayout', false)
      dispatch('deleteAllCollectBox')
    }
  },
  getters: {
    getPointOfSales: (state) => {
      if (isEmptyValue(state.pointOfSales)) {
        return {
          ...withoutResponse,
          sellingPointsList: []
        }
      }
      return state.pointOfSales
    },
    // current pos uuid
    getPointOfSalesUuid: (state, getters) => {
      const currentPOS = getters.getCurrentPOS
      if (isEmptyValue(currentPOS)) {
        return undefined
      }
      return currentPOS.uuid
    },
    // current pos info
    getCurrentPOS: (state) => {
      if (isEmptyValue(state.pointOfSales)) {
        return undefined
      }
      return state.pointOfSales.currentPOS
    },
    getSellingPointsList: (state, getters) => {
      return getters.getPointOfSales.sellingPointsList
    },
    getIsShowPOSOptions: (state) => {
      return state.showPOSOptions
    },
    getShowPOSKeyLayout: (state) => {
      return state.showPOSKeyLayout
    },
    getShowCollectionPos: (state) => {
      return state.showPOSCollection
    }
  }
}

export default pointOfSales