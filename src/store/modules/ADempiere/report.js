import {
  requestListReportsViews,
  requestListPrintFormats,
  requestListDrillTables,
  requestGetReportOutput
} from '@/api/ADempiere/report'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const initStateReportControl = {
  reportFormatsList: [],
  reportViewsList: [],
  drillTablesList: [],
  reportOutput: {}
}

const reportControl = {
  state: initStateReportControl,
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
    },
    resetReportControl(state) {
      state = initStateReportControl
    }
  },
  actions: {
    reportActionPerformed({ commit }, {
      containerUuid,
      field,
      value
    }) {

    },
    getListPrintFormats({ commit }, {
      processId,
      processUuid,
      instanceUuid
    }) {
      return new Promise(resolve => {
        requestListPrintFormats({ processUuid })
          .then(printFormatResponse => {
            const printFormatList = printFormatResponse.records.map(printFormatItem => {
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

            resolve(printFormatList)
          })
          .catch(error => {
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    getReportViewsFromServer({ commit }, {
      processId,
      processUuid,
      instanceUuid,
      printFormatUuid
    }) {
      return new Promise(resolve => {
        requestListReportsViews({ processUuid })
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

            resolve(reportViewList)
          })
          .catch(error => {
            console.warn(`Error getting report views: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    getDrillTablesFromServer({ commit }, {
      processId,
      processUuid,
      instanceUuid,
      printFormatUuid,
      tableName,
      reportViewUuid
    }) {
      return new Promise(resolve => {
        requestListDrillTables({ tableName })
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

            resolve(drillTablesList)
          })
          .catch(error => {
            console.warn(`Error getting drill tables: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    getReportOutputFromServer({ commit, getters, rootGetters }, {
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
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(printFormatUuid)) {
          printFormatUuid = getters.getDefaultPrintFormat(processUuid).printFormatUuid
        }
        const parametersList = rootGetters.getParametersToServer({
          containerUuid: processUuid
        })
        requestGetReportOutput({
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
              processId,
              processUuid,
              isError: false,
              instanceUuid,
              isReport: true,
              option
            }
            commit('setNewReportOutput', reportOutput)

            resolve(reportOutput)
          })
          .catch(error => {
            console.warn(`Error getting report output: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getPrintFormatList: (state) => (containerUuid) => {
      const printFormatList = state.reportFormatsList.find(list => list.containerUuid === containerUuid)
      if (printFormatList) {
        return printFormatList.printFormatList
      }
      return []
    },
    getDefaultPrintFormat: (state, getters) => (containerUuid) => {
      return getters.getPrintFormatList(containerUuid).find(printFormat => printFormat.isDefault)
    },
    getReportViewList: (state) => (containerUuid) => {
      const reportViewList = state.reportViewsList.find(list => list.containerUuid === containerUuid)
      if (reportViewList) {
        return reportViewList.viewList
      }
      return []
    },
    getDrillTablesList: (state) => (containerUuid) => {
      const drillTablesList = state.drillTablesList.find(list => list.containerUuid === containerUuid)
      if (drillTablesList) {
        return drillTablesList.viewList
      }
      return []
    }
  }
}

export default reportControl
