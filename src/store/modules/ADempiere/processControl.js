import {
  runProcess,
  requestListProcessesLogs
} from '@/api/ADempiere/data'
import { showNotification } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import language from '@/lang'
import router from '@/router'
import { getToken } from '@/utils/auth'

const initStateProcessControl = {
  inExecution: [], // process not response from server
  isVisibleDialog: false,
  reportObject: {},
  reportList: [],
  metadata: {},
  process: [], // process to run finish
  sessionProcess: [],
  notificationProcess: [],
  inRequestMetadata: [],
  reportViewList: [],
  totalResponse: 0,
  totalRequest: 0,
  totalSelection: 0,
  errorSelection: 0,
  successSelection: 0
}

const processControl = {
  state: initStateProcessControl,
  mutations: {
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
  },
  actions: {
    // Supported Actions for it
    startProcess({ commit, state, dispatch, getters, rootGetters }, {
      parentUuid,
      containerUuid,
      panelType,
      action,
      parametersList,
      reportFormat,
      isProcessTableSelection,
      isActionDocument,
      tableNameUuidSelection,
      recordUuidSelection,
      menuParentUuid,
      routeToDelete
    }) {
      return new Promise((resolve, reject) => {
        // TODO: Add support to evaluate parameters list to send
        // const samePocessInExecution = getters.getInExecution(containerUuid)
        // exists some call to executed process with container uuid
        // if (samePocessInExecution && !isProcessTableSelection) {
        //   return reject({
        //     error: 0,
        //     message: `In this process (${samePocessInExecution.name}) there is already an execution in progress.`
        //   })
        // }

        // additional attributes to send server, selection to browser, or table name and record id to window
        let selection = []
        let allData = {}
        let tab, tableName, recordId
        if (panelType) {
          if (panelType === 'browser') {
            allData = getters.getDataRecordAndSelection(containerUuid)
            selection = rootGetters.getSelectionToServer({
              containerUuid,
              selection: allData.selection
            })
            if (selection.length < 1) {
              showNotification({
                title: language.t('data.selectionRequired'),
                type: 'warning'
              })
              return reject({
                error: 0,
                message: `Required selection data record to run this process (${action.name})`
              })
            }
          }
          if (panelType === 'window') {
            const contextMenu = getters.getRecordUuidMenu
            tab = rootGetters.getTab(parentUuid, containerUuid)
            if (isProcessTableSelection) {
              tableName = tableNameUuidSelection
              recordId = recordUuidSelection
            } else {
              if (contextMenu.processTable) {
                tableName = contextMenu.tableName
                recordId = contextMenu.valueRecord
              } else {
                tableName = tab.tableName
                const field = rootGetters.getFieldFromColumnName({
                  containerUuid,
                  columnName: `${tableName}_ID`
                })
                recordId = field.value
              }
            }
          }
        }
        // get info metadata process
        const processDefinition = !isEmptyValue(isActionDocument) ? action : rootGetters.getProcess(action.uuid)
        let reportType = reportFormat
        const finalParameters = rootGetters.getParametersToServer({ containerUuid: processDefinition.uuid })

        const isSession = !isEmptyValue(getToken())
        let procesingMessage = {
          close: () => false
        }
        if (isSession) {
          procesingMessage = showNotification({
            title: language.t('notifications.processing'),
            message: processDefinition.name,
            summary: processDefinition.description,
            type: 'info'
          })
        }
        const timeInitialized = (new Date()).getTime()
        let processResult = {
          // panel attributes from where it was executed
          parentUuid,
          containerUuid,
          panelType,
          lastRun: timeInitialized,
          parametersList,
          logs: [],
          isError: false,
          isProcessing: true,
          summary: '',
          resultTableName: '',
          output: {
            uuid: '',
            name: '',
            description: '',
            fileName: '',
            output: '',
            outputStream: '',
            reportType: ''
          }
        }
        if (!isEmptyValue(isActionDocument)) {
          processResult = {
            ...processResult,
            processUuid: action.uuid,
            processId: action.id,
            processName: 'Procesar Orden',
            parameters: parametersList
          }
        } else {
          // Run process on server and wait for it for notify
          // uuid of process
          processResult = {
            ...processResult,
            menuParentUuid,
            processIdPath: routeToDelete.path,
            printFormatUuid: action.printFormatUuid,
            // process attributes
            action: processDefinition.name,
            name: processDefinition.name,
            description: processDefinition.description,
            instanceUuid: '',
            processUuid: processDefinition.uuid,
            processId: processDefinition.id,
            processName: processDefinition.processName,
            parameters: finalParameters,
            isReport: processDefinition.isReport
          }
        }
        commit('addInExecution', processResult)
        if (panelType === 'window') {
          reportType = 'pdf'
        } else if (panelType === 'browser') {
          if (allData.record.length <= 100) {
            // close view if is browser.
            router.push({ path: '/dashboard' })
            dispatch('tagsView/delView', routeToDelete)
            // delete data associate to browser
            dispatch('deleteRecordContainer', {
              viewUuid: containerUuid
            })
          }
        } else {
          // close view if is process, report.
          router.push({ path: '/dashboard' })
          dispatch('tagsView/delView', routeToDelete)

          // reset panel and set defalt isShowedFromUser
          if (!processDefinition.isReport) {
            dispatch('resetPanelToNew', {
              containerUuid,
              panelType
            })
          }
        }
        if (isProcessTableSelection) {
          const windowSelectionProcess = getters.getProcessSelect
          windowSelectionProcess.selection.forEach(selection => {
            Object.assign(processResult, {
              selection: selection.UUID,
              record: selection[windowSelectionProcess.tableName]
            })
            const countRequest = state.totalRequest + 1
            commit('setTotalRequest', countRequest)
            if (!windowSelectionProcess.finish) {
              runProcess({
                uuid: processDefinition.uuid,
                id: processDefinition.id,
                reportType,
                parametersList: isEmptyValue(finalParameters) ? parametersList : finalParameters,
                selectionsList: selection,
                tableName: windowSelectionProcess.tableName,
                recordId: selection[windowSelectionProcess.tableName]
              })
                .then(runProcessResponse => {
                  const { instanceUuid, output } = runProcessResponse
                  let logList = []
                  if (runProcessResponse.logsList) {
                    logList = runProcessResponse.logsList
                  }

                  let link = {
                    href: undefined,
                    download: undefined
                  }
                  if (processDefinition.isReport) {
                    const blob = new Blob(
                      [output.outputStream],
                      { type: output.mimeType }
                    )
                    link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = output.fileName
                    if (reportType !== 'pdf' && reportType !== 'html') {
                      link.click()
                    }

                    // Report views List to context menu
                    const reportViewList = {
                      name: language.t('views.reportView'),
                      type: 'summary',
                      action: '',
                      childs: [],
                      option: 'reportView'
                    }
                    reportViewList.childs = getters.getReportViewList(processResult.processUuid)
                    if (reportViewList && isEmptyValue(reportViewList.childs)) {
                      dispatch('requestReportViews', {
                        processUuid: processResult.processUuid,
                        instanceUuid,
                        processId: processDefinition.id,
                        tableName: output.tableName,
                        printFormatUuid: output.printFormatUuid,
                        reportViewUuid: output.reportViewUuid
                      })
                        .then(responseReportView => {
                          reportViewList.childs = responseReportView
                          if (reportViewList.childs.length) {
                            // Get contextMenu metadata and concat print report views with contextMenu actions
                            const contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                            contextMenuMetadata.actions.push(reportViewList)
                          }
                        })
                    }

                    // Print formats to context menu
                    const printFormatList = {
                      name: language.t('views.printFormat'),
                      type: 'summary',
                      action: '',
                      childs: [],
                      option: 'printFormat'
                    }
                    printFormatList.childs = rootGetters.getPrintFormatList(processResult.processUuid)
                    if (printFormatList && isEmptyValue(printFormatList.childs.length)) {
                      dispatch('requestPrintFormats', {
                        processUuid: processResult.processUuid,
                        instanceUuid,
                        processId: processDefinition.id,
                        tableName: output.tableName,
                        printFormatUuid: output.printFormatUuid,
                        reportViewUuid: output.reportViewUuid
                      })
                        .then(printFormarResponse => {
                          printFormatList.childs = printFormarResponse
                          if (printFormatList.childs.length) {
                            // Get contextMenu metadata and concat print Format List with contextMenu actions
                            const contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                            contextMenuMetadata.actions.push(printFormatList)
                          }
                        })
                    }

                    // Drill Tables to context menu
                    const drillTablesList = {
                      name: language.t('views.drillTable'),
                      type: 'summary',
                      action: '',
                      childs: [],
                      option: 'drillTable'
                    }
                    if (!isEmptyValue(output.tableName)) {
                      drillTablesList.childs = rootGetters.getDrillTablesList(processResult.processUuid)
                      if (drillTablesList && isEmptyValue(drillTablesList.childs)) {
                        dispatch('requestDrillTables', {
                          processUuid: processResult.processUuid,
                          instanceUuid,
                          processId: processDefinition.id,
                          tableName: output.tableName,
                          printFormatUuid: output.printFormatUuid,
                          reportViewUuid: output.reportViewUuid
                        })
                          .then(drillTablesResponse => {
                            drillTablesList.childs = drillTablesResponse
                            if (drillTablesList.childs.length) {
                              // Get contextMenu metadata and concat drill tables list with contextMenu actions
                              const contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                              contextMenuMetadata.actions.push(drillTablesList)
                            }
                          })
                      }
                    }
                  }
                  // assign new attributes
                  Object.assign(processResult, {
                    ...runProcessResponse,
                    url: link.href,
                    download: link.download,
                    logs: logList,
                    output
                  })
                  dispatch('setReportTypeToShareLink', processResult.output.reportType)
                  commit('addNotificationProcess', processResult)
                  resolve(processResult)
                })
                .catch(error => {
                  Object.assign(processResult, {
                    isError: true,
                    message: error.message,
                    isProcessing: false
                  })
                  console.warn(`Error running the process ${error}`)
                  reject(error)
                })
                .finally(() => {
                  if (processResult.isError) {
                    const countError = state.errorSelection + 1
                    commit('setErrorSelection', countError)
                  } else {
                    const countSuccess = state.successSelection + 1
                    commit('setSuccessSelection', countSuccess)
                  }
                  const countResponse = state.totalResponse + 1
                  commit('setTotalResponse', countResponse)
                  if (state.totalResponse === state.totalRequest) {
                    if (isSession) {
                      showNotification({
                        title: language.t('notifications.succesful'),
                        message: language.t('notifications.totalProcess') + countResponse + language.t('notifications.error') + state.errorSelection + language.t('notifications.succesful') + state.successSelection + language.t('notifications.processExecuted'),
                        type: 'success'
                      })
                    }

                    commit('setTotalRequest', 0)
                    commit('setTotalResponse', 0)
                    commit('setSuccessSelection', 0)
                    commit('setErrorSelection', 0)
                  }
                  dispatch('setProcessSelect', {
                    selection: 0,
                    finish: true,
                    tableName: ''
                  })
                  commit('addNotificationProcess', processResult)
                  commit('addStartedProcess', processResult)
                  commit('deleteInExecution', {
                    containerUuid
                  })
                })
            }
          })
        } else {
          runProcess({
            uuid: processDefinition.uuid,
            id: processDefinition.id,
            reportType,
            parametersList: isEmptyValue(finalParameters) ? parametersList : finalParameters,
            selectionsList: selection,
            tableName,
            recordId
          })
            .then(runProcessResponse => {
              const { instanceUuid, output } = runProcessResponse
              let logList = []
              if (!isEmptyValue(runProcessResponse.logsList)) {
                logList = runProcessResponse.logsList
              }

              let link = {
                href: undefined,
                download: undefined
              }
              if (runProcessResponse.isReport || processDefinition.isReport) {
                const blob = new Blob(
                  [output.outputStream],
                  { type: output.mimeType }
                )
                link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = output.fileName
                if (reportType !== 'pdf' && reportType !== 'html') {
                  link.click()
                }
                const contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                // Report views List to context menu
                const reportViewList = {
                  name: language.t('views.reportView'),
                  type: 'summary',
                  action: '',
                  childs: [],
                  option: 'reportView'
                }
                reportViewList.childs = getters.getReportViewList(processResult.processUuid)
                if (reportViewList && !reportViewList.childs.length) {
                  dispatch('requestReportViews', {
                    processUuid: processResult.processUuid,
                    instanceUuid,
                    processId: processDefinition.id,
                    tableName: output.tableName,
                    printFormatUuid: output.printFormatUuid,
                    reportViewUuid: output.reportViewUuid
                  })
                    .then(responseReportView => {
                      reportViewList.childs = responseReportView
                      if (reportViewList.childs.length) {
                        // Get contextMenu metadata and concat print report views with contextMenu actions
                        contextMenuMetadata.actions.push(reportViewList)
                      }
                    })
                }

                // Print formats to context menu
                const printFormatList = {
                  name: language.t('views.printFormat'),
                  type: 'summary',
                  action: '',
                  childs: [],
                  option: 'printFormat'
                }
                printFormatList.childs = rootGetters.getPrintFormatList(processResult.processUuid)
                if (printFormatList && !printFormatList.childs.length) {
                  dispatch('requestPrintFormats', {
                    processUuid: processResult.processUuid,
                    instanceUuid,
                    processId: processDefinition.id,
                    tableName: output.tableName,
                    printFormatUuid: output.printFormatUuid,
                    reportViewUuid: output.reportViewUuid
                  })
                    .then(printFormarResponse => {
                      printFormatList.childs = printFormarResponse
                      if (printFormatList.childs.length) {
                        // Get contextMenu metadata and concat print Format List with contextMenu actions
                        contextMenuMetadata.actions.push(printFormatList)
                      }
                    })
                } else {
                  const index = contextMenuMetadata.actions.findIndex(action => action.option === 'printFormat')
                  if (index !== -1) {
                    contextMenuMetadata.actions[index] = printFormatList
                  }
                }

                // Drill Tables to context menu
                const drillTablesList = {
                  name: language.t('views.drillTable'),
                  type: 'summary',
                  action: '',
                  childs: [],
                  option: 'drillTable'
                }
                if (!isEmptyValue(output.tableName)) {
                  drillTablesList.childs = rootGetters.getDrillTablesList(processResult.processUuid)
                  if (drillTablesList && isEmptyValue(drillTablesList.childs)) {
                    dispatch('requestDrillTables', {
                      processUuid: processResult.processUuid,
                      instanceUuid,
                      processId: processDefinition.id,
                      tableName: output.tableName,
                      printFormatUuid: output.printFormatUuid,
                      reportViewUuid: output.reportViewUuid
                    })
                      .then(drillTablesResponse => {
                        drillTablesList.childs = drillTablesResponse
                        if (drillTablesList.childs.length) {
                          // Get contextMenu metadata and concat print Format List with contextMenu actions
                          contextMenuMetadata.actions.push(drillTablesList)
                        }
                      })
                  }
                }
              }
              // assign new attributes
              Object.assign(processResult, {
                ...runProcessResponse,
                url: link.href,
                download: link.download,
                logs: logList,
                output
              })
              resolve(processResult)
              dispatch('setReportTypeToShareLink', processResult.output.reportType)
            })
            .catch(error => {
              Object.assign(processResult, {
                isError: true,
                message: error.message,
                isProcessing: false
              })
              console.warn(`Error running the process ${error.message}. Code: ${error.code}.`)
              reject(error)
            })
            .finally(() => {
              if (!processResult.isError) {
                if (panelType === 'window') {
                  // TODO: Add conditional to indicate when update record
                  dispatch('updateRecordAfterRunProcess', {
                    parentUuid,
                    containerUuid,
                    tab
                  })
                } else if (panelType === 'browser') {
                  if (allData.record.length >= 100) {
                    dispatch('getBrowserSearch', {
                      containerUuid
                    })
                  }
                }
              }

              commit('addNotificationProcess', processResult)
              dispatch('finishProcess', {
                processOutput: processResult,
                procesingMessage,
                routeToDelete
              })

              commit('deleteInExecution', {
                containerUuid
              })

              dispatch('setProcessTable', {
                valueRecord: 0,
                tableName: '',
                processTable: false
              })
              dispatch('setProcessSelect', {
                finish: true
              })
            })
        }
      })
    },
    // Supported to process selection
    selectionProcess({ commit, state, dispatch, getters, rootGetters }, {
      parentUuid,
      containerUuid,
      panelType,
      action,
      isProcessTableSelection,
      menuParentUuid,
      routeToDelete
    }) {
      // get info metadata process
      const processDefinition = rootGetters.getProcess(action.uuid)
      const reportType = 'pdf'
      const finalParameters = rootGetters.getParametersToServer({ containerUuid: processDefinition.uuid })
      const isSession = !isEmptyValue(getToken())
      if (isSession) {
        showNotification({
          title: language.t('notifications.processing'),
          message: processDefinition.name,
          summary: processDefinition.description,
          type: 'info'
        })
      }
      const timeInitialized = (new Date()).getTime()
      // Run process on server and wait for it for notify
      if (isProcessTableSelection) {
        const windowSelectionProcess = getters.getProcessSelect
        windowSelectionProcess.selection.forEach(selection => {
          const processResult = {
            // panel attributes from where it was executed
            parentUuid,
            containerUuid,
            panelType,
            menuParentUuid,
            processIdPath: routeToDelete.path,
            // process attributes
            lastRun: timeInitialized,
            action: processDefinition.name,
            name: processDefinition.name,
            description: processDefinition.description,
            instanceUuid: '',
            processUuid: processDefinition.uuid,
            processId: processDefinition.id,
            processName: processDefinition.processName,
            parameters: finalParameters,
            isError: false,
            isProcessing: true,
            isReport: processDefinition.isReport,
            summary: '',
            resultTableName: '',
            logs: [],
            selection: selection.UUID,
            record: selection[windowSelectionProcess.tableName],
            output: {
              uuid: '',
              name: '',
              description: '',
              fileName: '',
              output: '',
              outputStream: '',
              reportType: ''
            }
          }
          const countRequest = state.totalRequest + 1
          commit('addInExecution', processResult)
          commit('setTotalRequest', countRequest)
          if (!windowSelectionProcess.finish) {
            return runProcess({
              uuid: processDefinition.uuid,
              id: processDefinition.id,
              reportType,
              parametersList: finalParameters,
              selectionsList: selection,
              tableName: windowSelectionProcess.tableName,
              recordId: selection[windowSelectionProcess.tableName]
            })
              .then(response => {
                let output = {
                  uuid: '',
                  name: '',
                  description: '',
                  fileName: '',
                  mimeType: '',
                  output: '',
                  outputStream: '',
                  reportType: ''
                }
                if (isEmptyValue(response.output)) {
                  const responseOutput = response.output
                  output = {
                    uuid: responseOutput.uuid,
                    name: responseOutput.name,
                    description: responseOutput.description,
                    fileName: responseOutput.filename,
                    mimeType: responseOutput.mimeType,
                    output: responseOutput.output,
                    outputStream: responseOutput.outputstream,
                    reportType: responseOutput.reporttype
                  }
                }
                let logList = []
                if (response.getLogsList) {
                  logList = response.getLogsList.map(itemLog => {
                    return {
                      log: itemLog.log,
                      recordId: itemLog.recordid
                    }
                  })
                }

                // assign new attributes
                Object.assign(processResult, {
                  instanceUuid: response.instanceUuid,
                  isError: response.isError,
                  isProcessing: response.isProcessing,
                  summary: response.summary,
                  ResultTableName: response.resulttablename,
                  lastRun: response.lastRun,
                  logs: logList,
                  output
                })
                dispatch('setReportTypeToShareLink', processResult.output.reportType)
                if (processResult.isError) {
                  const countError = state.errorSelection + 1
                  commit('setErrorSelection', countError)
                } else {
                  const countSuccess = state.successSelection + 1
                  commit('setSuccessSelection', countSuccess)
                }
                const countResponse = state.totalResponse + 1
                commit('setTotalResponse', countResponse)
                if (state.totalResponse === state.totalRequest) {
                  if (isSession) {
                    showNotification({
                      title: language.t('notifications.succesful'),
                      message: language.t('notifications.totalProcess') + countResponse + language.t('notifications.error') + state.errorSelection + language.t('notifications.succesful') + state.successSelection + language.t('notifications.processExecuted'),
                      type: 'success'
                    })
                  }
                  commit('setTotalRequest', 0)
                  commit('setTotalResponse', 0)
                  commit('setSuccessSelection', 0)
                  commit('setErrorSelection', 0)
                }
                dispatch('setProcessSelect', {
                  selection: 0,
                  finish: true,
                  tableName: ''
                })
                commit('addNotificationProcess', processResult)
                commit('addStartedProcess', processResult)
                commit('deleteInExecution', {
                  containerUuid
                })
              })
              .catch(error => {
                Object.assign(processResult, {
                  isError: true,
                  message: error.message,
                  isProcessing: false
                })
                console.warn(`Error running the process. Code ${error.code}: ${error.message}.`)
              })
          }
        })
      }
    },
    /**
     * TODO: Add date time in which the process/report was executed
     */
    getSessionProcessFromServer({ commit, dispatch, getters, rootGetters }, parameters) {
      // process Activity
      const { pageToken, pageSize } = parameters
      return requestListProcessesLogs({ pageToken, pageSize })
        .then(processActivityResponse => {
          const responseList = processActivityResponse.processLogsList.map(processLogItem => {
            const processMetadata = rootGetters.getProcess(processLogItem.uuid)
            // if no exists metadata process in store and no request progess
            if (processMetadata === undefined && getters.getInRequestMetadata(processLogItem.uuid) === undefined) {
              commit('addInRequestMetadata', processLogItem.uuid)
              dispatch('getProcessFromServer', {
                containerUuid: processLogItem.uuid
              })
                .finally(() => {
                  commit('deleteInRequestMetadata', processLogItem.uuid)
                })
            }
            const process = {
              ...processLogItem,
              processUuid: processLogItem.uuid
            }
            return process
          })

          const processResponseList = {
            recordCount: processActivityResponse.recordCount,
            processList: responseList,
            nextPageToken: processActivityResponse.nextPageToken
          }
          commit('setSessionProcess', processResponseList)
          return processResponseList
        })
        .catch(error => {
          showNotification({
            title: language.t('notifications.error'),
            message: error.message,
            type: 'error'
          })
          console.warn(`Error getting process activity: ${error.message}. Code: ${error.code}.`)
        })
    },
    /**
     * Show modal dialog with process/report, tab (sequence) metadata
     * @param {String} type of panel or panelType ('process', 'report', 'window')
     * @param {Object} action
     */
    setShowDialog({ state, commit, dispatch, rootGetters }, {
      type,
      action
    }) {
      const panels = ['process', 'report', 'window']
      if (action && (panels.includes(type) || panels.includes(action.panelType))) {
        // show some process loaded in store
        if (state.metadata && !isEmptyValue(state.metadata.containerUuid) &&
        state.metadata.containerUuid === action.containerUuid) {
          commit('setShowDialog', true)
          return
        }
        const panel = rootGetters.getPanel(action.containerUuid)
        if (panel === undefined) {
          dispatch('getPanelAndFields', {
            parentUuid: action.parentUuid,
            containerUuid: isEmptyValue(action.uuid) ? action.containerUuid : action.uuid,
            panelType: action.panelType
          })
            .then(response => {
              commit('setMetadata', response)
              commit('setShowDialog', true)
            })
        } else {
          commit('setMetadata', panel)
          commit('setShowDialog', true)
        }
        return
      }
      commit('setShowDialog', false)
    },
    finishProcess({ commit }, {
      processOutput,
      routeToDelete,
      procesingMessage
    }) {
      const processMessage = {
        name: processOutput.processName,
        title: language.t('notifications.succesful'),
        message: language.t('notifications.processExecuted'),
        type: 'success',
        logs: processOutput.logs,
        summary: processOutput.summary
      }
      const errorMessage = !isEmptyValue(processOutput.message) ? processOutput.message : language.t('notifications.error')
      // TODO: Add isReport to type always 'success'
      if (processOutput.isError || isEmptyValue(processOutput.processId) || isEmptyValue(processOutput.instanceUuid)) {
        processMessage.title = language.t('notifications.error')
        processMessage.message = errorMessage
        processMessage.type = 'error'
        processOutput.isError = true
      }
      if (processOutput.isReport && !processOutput.isError) {
        // open report viewer with report response
        let menuParentUuid = routeToDelete.params.menuParentUuid
        if (isEmptyValue(menuParentUuid)) {
          menuParentUuid = processOutput.menuParentUuid
        }

        let tableName
        if (processOutput.option && !isEmptyValue(processOutput.option)) {
          if (processOutput.option === 'drillTable') {
            tableName = processOutput.tableName
          }
        }

        router.push({
          name: 'Report Viewer',
          params: {
            processId: processOutput.processId,
            instanceUuid: processOutput.instanceUuid,
            fileName: isEmptyValue(processOutput.output.fileName) ? processOutput.fileName : processOutput.output.fileName,
            menuParentUuid,
            tableName
          }
        })
      }
      const isSession = !isEmptyValue(getToken())
      if (isSession) {
        showNotification(processMessage)
      }
      if (!isEmptyValue(procesingMessage)) {
        procesingMessage.close()
      }

      commit('addStartedProcess', processOutput)
      commit('setReportValues', processOutput)
    },
    changeFormatReport({ commit }, reportFormat) {
      if (!isEmptyValue(reportFormat)) {
        commit('changeFormatReport', reportFormat)
      }
    }
  },
  getters: {
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
    /**
     * Process receibed from server associated whith this session
     */
    getAllSessionProcess: (state) => {
      return state.sessionProcess
    },
    /**
     * Process request metadata from server filter form uuid process
     */
    getInRequestMetadata: (state) => (containerUuid) => {
      return state.inRequestMetadata.find(item => item === containerUuid)
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
}

export default processControl
