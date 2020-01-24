import Vue from 'vue'
// Delete when get global context and account context
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

const context = {
  state: {
    context: {}
  },
  mutations: {
    /**
     * Set context in state
     * @param {string} payload.parentUuid
     * @param {string} payload.containerUuid
     * @param {string} payload.columnName
     * @param {mixed} payload.value
     */
    setContext(state, payload) {
      let key = ''
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
    setContext({ commit }, objectValue) {
      commit('setContext', objectValue)
    },
    setMultipleContext({ commit }, valuesToSetter) {
      valuesToSetter.forEach(itemToSetter => {
        commit('setContext', itemToSetter)
      })
    },
    setMultipleContextView({ commit }, {
      parentUuid,
      containerUuid,
      values
    }) {
      Object.keys(values).forEach(key => {
        commit('setContext', {
          parentUuid,
          containerUuid,
          columnName: key,
          value: values[key]
        })
      })
    },
    setMultipleContextObject({ commit }, valuesToSetter) {
      Object.keys(valuesToSetter).forEach(key => {
        commit('setContext', {
          columnName: key,
          value: valuesToSetter[key]
        })
      })
    },
    setMultipleContextMap({ commit }, valuesToSetter) {
      return new Promise(resolve => {
        valuesToSetter.forEach((value, key) => {
          commit('setContext', {
            columnName: key,
            value: value
          })
        })
        resolve()
      })
    },
    setInitialContext({ commit }, otherContext = {}) {
      commit('setInitialContext', otherContext)
    }
  },
  getters: {
    /**
     * @param  {string} parentUuid
     * @param  {string} containerUuid
     * @param  {string} columnName
     */
    getContext: (state) => ({ parentUuid, containerUuid, columnName }) => {
      let key = ''

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
    /**
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @returns {object}
     */
    getContextView: (state) => ({
      parentUuid,
      containerUuid
    }) => {
      // generate context with parent uuid or container uuid associated
      const contextAllContainers = {}
      Object.keys(state.context).forEach(key => {
        if (key.includes(parentUuid) || key.includes(containerUuid)) {
          contextAllContainers[key] = state.context[key]
        }
      })

      // generate context only columnName
      const contextContainer = {}
      Object.keys(contextAllContainers).forEach(key => {
        if (isEmptyValue(contextAllContainers[key])) {
          return
        }
        let newKey
        if (parentUuid) {
          if (!key.includes(containerUuid)) {
            newKey = key
              .replace(`${parentUuid}|`, '')
              .replace(`${containerUuid}|`, '')
            // set window parent context
            contextContainer[newKey] = contextAllContainers[key]
          }
          // next if is tab context
          return
        }
        // set container context (smart browser, process/report)
        newKey = key.replace(`${containerUuid}|`, '')
        contextContainer[newKey] = contextAllContainers[key]
      })

      return contextContainer
    },
    getContextAll: (state) => {
      return state.context
    },
    getContextClientId: (state) => {
      return parseInt(state.context['#AD_Client_ID'], 10)
    },
    getContextOrgId: (state) => {
      return parseInt(state.context['#AD_Org_ID'], 10)
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
