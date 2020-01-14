import { runProcess, requestProcessActivity } from '@/api/ADempiere'
import { showNotification } from '@/utils/ADempiere/notification'
import { isEmptyValue, convertMapToArrayPairs } from '@/utils/ADempiere'
import language from '@/lang'
import router from '@/router'

const processControl = {
  state: {
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
  },
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
    dataResetCacheProcess(state, payload) {
      state.process = payload
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
        var reportIndex = state.reportList.findIndex(report => report.instanceUuid === payload.instanceUuid)
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
    clearProcessControl(state) {
      state.inExecution = [] // process not response from server
      state.reportObject = {}
      state.reportList = []
      state.metadata = {}
      state.process = [] // process to run finish
      state.sessionProcess = []
      state.notificationProcess = []
      state.inRequestMetadata = []
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
    startProcess({ commit, state, dispatch, getters, rootGetters }, params) {
      return new Promise((resolve, reject) => {
        // TODO: Add support to evaluate params to send
        const samePocessInExecution = getters.getInExecution(params.containerUuid)
        // exists some call to executed process with container uuid
        if (samePocessInExecution && !params.isProcessTableSelection) {
          return reject({
            error: 0,
            message: `In this process (${samePocessInExecution.name}) there is already an execution in progress.`
          })
        }
        var selection = []
        var allData = {}
        var tab, tableName, recordId
        if (params.panelType) {
          if (params.panelType === 'browser') {
            allData = getters.getDataRecordAndSelection(params.containerUuid)
            selection = rootGetters.getSelectionToServer({
              containerUuid: params.containerUuid,
              selection: allData.selection
            })
            if (selection.length < 1) {
              showNotification({
                title: language.t('data.selectionRequired'),
                type: 'warning'
              })
              return reject({
                error: 0,
                message: `Required selection data record to run this process (${params.action.name})`
              })
            }
          }
          if (params.panelType === 'window') {
            const contextMenu = getters.getRecordUuidMenu
            if (params.isProcessTableSelection) {
              tab = rootGetters.getTab(params.parentUuid, params.containerUuid)
              tableName = params.tableNameUuidSelection
              recordId = params.recordUuidSelection
            } else {
              if (contextMenu.processTable) {
                tab = rootGetters.getTab(params.parentUuid, params.containerUuid)
                tableName = contextMenu.tableName
                recordId = contextMenu.valueRecord
              } else {
                tab = rootGetters.getTab(params.parentUuid, params.containerUuid)
                tableName = tab.tableName
                const field = rootGetters.getFieldFromColumnName(params.containerUuid, tableName + '_ID')
                recordId = field.value
              }
            }
          }
        }
        // get info metadata process
        const processDefinition = rootGetters.getProcess(params.action.uuid)
        var reportType = params.reportFormat
        const finalParameters = rootGetters.getParametersToServer({ containerUuid: processDefinition.uuid })

        showNotification({
          title: language.t('notifications.processing'),
          message: processDefinition.name,
          summary: processDefinition.description,
          type: 'info'
        })
        const timeInitialized = (new Date()).getTime()
        // Run process on server and wait for it for notify
        var processResult = {
          // panel attributes from where it was executed
          parentUuid: params.parentUuid,
          containerUuid: params.containerUuid,
          panelType: params.panelType,
          menuParentUuid: params.menuParentUuid,
          processIdPath: params.routeToDelete.path,
          printFormatUuid: params.action.printFormatUuid,
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
        commit('addInExecution', processResult)
        if (params.panelType === 'window') {
          reportType = 'pdf'
        } else if (params.panelType === 'browser') {
          if (allData.record.length <= 100) {
            // close view if is browser.
            router.push({ path: '/dashboard' })
            dispatch('tagsView/delView', params.routeToDelete)
            // delete data associate to browser
            dispatch('deleteRecordContainer', {
              viewUuid: params.containerUuid
            })
          }
        } else {
          // close view if is process, report.
          router.push({ path: '/dashboard' })
          dispatch('tagsView/delView', params.routeToDelete)
        }
        if (params.isProcessTableSelection) {
          var windowSelectionProcess = getters.getProcessSelect
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
                reportType: reportType,
                parameters: finalParameters,
                selection: selection,
                tableName: windowSelectionProcess.tableName,
                recordId: selection[windowSelectionProcess.tableName]
              })
                .then(response => {
                  var output = {
                    uuid: '',
                    name: '',
                    description: '',
                    fileName: '',
                    mimeType: '',
                    output: '',
                    outputStream: '',
                    reportType: ''
                  }
                  if (response.getOutput()) {
                    const responseOutput = response.getOutput()
                    output = {
                      uuid: responseOutput.getUuid(),
                      name: responseOutput.getName(),
                      description: responseOutput.getDescription(),
                      fileName: responseOutput.getFilename(),
                      mimeType: responseOutput.getMimetype(),
                      output: responseOutput.getOutput(),
                      outputStream: responseOutput.getOutputstream(),
                      reportType: responseOutput.getReporttype()
                    }
                  }
                  var logList = []
                  if (response.getLogsList()) {
                    logList = response.getLogsList().map(itemLog => {
                      return {
                        log: itemLog.getLog(),
                        recordId: itemLog.getRecordid()
                      }
                    })
                  }

                  var link = {
                    href: undefined,
                    download: undefined
                  }
                  if (processDefinition.isReport) {
                    const blob = new Blob([output.outputStream], { type: output.mimeType })
                    link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = output.fileName
                    if (reportType !== 'pdf' && reportType !== 'html') {
                      link.click()
                    }

                    // Report views List to context menu
                    var reportViewList = {
                      name: language.t('views.reportView'),
                      type: 'summary',
                      action: '',
                      childs: [],
                      option: 'reportView'
                    }
                    reportViewList.childs = getters.getReportViewList(processResult.processUuid)
                    if (!reportViewList.childs.length) {
                      dispatch('requestReportViews', {
                        processUuid: processResult.processUuid
                      })
                        .then(response => {
                          reportViewList.childs = response
                          // Get contextMenu metadata and concat print report views with contextMenu actions
                          var contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                          contextMenuMetadata.actions.push(reportViewList)
                        })
                    }

                    // Print formats to context menu
                    var printFormatList = {
                      name: language.t('views.printFormat'),
                      type: 'summary',
                      action: '',
                      childs: [],
                      option: 'printFormat'
                    }
                    printFormatList.childs = rootGetters.getPrintFormatList(processResult.processUuid)
                    if (!printFormatList.childs.length) {
                      dispatch('requestPrintFormats', {
                        processUuid: processResult.processUuid
                      })
                        .then(response => {
                          printFormatList.childs = response
                          // Get contextMenu metadata and concat print Format List with contextMenu actions
                          var contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                          contextMenuMetadata.actions.push(printFormatList)
                        })
                    }
                  }
                  // assign new attributes
                  Object.assign(processResult, {
                    instanceUuid: response.getInstanceuuid(),
                    url: link.href,
                    download: link.download,
                    isError: response.getIserror(),
                    isProcessing: response.getIsprocessing(),
                    summary: response.getSummary(),
                    ResultTableName: response.getResulttablename(),
                    lastRun: response.getLastrun(),
                    logs: logList,
                    output: output
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
                  console.log('Error running the process', error)
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
                    // showNotification({
                    //   title: language.t('notifications.succesful'),
                    //   message: language.t('notifications.totalProcess') + countResponse + language.t('notifications.error') + state.errorSelection + language.t('notifications.succesful') + state.successSelection + language.t('notifications.processExecuted'),
                    //   type: 'success'
                    // })
                    var processMessage = {
                      title: language.t('notifications.succesful'),
                      message: language.t('notifications.totalProcess') + countResponse + language.t('notifications.error') + state.errorSelection + language.t('notifications.succesful') + state.successSelection + language.t('notifications.processExecuted'),
                      type: 'success'
                    }
                    showNotification(processMessage)
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
                    containerUuid: params.containerUuid
                  })
                })
            }
          })
        } else {
          runProcess({
            uuid: processDefinition.uuid,
            id: processDefinition.id,
            reportType: reportType,
            parameters: finalParameters,
            selection: selection,
            tableName: tableName,
            recordId: recordId
          })
            .then(response => {
              var output = {
                uuid: '',
                name: '',
                description: '',
                fileName: '',
                mimeType: '',
                output: '',
                outputStream: '',
                reportType: ''
              }
              if (response.getOutput()) {
                const responseOutput = response.getOutput()
                output = {
                  uuid: responseOutput.getUuid(),
                  name: responseOutput.getName(),
                  description: responseOutput.getDescription(),
                  fileName: responseOutput.getFilename(),
                  mimeType: responseOutput.getMimetype(),
                  output: responseOutput.getOutput(),
                  outputStream: responseOutput.getOutputstream(),
                  reportType: responseOutput.getReporttype()
                }
              }
              var logList = []
              if (response.getLogsList()) {
                logList = response.getLogsList().map(itemLog => {
                  return {
                    log: itemLog.getLog(),
                    recordId: itemLog.getRecordid()
                  }
                })
              }
              reportViewList.childs = getters.getReportViewList(processResult.processUuid)
              if (reportViewList && !reportViewList.childs.length) {
                dispatch('requestReportViews', {
                  processUuid: processResult.processUuid,
                  instanceUuid: response.getInstanceuuid(),
                  processId: processDefinition.id,
                  tableName: output.tableName,
                  printFormatUuid: output.printFormatUuid,
                  reportViewUuid: output.reportViewUuid
                })
                  .then(response => {
                    reportViewList.childs = response
                    if (reportViewList.childs.length) {
                      // Get contextMenu metadata and concat print report views with contextMenu actions
                      var contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                      contextMenuMetadata.actions.push(reportViewList)
                    }
                  })
              }

              var link = {
                href: undefined,
                download: undefined
              }
              if (processDefinition.isReport) {
                const blob = new Blob([output.outputStream], { type: output.mimeType })
                link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = output.fileName
                if (reportType !== 'pdf' && reportType !== 'html') {
                  link.click()
                }

                // Report views List to context menu
                var reportViewList = {
                  name: language.t('views.reportView'),
                  type: 'summary',
                  action: '',
                  childs: [],
                  option: 'reportView'
                }
                reportViewList.childs = getters.getReportViewList(processResult.processUuid)
                if (!reportViewList.childs.length) {
                  dispatch('requestReportViews', {
                    processUuid: processResult.processUuid
                  })
                    .then(response => {
                      reportViewList.childs = response
                      // Get contextMenu metadata and concat print report views with contextMenu actions
                      var contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                      contextMenuMetadata.actions.push(reportViewList)
                    })
                }

                // Print formats to context menu
                var printFormatList = {
                  name: language.t('views.printFormat'),
                  type: 'summary',
                  action: '',
                  childs: [],
                  option: 'printFormat'
                }
                printFormatList.childs = rootGetters.getPrintFormatList(processResult.processUuid)
                if (!printFormatList.childs.length) {
                  dispatch('requestPrintFormats', {
                    processUuid: processResult.processUuid
                  })
                    .then(response => {
                      printFormatList.childs = response
                      // Get contextMenu metadata and concat print Format List with contextMenu actions
                      var contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                      contextMenuMetadata.actions.push(printFormatList)
                    })
                }

                // Drill Tables to context menu
                var drillTablesList = {
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
                      instanceUuid: response.getInstanceuuid(),
                      processId: processDefinition.id,
                      tableName: output.tableName,
                      printFormatUuid: output.printFormatUuid,
                      reportViewUuid: output.reportViewUuid
                    })
                      .then(response => {
                        drillTablesList.childs = response
                        if (drillTablesList.childs.length) {
                          // Get contextMenu metadata and concat print Format List with contextMenu actions
                          var contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                          contextMenuMetadata.actions.push(drillTablesList)
                        }
                      })
                  }
                }
              }
              // assign new attributes
              Object.assign(processResult, {
                instanceUuid: response.getInstanceuuid(),
                url: link.href,
                download: link.download,
                isError: response.getIserror(),
                isProcessing: response.getIsprocessing(),
                summary: response.getSummary(),
                resultTableName: response.getResulttablename(),
                lastRun: response.getLastrun(),
                logs: logList,
                output: output
              })
              dispatch('setReportTypeToShareLink', processResult.output.reportType)
              resolve(processResult)
            })
            .catch(error => {
              Object.assign(processResult, {
                isError: true,
                message: error.message,
                isProcessing: false
              })
              console.log('Error running the process', error)
              reject(error)
            })
            .finally(() => {
              if (!processResult.isError) {
                if (params.panelType === 'window') {
                  // TODO: Add conditional to indicate when update record
                  dispatch('updateRecordAfterRunProcess', {
                    parentUuid: params.parentUuid,
                    containerUuid: params.containerUuid,
                    tab: tab
                  })
                } else if (params.panelType === 'browser') {
                  if (allData.record.length >= 100) {
                    dispatch('getBrowserSearch', {
                      containerUuid: params.containerUuid
                    })
                  }
                }
              }

              commit('addNotificationProcess', processResult)
              dispatch('finishProcess', {
                processOutput: processResult,
                routeToDelete: params.routeToDelete
              })

              commit('deleteInExecution', {
                containerUuid: params.containerUuid
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
    SelectionProcess({ commit, state, dispatch, getters, rootGetters }, params) {
      // get info metadata process
      const processDefinition = rootGetters.getProcess(params.action.uuid)
      var reportType = 'pdf'
      const finalParameters = rootGetters.getParametersToServer({ containerUuid: processDefinition.uuid })

      showNotification({
        title: language.t('notifications.processing'),
        message: processDefinition.name,
        summary: processDefinition.description,
        type: 'info'
      })
      const timeInitialized = (new Date()).getTime()
      // Run process on server and wait for it for notify
      if (params.isProcessTableSelection) {
        var windowSelectionProcess = getters.getProcessSelect
        windowSelectionProcess.selection.forEach(selection => {
          var processResult = {
            // panel attributes from where it was executed
            parentUuid: params.parentUuid,
            containerUuid: params.containerUuid,
            panelType: params.panelType,
            menuParentUuid: params.menuParentUuid,
            processIdPath: params.routeToDelete.path,
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
              reportType: reportType,
              parameters: finalParameters,
              selection: selection,
              tableName: windowSelectionProcess.tableName,
              recordId: selection[windowSelectionProcess.tableName]
            })
              .then(response => {
                var output = {
                  uuid: '',
                  name: '',
                  description: '',
                  fileName: '',
                  mimeType: '',
                  output: '',
                  outputStream: '',
                  reportType: ''
                }
                if (response.getOutput()) {
                  const responseOutput = response.getOutput()
                  output = {
                    uuid: responseOutput.getUuid(),
                    name: responseOutput.getName(),
                    description: responseOutput.getDescription(),
                    fileName: responseOutput.getFilename(),
                    mimeType: responseOutput.getMimetype(),
                    output: responseOutput.getOutput(),
                    outputStream: responseOutput.getOutputstream(),
                    reportType: responseOutput.getReporttype()
                  }
                }
                var logList = []
                if (response.getLogsList()) {
                  logList = response.getLogsList().map(itemLog => {
                    return {
                      log: itemLog.getLog(),
                      recordId: itemLog.getRecordid()
                    }
                  })
                }

                var link = {
                  href: undefined,
                  download: undefined
                }
                if (processDefinition.isReport) {
                  const blob = new Blob([output.outputStream], { type: output.mimeType })
                  link = document.createElement('a')
                  link.href = window.URL.createObjectURL(blob)
                  link.download = output.fileName
                  if (reportType !== 'pdf' && reportType !== 'html') {
                    link.click()
                  }

                  // Report views List to context menu
                  var reportViewList = {
                    name: language.t('views.reportView'),
                    type: 'summary',
                    action: '',
                    childs: [],
                    option: 'reportView'
                  }
                  reportViewList.childs = getters.getReportViewList(processResult.processUuid)
                  if (!reportViewList.childs.length) {
                    dispatch('requestReportViews', {
                      processUuid: processResult.processUuid
                    })
                      .then(response => {
                        reportViewList.childs = response
                        // Get contextMenu metadata and concat print report views with contextMenu actions
                        var contextMenuMetadata = rootGetters.getContextMenu(processResult.processUuid)
                        contextMenuMetadata.actions.push(reportViewList)
                      })
                  }
                }
                // assign new attributes
                Object.assign(processResult, {
                  instanceUuid: response.getInstanceuuid(),
                  url: link.href,
                  download: link.download,
                  isError: response.getIserror(),
                  isProcessing: response.getIsprocessing(),
                  summary: response.getSummary(),
                  ResultTableName: response.getResulttablename(),
                  lastRun: response.getLastrun(),
                  logs: logList,
                  output: output
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
                  var processMessage = {
                    title: language.t('notifications.succesful'),
                    message: language.t('notifications.totalProcess') + countResponse + language.t('notifications.error') + state.errorSelection + language.t('notifications.succesful') + state.successSelection + language.t('notifications.processExecuted'),
                    type: 'success'
                  }
                  showNotification(processMessage)
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
                  containerUuid: params.containerUuid
                })
              })
              .catch(error => {
                Object.assign(processResult, {
                  isError: true,
                  message: error.message,
                  isProcessing: false
                })
                console.log('Error running the process', error)
              })
          }
        })
      }
    },
    /**
     * TODO: Add date time in which the process/report was executed
     */
    getSessionProcessFromServer({ commit, dispatch, getters, rootGetters }) {
      // process Activity
      return requestProcessActivity()
        .then(response => {
          var responseList = response.getResponsesList().map(responseItem => {
            var uuid = responseItem.getUuid()
            var responseOutput = responseItem.getOutput()
            var output
            if (responseOutput !== undefined) {
              output = {
                uuid: uuid,
                name: responseOutput.getName(),
                description: responseOutput.getDescription(),
                fileName: responseOutput.getFilename(),
                mimeType: responseOutput.getMimetype(),
                output: responseOutput.getOutput(),
                outputStream: responseOutput.getOutputstream(),
                outputStream_asB64: responseOutput.getOutputstream_asB64(),
                outputStream_asU8: responseOutput.getOutputstream_asU8(),
                reportType: responseOutput.getReporttype()
              }
            }
            var logList = responseItem.getLogsList().map(log => {
              return {
                recordId: log.getRecordid(),
                log: log.getLog()
              }
            })
            var processMetadata = rootGetters.getProcess(uuid)
            // if no exists metadata process in store and no request progess
            if (processMetadata === undefined && getters.getInRequestMetadata(uuid) === undefined) {
              commit('addInRequestMetadata', uuid)
              dispatch('getProcessFromServer', { containerUuid: uuid })
                .finally(() => {
                  commit('deleteInRequestMetadata', uuid)
                })
            }

            var process = {
              processUuid: responseItem.getUuid(),
              instanceUuid: responseItem.getInstanceuuid(),
              isError: responseItem.getIserror(),
              isProcessing: responseItem.getIsprocessing(),
              logs: logList,
              output: output,
              lastRun: responseItem.getLastrun(),
              parametersMap: responseItem.getParametersMap(),
              parameters: convertMapToArrayPairs(
                responseItem.getParametersMap()
              ),
              ResultTableName: responseItem.getResulttablename(),
              summary: responseItem.getSummary()
            }
            return process
          })

          var processResponseList = {
            recordCount: response.getRecordcount(),
            processList: responseList,
            nextPageToken: response.getNextPageToken()
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
          console.warn('Error getting process activity:' + error.message + '. Code: ' + error.code)
        })
    },
    /**
     *
     * @param {object} params
     */
    setShowDialog({ state, commit, dispatch, rootGetters }, params) {
      const panels = ['process', 'report', 'window']
      if (params.action && (panels.includes(params.type) || panels.includes(params.action.panelType))) {
        if (state.metadata && state.metadata.containerUuid === params.action.containerUuid) {
          commit('setShowDialog', true)
          return
        }
        const panel = rootGetters.getPanel(params.action.containerUuid)
        if (panel === undefined) {
          dispatch('getPanelAndFields', {
            parentUuid: params.action.parentUuid,
            containerUuid: params.action.containerUuid || params.action.uuid,
            panelType: params.action.panelType
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
    finishProcess({ commit }, parameters) {
      var processMessage = {
        name: parameters.processOutput.processName,
        title: language.t('notifications.succesful'),
        message: language.t('notifications.processExecuted'),
        type: 'success',
        logs: parameters.processOutput.logs,
        summary: parameters.processOutput.summary
      }
      var errorMessage = !isEmptyValue(parameters.processOutput.message) ? parameters.processOutput.message : language.t('login.error')
      // TODO: Add isReport to type always 'success'
      if (parameters.processOutput.isError || isEmptyValue(parameters.processOutput.processId) || isEmptyValue(parameters.processOutput.instanceUuid)) {
        processMessage.title = language.t('notifications.error')
        processMessage.message = errorMessage
        processMessage.type = 'error'
        parameters.processOutput.isError = true
      }
      if (parameters.processOutput.isReport && !parameters.processOutput.isError) {
        // open report viewer with report response
        if (isEmptyValue(parameters.processOutput.menuParentUuid)) {
          parameters.processOutput.menuParentUuid = parameters.processOutput.processUuid
        }

        var tableName
        if (parameters.processOutput.option && !isEmptyValue(parameters.processOutput.option)) {
          if (parameters.processOutput.option === 'drillTable') {
            tableName = parameters.processOutput.tableName
          }
        }
        router.push({
          name: 'Report Viewer',
          params: {
            processId: parameters.processOutput.processId,
            instanceUuid: parameters.processOutput.instanceUuid,
            fileName: isEmptyValue(parameters.processOutput.output.fileName) ? parameters.processOutput.fileName : parameters.processOutput.output.fileName,
            menuParentUuid: parameters.processOutput.menuParentUuid,
            tableName: tableName
          }
        })
      }

      showNotification(processMessage)
      commit('addStartedProcess', parameters.processOutput)
      commit('setReportValues', parameters.processOutput)
    },
    changeFormatReport({ commit }, reportFormat) {
      if (reportFormat !== undefined) {
        commit('changeFormatReport', reportFormat)
      }
    },
    clearProcessControl({ commit }) {
      commit('clearProcessControl')
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
