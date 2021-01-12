
import initStateProcessControl from './state.js'

/**
 * Process Mutations
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 */
export default {
  // Add process in execution
  addInExecution(state, payload) {
    state.inExecution.push(payload)
  },
  // Add process in notifation
  addNotificationProcess(state, payload) {
    state.notificationProcess.push(payload)
  },
  // Delete process in execution afther some response from server
  deleteInExecution(state, payload) {
    state.inExecution = state.inExecution.filter(item => item.containerUuid !== payload.containerUuid)
  },
  // Add process in request metadata from server
  addInRequestMetadata(state, payload) {
    state.inRequestMetadata.push(payload)
  },
  // Delete process in request metadata
  deleteInRequestMetadata(state, payload) {
    state.inRequestMetadata = state.inRequestMetadata.filter(item => item !== payload)
  },
  addStartedProcess(state, payload) {
    state.process.push(payload)
  },
  resetStateProcessControl(state) {
    state = initStateProcessControl
  },
  /**
   *
   * @param {object} state
   * @param {boolean} payload, true or false value to change displayed dialog
   */
  setShowDialog(state, payload) {
    state.isVisibleDialog = payload
  },
  setMetadata(state, payload) {
    state.metadata = payload
  },
  setReportValues(state, payload) {
    state.reportObject = payload
    if (state.reportList.some(report => report.instanceUuid === payload.instanceUuid)) {
      const reportIndex = state.reportList.findIndex(report => report.instanceUuid === payload.instanceUuid)
      state.reportList.splice(reportIndex, 1, payload)
    } else {
      state.reportList.push(payload)
    }
  },
  setSessionProcess(state, payload) {
    state.sessionProcess = payload.processList
  },
  changeFormatReport(state, payload) {
    state.reportFormat = payload
  },
  setReportViewsList(state, payload) {
    state.reportViewList.push(payload)
  },
  setTotalResponse(state, payload) {
    state.totalResponse = payload
  },
  setTotalSelection(state, payload) {
    state.totalSelection = payload
  },
  setSuccessSelection(state, payload) {
    state.successSelection = payload
  },
  setErrorSelection(state, payload) {
    state.errorSelection = payload
  },
  setTotalRequest(state, payload) {
    state.totalRequest = payload
  }
}
