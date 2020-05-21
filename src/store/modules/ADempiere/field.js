import { getField as getFieldFromDictionary } from '@/api/ADempiere/dictionary'

const initStateLookup = {
  referenceList: [],
  fieldList: [],
  validationRuleList: []
}

const field = {
  state: initStateLookup,
  mutations: {
    addField(state, payload) {
      state.fieldList.push(payload)
    },
    addReference(state, payload) {
      state.referenceList.push(payload)
    },
    addValidationRule(state, payload) {
      state.validationRuleList.push(payload)
    },
    resetStateLookup(state) {
      state = initStateLookup
    }
  },
  actions: {
    // Get Reference from Server based on criteria
    getFieldFromServer({ commit, rootGetters }, {
      fieldUuid,
      columnUuid,
      elementUuid,
      tableName,
      columnName,
      elementColumnName
    }) {
      return getFieldFromDictionary({
        fieldUuid,
        columnUuid,
        elementUuid,
        // TableName + ColumnName
        tableName,
        columnName,
        elementColumnName
      })
        .then(fieldResponse => {
          if (columnUuid) {
            fieldResponse.columnUuid = columnUuid
          } else if (elementUuid) {
            fieldResponse.elementUuid = elementUuid
          } else if (elementColumnName) {
            fieldResponse.elementColumnName = elementColumnName
          } else if (tableName && columnName) {
            fieldResponse.tableName = tableName
            fieldResponse.columnName = columnName
          }
          commit('addField', {
            fieldResponse
          })
          return fieldResponse
        })
        .catch(error => {
          console.warn(`Get Field, Select Base - Error ${error.code}: ${error.message}.`)
        })
    }
  },
  getters: {
    getFieldFromUuid: (state) => (uuid) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.fieldResponse.uuid === uuid
      })
    },
    getFieldFromColumnUuid: (state) => (columnUuid) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.fieldResponse.columnUuid === columnUuid
      })
    },
    getFieldFromElementUuid: (state) => (elementUuid) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.fieldResponse.elementUuid === elementUuid
      })
    },
    getFieldFromElementColumnName: (state) => (elementColumnName) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.fieldResponse.elementColumnName === elementColumnName
      })
    },
    getFieldFromTableNameAndColumnName: (state) => ({
      tableName,
      columnName
    }) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.fieldResponse.tableName === tableName && fieldItem.fieldResponse.columnName === columnName
      })
    }
  }
}

export default field
