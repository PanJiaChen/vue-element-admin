
/**
 * Window Control Vuex Module
 * State (or initial state) from Window Control
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 */
export default {
  inCreate: [],
  references: [],
  currentRecord: {},
  windowOldRoute: {
    path: '',
    fullPath: '',
    query: {}
  },
  dataLog: {}, // { containerUuid, recordId, tableName, eventType }
  tabSequenceRecord: [],
  totalResponse: 0,
  totalRequest: 0
}
