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
    updateValueOfField(state, payload) {
      //  Only Parent
      if (payload.parentUuid) {
        const keyParent = payload.parentUuid + '_' + payload.columnName
        if (payload.value !== state.field[keyParent]) {
          Vue.set(state.field, keyParent, payload.value)
        }
      }
      //  Only Container
      if (payload.containerUuid) {
        const keyContainer = payload.containerUuid + '_' + payload.columnName
        if (payload.value !== state.field[keyContainer]) {
          Vue.set(state.field, keyContainer, payload.value)
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
    getValueOfField: (state) => ({ containerUuid, columnName }) => {
      return state.field[containerUuid + '_' + columnName]
    },
    getValueOfContainer: (state) => ({ parentUuid, containerUuid, columnName }) => {
      // get in tab level
      let value = state.field[containerUuid + '_' + columnName]
      if (isEmptyValue(value) && parentUuid) {
        // get in window level
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
      format = 'array'
    }) => {
      console.log(parentUuid, containerUuid)
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
        if (isEmptyValue(value)) {
          return
        }
        let columnName
        if (parentUuid) {
          if (!key.includes(containerUuid)) {
            columnName = key
              .replace(`${parentUuid}_`, '')
              .replace(`${containerUuid}_`, '')
            // set window parent context
            objectValues[columnName] = value
          }
          // next if is tab context
          return {
            columnName,
            value
          }
        }
        // set container context (smart browser, process/report, form)
        columnName = key.replace(`${containerUuid}_`, '')
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
