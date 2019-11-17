import Vue from 'vue'
// Delete when get global context and account context
import { isEmptyValue } from '@/utils/ADempiere/valueUtil.js'

const context = {
  state: {
    context: {}
  },
  mutations: {
    setContext(state, payload) {
      var key = ''
      if (payload.parentUuid && !isEmptyValue(payload.value)) {
        key += payload.parentUuid + '|'

        // set context for window
        const keyParent = key + payload.columnName
        Vue.set(state.context, keyParent, payload.value)
      }
      if (payload.containerUuid) {
        key += payload.containerUuid + '|'
      }
      key += payload.columnName
      // set property to object
      Vue.set(state.context, key, payload.value)
    },
    setInitialContext(state, objectContext) {
      Object.keys(objectContext).forEach(key => {
        Vue.set(state.context, key, objectContext[key])
      })
    },
    dictionaryResetCacheContext(state) {
      state.context = {}
    }
  },
  actions: {
    setContext: ({ commit }, objectValue) => {
      commit('setContext', objectValue)
    },
    setMultipleContext: ({ commit }, valuesToSetter) => {
      valuesToSetter.forEach(itemToSetter => {
        commit('setContext', itemToSetter)
      })
    },
    setInitialContext: ({ commit }, otherContext = {}) => {
      commit('setInitialContext', otherContext)
    }
  },
  getters: {
    /**
     * @param  {object} findedContext
     *  - parentUuid
     *  - containerUuid
     *  - columnName
     */
    getContext: (state) => ({ parentUuid, containerUuid, columnName }) => {
      var key = ''

      if (parentUuid) {
        key += parentUuid + '|'

        // context for window
        const keyParent = key + columnName
        const valueParent = state.context[keyParent]
        if (!isEmptyValue(valueParent)) {
          return valueParent
        }
      }
      if (containerUuid) {
        key += containerUuid + '|'
      }
      key += columnName

      return state.context[key]
    },
    getContextAll: (state) => {
      state.context
    },
    getContextClientId: (state) => {
      return state.context['#AD_Client_ID']
    },
    getContextOrgId: (state) => {
      return state.context['#AD_Org_ID']
    },
    // Using to read only in data tables
    getContextIsActive: (state) => (parentUuid) => {
      return state.context[`${parentUuid}|IsActive`]
    },
    getContextProcessing: (state) => (parentUuid) => {
      return state.context[`${parentUuid}|Processing`]
    },
    getContextProcessed: (state) => (parentUuid) => {
      return state.context[`${parentUuid}|Processed`]
    }
  }
}

export default context
