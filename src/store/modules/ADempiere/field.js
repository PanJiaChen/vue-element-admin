import { getField as getFieldFromDictionary } from '@/api/ADempiere/dictionary'

const initStateLookup = {
  referenceList: [],
  fieldList: [],
  validationRuleList: [],
  fieldListLocation: [],
  isShowedLocation: false
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
    },
    setShowedLocation(state, isShowed) {
      state.isShowedLocation = isShowed
    },
    setfieldListLocation(state, fieldListLocation) {
      state.fieldListLocation = fieldListLocation
    }
  },
  actions: {
    // Get Reference from Server based on criteria
    getFieldFromServer({ commit }, {
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

          commit('addField', fieldResponse)

          return fieldResponse
        })
        .catch(error => {
          console.warn(`Get Field - Error ${error.code}: ${error.message}.`)
        })
    },
    changeSequence({ commit }, params) {
      commit('setfieldListLocation', params)
    }
  },
  getters: {
    getIsShowedLocation: (state) => {
      return state.isShowedLocation
    },
    getFieldFromUuid: (state) => (uuid) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.uuid === uuid
      })
    },
    getFieldFromColumnUuid: (state) => (columnUuid) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.columnUuid === columnUuid
      })
    },
    getFieldFromElementUuid: (state) => (elementUuid) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.elementUuid === elementUuid
      })
    },
    getFieldFromElementColumnName: (state) => (elementColumnName) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.elementColumnName === elementColumnName
      })
    },
    getFieldFromTableNameAndColumnName: (state) => ({
      tableName,
      columnName
    }) => {
      return state.fieldList.find(fieldItem => {
        return fieldItem.tableName === tableName && fieldItem.columnName === columnName
      })
    },
    getFieldLocation: (state) => {
      return state.fieldListLocation
    }
  }
}

export default field
