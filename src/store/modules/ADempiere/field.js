import { requestFieldMetadata } from '@/api/ADempiere/dictionary/window'

const initStateLookup = {
  referenceList: [],
  fieldsList: [],
  validationRuleList: [],
  fieldsListLocation: [],
  isShowedLocation: false
}

const field = {
  state: initStateLookup,
  mutations: {
    addField(state, payload) {
      state.fieldsList.push(payload)
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
    setFieldsListLocation(state, fieldsListLocation) {
      state.fieldsListLocation = fieldsListLocation
    }
  },
  actions: {
    // Get Reference from Server based on criteria
    getFieldFromServer({ commit }, {
      uuid,
      columnUuid,
      elementUuid,
      tableName,
      columnName,
      elementColumnName
    }) {
      return requestFieldMetadata({
        uuid,
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
      commit('setFieldsListLocation', params)
    }
  },
  getters: {
    getIsShowedLocation: (state) => {
      return state.isShowedLocation
    },
    getFieldFromUuid: (state) => (uuid) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.uuid === uuid
      })
    },
    getFieldFromColumnUuid: (state) => (columnUuid) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.columnUuid === columnUuid
      })
    },
    getFieldFromElementUuid: (state) => (elementUuid) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.elementUuid === elementUuid
      })
    },
    getFieldFromElementColumnName: (state) => (elementColumnName) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.elementColumnName === elementColumnName
      })
    },
    getFieldFromTableNameAndColumnName: (state) => ({
      tableName,
      columnName
    }) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.tableName === tableName && fieldItem.columnName === columnName
      })
    },
    getFieldLocation: (state) => {
      return state.fieldsListLocation
    }
  }
}

export default field
