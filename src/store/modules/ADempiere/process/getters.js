/**
 * Process Getters
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 */
export default {
  /**
   * Running processes that have not received a response from the server
   * @param {string} containerUuid
   */
  getInExecution: (state) => (containerUuid) => {
    return state.inExecution.find(item => item.containerUuid === containerUuid)
  },
  /**
   * Process for send to server, or send without response
   */
  getAllInExecution: (state) => {
    return state.inExecution
  },
  /**
   * Process send to server, with response from server
   */
  getAllFinishProcess: (state) => {
    return state.process
  },
  getNotificationProcess: (state) => {
    return state.notificationProcess
  },

  getProcessResult: (state) => {
    return state.reportObject
  },
  getCachedReport: (state) => (instanceUuid) => {
    return state.reportList.find(
      item => item.instanceUuid === instanceUuid
    )
  }
}
