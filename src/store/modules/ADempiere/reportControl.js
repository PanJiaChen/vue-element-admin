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
    requestPrintFormats({ commit }, parameters) {
      return requestPrintFormats({ processUuid: parameters.processUuid })
        .then(response => {
          const printFormatList = response.getPrintformatsList().map(printFormat => {
            return {
              printFormatUuid: printFormat.getUuid(),
              name: printFormat.getName(),
              description: printFormat.getDescription(),
              isDefault: printFormat.getIsdefault(),
              tableName: printFormat.getTablename(),
              reportViewUuid: printFormat.getReportviewuuid(),
              type: 'updateReport',
              option: 'printFormat',
              instanceUuid: parameters.instanceUuid,
              processUuid: parameters.processUuid,
              processId: parameters.processId
            }
          })
          commit('setReportFormatsList', {
            containerUuid: parameters.processUuid,
            printFormatList: printFormatList
          })
          return printFormatList
        })
        .catch(error => {
          console.error(error)
        })
    },
    requestReportViews({ commit }, parameters) {
      return requestReportViews({ processUuid: parameters.processUuid })
        .then(response => {
          const reportViewList = response.getReportviewsList().map(reportView => {
            return {
              reportViewUuid: reportView.getUuid(),
              name: reportView.getName(),
              tableName: reportView.getTablename(),
              description: reportView.getDescription(),
              type: 'updateReport',
              option: 'reportView',
              instanceUuid: parameters.instanceUuid,
              printFormatUuid: parameters.printFormatUuid,
              processUuid: parameters.processUuid,
              processId: parameters.processId
            }
          })
          commit('setReportViewsList', {
            containerUuid: parameters.processUuid,
            viewList: reportViewList
          })
          return reportViewList
        })
        .catch(error => {
          console.error(error)
        })
    },
    requestDrillTables({ commit }, parameters) {
      return requestDrillTables(parameters.tableName)
        .then(response => {
          const drillTablesList = response.getDrilltablesList().map(drillTable => {
            return {
              name: drillTable.getPrintname(),
              tableName: drillTable.getTablename(),
              type: 'updateReport',
              option: 'drillTable',
              instanceUuid: parameters.instanceUuid,
              printFormatUuid: parameters.printFormatUuid,
              reportViewUuid: parameters.reportViewUuid,
              processUuid: parameters.processUuid,
              processId: parameters.processId
            }
          })
          commit('setDrillTablesList', {
            containerUuid: parameters.processUuid,
            drillTablesList: drillTablesList
          })
          return drillTablesList
        })
        .catch(error => {
          console.error(error)
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
      const processParameters = rootGetters.getParametersToServer({ containerUuid: processUuid })
      return getReportOutput({
        criteria: processParameters,
        printFormatUuid: printFormatUuid,
        reportViewUuid: reportViewUuid,
        isSummary: isSummary,
        reportName: reportName,
        reportType: reportType,
        tableName: tableName
      })
        .then(response => {
          const reportOutput = {
            uuid: response.getUuid(),
            processName: response.getName(),
            description: response.getDescription(),
            fileName: response.getFilename(),
            output: response.getOutput(),
            mimeType: response.getMimetype(),
            dataCols: response.getDatacols(),
            dataRows: response.getDatarows(),
            headerName: response.getHeadername(),
            footerName: response.getFootername(),
            printFormatUuid: response.getPrintformatuuid(),
            reportViewUuid: response.getReportviewuuid(),
            tableName: response.getTablename(),
            outputStream: response.getOutputstream(),
            reportType: response.getReporttype(),
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
          console.error(error)
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
