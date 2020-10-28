import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'

const initStateBusinessData = {
  recordSelection: [], // record data and selection
  contextInfoField: [],
  recordPrivateAccess: {}
}

const data = {
  state: initStateBusinessData,
  mutations: {
    ...mutations,
    resetStateBusinessData(state) {
      state = initStateBusinessData
    }
  },
  actions,
  getters
}

export default data
