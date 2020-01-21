import { requestReportViews, requestPrintFormats, requestDrillTables, getReportOutput } from '@/api/ADempiere'
import { isEmptyValue } from '@/utils/ADempiere'
const contextMenu = {
  state: {
    reportFormatsList: [],
    reportViewsList: [],
    drillTablesList: [],
    reportOutput: {}
  },
  mutations: {
    setReportFormatsList(state, payload) {
      state.reportFormatsList.push(payload)
    },
    setReportViewsList(state, payload) {
      state.reportViewsList.push(payload)
    },
    setDrillTablesList(state, payload) {
      state.drillTablesList.push(payload)
    },
    setNewReportOutput(state, payload) {
      state.reportOutput = payload
    }
  },
  actions: {
    requestPrintFormats({ commit }, {
      processId,
      processUuid,
      instanceUuid
    }) {
      return requestPrintFormats({ processUuid })
        .then(printFormatResponse => {
          const printFormatList = printFormatResponse.printFormatsList.map(printFormatItem => {
            return {
              ...printFormatItem,
              type: 'updateReport',
              option: 'printFormat',
              instanceUuid,
              processUuid,
              processId
            }
          })
          commit('setReportFormatsList', {
            containerUuid: processUuid,
            printFormatList
          })
          return printFormatList
        })
        .catch(error => {
          console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
        })
    },
    requestReportViews({ commit }, {
      processId,
      processUuid,
      instanceUuid,
      printFormatUuid
    }) {
      return requestReportViews({ processUuid })
        .then(reportViewResponse => {
          const reportViewList = reportViewResponse.reportViewsList.map(reportViewItem => {
            return {
              ...reportViewItem,
              type: 'updateReport',
              option: 'reportView',
              instanceUuid,
              printFormatUuid,
              processUuid,
              processId
            }
          })
          commit('setReportViewsList', {
            containerUuid: processUuid,
            viewList: reportViewList
          })
          return reportViewList
        })
        .catch(error => {
          console.warn(`Error getting report views: ${error.message}. Code: ${error.code}.`)
        })
    },
    requestDrillTables({ commit }, {
      processId,
      processUuid,
      instanceUuid,
      printFormatUuid,
      tableName,
      reportViewUuid
    }) {
      return requestDrillTables({ tableName })
        .then(responseDrillTables => {
          const drillTablesList = responseDrillTables.drillTablesList.map(drillTableItem => {
            return {
              ...drillTableItem,
              name: drillTableItem.printName,
              type: 'updateReport',
              option: 'drillTable',
              instanceUuid,
              printFormatUuid,
              reportViewUuid,
              processUuid,
              processId
            }
          })
          commit('setDrillTablesList', {
            containerUuid: processUuid,
            drillTablesList
          })
          return drillTablesList
        })
        .catch(error => {
          console.warn(`Error getting drill tables: ${error.message}. Code: ${error.code}.`)
        })
    },
    getReportOutputFromServer({ commit, getters, rootGetters }, parameters) {
      if (isEmptyValue(parameters.printFormatUuid)) {
        parameters.printFormatUuid = getters.getDefaultPrintFormat(parameters.processUuid).printFormatUuid
      }
      const {
        tableName,
        printFormatUuid,
        reportViewUuid,
        isSummary,
        reportName,
        reportType,
        processUuid,
        processId,
        instanceUuid,
        option
      } = parameters
      const parametersList = rootGetters.getParametersToServer({ containerUuid: processUuid })
      return getReportOutput({
        parametersList,
        printFormatUuid,
        reportViewUuid,
        isSummary,
        reportName,
        reportType,
        tableName
      })
        .then(response => {
          const reportOutput = {
            ...response,
            processId: processId,
            processUuid: processUuid,
            isError: false,
            instanceUuid: instanceUuid,
            isReport: true,
            option: option
          }
          commit('setNewReportOutput', reportOutput)
          return reportOutput
        })
        .catch(error => {
          const reportOutput = {
            uuid: '',
            processName: '',
            description: '',
            fileName: '',
            output: '',
            mimeType: '',
            dataCols: null,
            dataRows: null,
            headerName: '',
            footerName: '',
            printFormatUuid: '',
            reportViewUuid: '',
            tableName: '',
            outputStream: [],
            reportType: '',
            processId: null,
            processUuid: '',
            isError: true,
            instanceUuid: '',
            isReport: true,
            option: ''
          }
          console.warn(`Error getting report output: ${error.message}. Code: ${error.code}.`)
          return reportOutput
        })
    }
  },
  getters: {
    getPrintFormatList: (state) => (containerUuid) => {
      var printFormatList = state.reportFormatsList.find(list => list.containerUuid === containerUuid)
      if (printFormatList) {
        return printFormatList.printFormatList
      }
      return []
    },
    getDefaultPrintFormat: (state, getters) => (containerUuid) => {
      return getters.getPrintFormatList(containerUuid).find(printFormat => printFormat.isDefault)
    },
    getReportViewList: (state) => (containerUuid) => {
      var reportViewList = state.reportViewsList.find(list => list.containerUuid === containerUuid)
      if (reportViewList) {
        return reportViewList.viewList
      }
      return []
    },
    getDrillTablesList: (state) => (containerUuid) => {
      var drillTablesList = state.drillTablesList.find(list => list.containerUuid === containerUuid)
      if (drillTablesList) {
        return drillTablesList.viewList
      }
      return []
    }
  }
}

export default contextMenu
