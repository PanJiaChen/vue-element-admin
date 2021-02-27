import initStateWindowControl from './state.js'

/**
 * Window Control Vuex Module
 * Muttations to commit state
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 */
export default {
  setCurrentRecord(state, payload) {
    state.currentRecord = payload
  },

  addInCreate(state, payload) {
    state.inCreate.push(payload)
  },

  deleteInCreate(state, payload) {
    state.inCreate = state.inCreate.filter(item => item.containerUuid !== payload.containerUuid)
  },

  addReferencesList(state, payload) {
    state.references.push(payload)
  },

  setDataLog(state, payload) {
    state.dataLog = payload
  },

  setWindowOldRoute(state, payload) {
    state.windowOldRoute = payload
  },

  setTabSequenceRecord(state, payload) {
    state.tabSequenceRecord = payload
  },

  setTotalResponse(state, payload) {
    state.totalResponse = payload
  },

  setTotalRequest(state, payload) {
    state.totalRequest = payload
  },

  resetStateWindowControl(state) {
    state = initStateWindowControl
  }
}
