import Vue from 'vue'
import {
  getKeyLayout
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

const keyLayout = {
  state: {
    keyLayout: {}
  },
  mutations: {
    setKeyLayout(state, keyLayout) {
      Vue.set(state, 'keyLayout', keyLayout)
    },
    setIsReloadKeyLayout(state) {
      Vue.set(state.keyLayout, 'isReload', true)
      Vue.set(state.keyLayout, 'isLoaded', false)
    }
  },
  actions: {
    getKeyLayoutFromServer({ commit, getters }, keyLayoutUuid) {
      if (isEmptyValue(keyLayoutUuid)) {
        keyLayoutUuid = getters.getKeyLayoutUuidWithPOS
      }

      if (isEmptyValue(keyLayoutUuid)) {
        console.info('not load key layout')
        return
      }
      getKeyLayout({
        keyLayoutUuid
      })
        .then(responseKeyLayout => {
          commit('setKeyLayout', {
            ...responseKeyLayout,
            isLoaded: true,
            isReload: false
            // token,
            // pageNumber
          })
        })
        .catch(error => {
          console.warn(`getKeyLayoutFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }
  },
  getters: {
    // current pos uuid
    getKeyLayoutUuidWithPOS: (state, getters) => {
      const currentPOS = getters.getCurrentPOS
      if (isEmptyValue(currentPOS)) {
        return undefined
      }
      return currentPOS.keyLayoutUuid
    },
    getKeyLayout: (state) => {
      if (isEmptyValue(state.keyLayout)) {
        return {
          ...withoutResponse,
          uuid: undefined,
          ordersList: []
        }
      }
      return state.keyLayout
    }
  }
}

export default keyLayout
