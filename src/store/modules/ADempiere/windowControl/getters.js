/**
 * Vuex Module, Window Control
 * Getters
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 */
export default {
  getCurrentRecord: (state) => {
    return state.currentRecord
  },

  getInCreate: (state) => (containerUuid) => {
    return state.inCreate.find(item => item.containerUuid === containerUuid)
  },

  getReferencesList: (state) => (windowUuid, recordUuid) => {
    return state.references.find(item => item.windowUuid === windowUuid && item.recordUuid === recordUuid)
  },

  getReferencesInfo: (state, getters) => ({ windowUuid, recordUuid, referenceUuid }) => {
    const references = getters.getReferencesList(windowUuid, recordUuid)
    return references.referencesList.find(item => item.uuid === referenceUuid)
  },

  getTabSequenceRecord: (state) => {
    return state.tabSequenceRecord
  },

  getDataLog: (state) => (containerUuid, recordUuid) => {
    const current = state.dataLog
    if (current.containerUuid === containerUuid &&
      ((current.recordUuid === recordUuid) ||
      (current.eventType === 'DELETE' && recordUuid === 'create-new'))) {
      return current
    }
    return undefined
  }
}
