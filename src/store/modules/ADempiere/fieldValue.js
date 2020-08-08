import Vue from 'vue'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertStringToBoolean } from '@/utils/ADempiere/valueFormat.js'

const UUID_KEY = 'UUID'

const value = {
  state: {
    field: {}
  },
  mutations: {
    resetStatevalue(state) {
      state = {
        field: {}
      }
    },
    /**
     *
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * @param {string}  columnName
     * @param {mixed}   value
     * @param {boolean} isOverWriteParent // overwite parent context values
     */
    updateValueOfField(state, {
      parentUuid,
      containerUuid,
      columnName,
      value,
      isOverWriteParent = true
    }) {
      //  Only Parent
      if (parentUuid) {
        const keyParent = parentUuid + '_' + columnName
        const valueParent = state.field[keyParent]
        if (value !== valueParent) {
          if (isOverWriteParent) {
            Vue.set(state.field, keyParent, value)
          } else {
            if (isEmptyValue(value)) {
              // tab child no replace parent context with empty
              Vue.set(state.field, keyParent, value)
            }
          }
        }
      }
      //  Only Container
      if (containerUuid) {
        const keyContainer = containerUuid + '_' + columnName
        if (value !== state.field[keyContainer]) {
          Vue.set(state.field, keyContainer, value)
        }
      }
    },
    updateValuesOfContainer(state, payload) {
      payload.attributes.forEach(attribute => {
        const { value, columnName } = attribute

        //  Only Parent
        if (payload.parentUuid) {
          const keyParent = payload.parentUuid + '_' + columnName
          if (value !== state.field[keyParent]) {
            Vue.set(state.field, keyParent, value)
          }
        }
        //  Only Container
        if (payload.containerUuid) {
          const keyContainer = payload.containerUuid + '_' + columnName
          if (value !== state.field[keyContainer]) {
            Vue.set(state.field, keyContainer, value)
          }
        }
      })
    }
  },
  actions: {
    updateValuesOfContainer({ commit }, {
      parentUuid,
      containerUuid,
      attributes = []
    }) {
      commit('updateValuesOfContainer', {
        parentUuid,
        containerUuid,
        attributes
      })
    }
  },
  getters: {
    getValueOfField: (state) => ({
      parentUuid,
      containerUuid,
      columnName
    }) => {
      let key = ''
      let value
      if (containerUuid) {
        // get in tab level
        key += containerUuid + '_'
      }
      key += columnName
      value = state.field[key]

      if (parentUuid && isEmptyValue(value)) {
        // get in window level
        key = parentUuid + '_' + columnName
        value = state.field[parentUuid + '_' + columnName]
      }

      return value
    },
    /**
     * Get values and column's name as key (without parent uuid or container
     * uuid), from a view (container)
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @returns {object|array}
     */
    getValuesView: (state) => ({
      parentUuid,
      containerUuid,
      isOnlyColumns = true,
      format = 'array'
    }) => {
      // generate context with parent uuid or container uuid associated
      const contextAllContainers = {}
      Object.keys(state.field).forEach(key => {
        if (key.includes(parentUuid) || key.includes(containerUuid)) {
          contextAllContainers[key] = state.field[key]
        }
      })

      // generate context only columnName
      const objectValues = {}
      const pairsValues = Object.keys(contextAllContainers).map(key => {
        const value = contextAllContainers[key]
        if (isOnlyColumns) {
          key = key
            .replace(`${parentUuid}_`, '')
            .replace(`${containerUuid}_`, '')
        }
        // TODO: Verify if overwrite key with empty value
        const columnName = key

        // set container context (smart browser, process/report, form)
        objectValues[columnName] = value
        return {
          columnName,
          value
        }
      })

      if (format === 'array') {
        return pairsValues
      }
      return objectValues
    },
    getUuidOfContainer: (state) => (containerUuid) => {
      return state.field[containerUuid + '_' + UUID_KEY]
    },
    // Using to read only in data tables in Window
    getContainerIsActive: (state) => (parentUuid) => {
      const valueIsActive = state.field[`${parentUuid}_IsActive`]

      return convertStringToBoolean(valueIsActive)
    },
    getContainerProcessing: (state) => (parentUuid) => {
      const valueProcessing = state.field[`${parentUuid}_Processing`]

      return convertStringToBoolean(valueProcessing)
    },
    getContainerProcessed: (state) => (parentUuid) => {
      const valueProcessed = state.field[`${parentUuid}_Processed`]

      return convertStringToBoolean(valueProcessed)
    }
  }
}

export default value
