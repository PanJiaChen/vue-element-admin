import { getBrowser as getBrowserMetadata } from '@/api/ADempiere/dictionary'
import { convertField, isEmptyValue, showMessage } from '@/utils/ADempiere'
import router from '@/router'
import language from '@/lang'
const browser = {
  state: {
    browser: []
  },
  mutations: {
    addBrowser(state, payload) {
      state.browser.push(payload)
    },
    dictionaryResetCacheBrowser(state) {
      state.browser = []
    },
    changeShowedCriteriaBrowser(state, payload) {
      payload.browser.isShowedCriteria = payload.isShowedCriteria
    }
  },
  actions: {
    getBrowserFromServer: ({ commit, dispatch }, parameters) => {
      return new Promise((resolve, reject) => {
        var browserUuid = parameters.containerUuid
        getBrowserMetadata(browserUuid)
          .then(response => {
            const panelType = 'browser'
            var fieldsList = response.getFieldsList()
            const query = response.getQuery()
            const whereClause = response.getWhereclause()
            const additionalAttributes = {
              browserUuid: response.getUuid(),
              browserId: response.getId(),
              containerUuid: response.getUuid(),
              panelType: panelType
            }

            //  Convert from gRPC
            var fieldsRangeList = []
            var isMandatoryParams = false
            fieldsList = fieldsList.map((fieldItem, index) => {
              const someAttributes = {
                ...additionalAttributes,
                fieldListIndex: index
              }
              var field = convertField(fieldItem, someAttributes)
              // Add new field if is range number
              if (field.isRange && field.componentPath === 'NumberBase') {
                var fieldRange = convertField(fieldItem, someAttributes, true)
                if (!isEmptyValue(fieldRange.value)) {
                  fieldRange.isShowedFromUser = true
                }
                fieldsRangeList.push(fieldRange)
              }

              if ((query.includes(`@${field.columnName}@`) ||
                query.includes(`@${field.columnName}_To@`) ||
                whereClause.includes(`@${field.columnName}@`) ||
                whereClause.includes(`@${field.columnName}_To@`)) &&
                field.isQueryCriteria) {
                field.isMandatory = true
                field.isMandatoryFromLogic = true
                field.isShowedFromUser = true
              }

              // Only isQueryCriteria fields, displayed in main panel
              if (field.isQueryCriteria && !isEmptyValue(field.value) && String(field.value) !== '-1') {
                field.isShowedFromUser = true
              }

              // TODO: Evaluate if not change when iterate
              isMandatoryParams = field.isMandatory
              return field
            })
            fieldsList = fieldsList.concat(fieldsRangeList)

            //  Get dependent fields
            fieldsList
              .filter(field => field.parentFieldsList && field.isActive)
              .forEach((field, index, list) => {
                field.parentFieldsList.forEach(parentColumnName => {
                  var parentField = list.find(parentField => {
                    return parentField.columnName === parentColumnName && parentColumnName !== field.columnName
                  })
                  if (parentField) {
                    parentField.dependentFieldsList.push(field.columnName)
                  }
                })
              })

            //  Panel for save on store
            const newBrowser = {
              id: response.getId(),
              uuid: response.getUuid(),
              containerUuid: response.getUuid(),
              value: response.getValue(),
              name: response.getName(),
              description: response.getDescription(),
              help: response.getHelp(),
              // sql query
              query: query,
              whereClause: whereClause,
              orderByClause: response.getOrderbyclause(),
              //
              isUpdateable: response.getIsupdateable(),
              isDeleteable: response.getIsdeleteable(),
              isSelectedByDefault: response.getIsselectedbydefault(),
              isCollapsibleByDefault: response.getIscollapsiblebydefault(),
              isExecutedQueryByDefault: response.getIsexecutedquerybydefault(),
              isShowTotal: response.getIsshowtotal(),
              isActive: response.getIsactive(),
              viewUuid: response.getViewuuid(),
              fieldList: fieldsList,
              panelType: panelType,
              // app attributes
              isMandatoryParams: isMandatoryParams,
              isShowedCriteria: Boolean(fieldsList.length && isMandatoryParams)
            }
            //  Convert from gRPC process list
            const process = response.getProcess()
            var actions = []
            if (process) {
              actions.push({
                name: process.getName(),
                type: 'process',
                uuid: process.getUuid(),
                description: process.getDescription(),
                help: process.getHelp(),
                isReport: process.getIsreport(),
                accessLevel: process.getAccesslevel(),
                showHelp: process.getShowhelp(),
                isDirectPrint: process.getIsdirectprint()
              })

              // TODO: convert gRPC attributes from response.getProcess() to object
              // Add process asociate in store
              // var processStore = rootGetters.getProcess(process.getUuid())
              // if (processStore === undefined) {
              //   dispatch('getProcessFromServer', process.getUuid())
              // }
            }

            dispatch('addPanel', newBrowser)
            commit('addBrowser', newBrowser)

            //  Add process menu
            dispatch('setContextMenu', {
              containerUuid: response.getUuid(),
              relations: [],
              actions: actions,
              references: []
            })
            resolve(newBrowser)
          })
          .catch(error => {
            router.push({ path: '/dashboard' })
            dispatch('tagsView/delView', parameters.routeToDelete)
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
            console.warn('Dictionary Browser - Error ' + error.code + ': ' + error.message)
            reject(error)
          })
      })
    },
    changeShowedCriteriaBrowser: ({ commit, getters }, { containerUuid, isShowedCriteria }) => {
      commit('changeShowedCriteriaBrowser', {
        browser: getters.getBrowser(containerUuid),
        isShowedCriteria: isShowedCriteria
      })
    }
  },
  getters: {
    getBrowser: (state) => (browserUuid) => {
      return state.browser.find(
        item => item.uuid === browserUuid
      )
    }
  }
}

export default browser
