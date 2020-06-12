import { createEntity, updateEntity } from '@/api/ADempiere/persistence.js'
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
      valueType,
      value
    }) {
      if (isEmptyValue(state.persistence[containerUuid])) {
        state.persistence[containerUuid] = new Map()
      }
      // Set value
      state.persistence[containerUuid].set(columnName, {
        columnName,
        valueType,
        value
      })
    }
  },
  actions: {
    flushPersistenceQueue({ getters }, {
      containerUuid,
      tableName,
      recordUuid
    }) {
      return new Promise((resolve, reject) => {
        let attributes = getters.getPersistenceAttributes(containerUuid)
        if (attributes) {
          if (recordUuid) {
            // Update existing entity
            updateEntity({
              tableName,
              recordUuid,
              attributes
            })
              .then(response => resolve(response))
              .catch(error => reject(error))
          } else {
            attributes = attributes.filter(itemAttribute => !isEmptyValue(itemAttribute.value))

            // Create new entity
            createEntity({
              tableName,
              attributes
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
