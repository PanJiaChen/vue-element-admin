const initStateUtils = {
  listRecordAcces: [],
  attribute: {}
}

export default {
  state: initStateUtils,
  mutations: {
    setListRecordAcces(state, listRecordAcces) {
      state.listRecordAcces = listRecordAcces
    },
    setAttribute(state, attribute) {
      state.attribute = attribute
    }
  },
  actions: {
    changeList({ commit, state }, listRecord) {
      const recordAccess = {
        recordId: state.attribute.recordId,
        recordUuid: state.attribute.recordUuid,
        tableName: state.attribute.tableName,
        listRecord
      }
      commit('setListRecordAcces', recordAccess)
    },
    addAttribute({ commit }, params) {
      commit('setAttribute', params)
    }
  },
  getters: {
    getListRecordAcces: (state) => {
      return state.listRecordAcces
    },
    getAttribute: (state) => {
      return state.attribute
    }
  }
}
