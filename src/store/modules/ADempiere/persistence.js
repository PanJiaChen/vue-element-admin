import {
  requestCreateEntity,
  requestUpdateEntity
} from '@/api/ADempiere/common/persistence.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { LOG_COLUMNS_NAME_LIST } from '@/utils/ADempiere/dataUtils.js'
import language from '@/lang'
import { showMessage } from '@/utils/ADempiere/notification.js'

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
        let attributesList = getters.getPersistenceAttributes(containerUuid)
          .filter(itemField => {
            // omit send to server (to create or update) columns manage by backend
            return !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
          })

        if (attributesList) {
          if (recordUuid) {
            // Update existing entity
            requestUpdateEntity({
              tableName,
              recordUuid,
              attributesList
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
            attributesList = attributesList.filter(itemAttribute => !isEmptyValue(itemAttribute.value))

            // Create new entity
            requestCreateEntity({
              tableName,
              attributesList
            })
              .then(response => {
                showMessage({
                  message: language.t('data.createRecordSuccessful'),
                  type: 'success'
                })

                resolve(response)
              })
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
