import {
  requestCreateEntity,
  requestUpdateEntity
} from '@/api/ADempiere/persistence.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

const persistence = {
  state: {
    persistence: {}
  },
  mutations: {
    resetStatepersistence(state) {
      state = {
        persistence: {}
      }
    },
    addChangeToPersistenceQueue(state, {
      containerUuid,
      columnName,
      // valueType,
      value
    }) {
      if (isEmptyValue(state.persistence[containerUuid])) {
        state.persistence[containerUuid] = new Map()
      }
      // Set value
      state.persistence[containerUuid].set(columnName, {
        columnName: columnName,
        // valueType,
        value
      })
    }
  },
  actions: {
    flushPersistenceQueue({ getters, dispatch }, {
      containerUuid,
      tableName,
      recordUuid
    }) {
      return new Promise((resolve, reject) => {
        let attributes = getters.getPersistenceAttributes(containerUuid)
        if (attributes) {
          if (recordUuid) {
            // Update existing entity
            requestUpdateEntity({
              tableName,
              recordUuid,
              attributesList: attributes
            })
              .then(response => {
                dispatch('listRecordLogs', {
                  tableName: response.tableName,
                  recordId: response.id,
                  recordUuid: response.uuid
                })
                resolve(response)
              })
              .catch(error => reject(error))
          } else {
            attributes = attributes.filter(itemAttribute => !isEmptyValue(itemAttribute.value))

            // Create new entity
            requestCreateEntity({
              tableName,
              attributesList: attributes
            })
              .then(response => resolve(response))
              .catch(error => reject(error))
          }
        }
      })
    }
  },
  getters: {
    getPersistenceMap: (state) => (tableName) => {
      return state.persistence[tableName]
    },
    getPersistenceAttributes: (state) => (containerUuid) => {
      const attributesMap = state.persistence[containerUuid]
      if (!isEmptyValue(attributesMap)) {
        return [
          ...attributesMap.values()
        ]
      }
      return undefined
    }
  }
}

export default persistence
