import { getProcess as getProcessMetadata } from '@/api/ADempiere'
import { convertField, isEmptyValue, showMessage } from '@/utils/ADempiere'
import language from '@/lang'
import router from '@/router'

const process = {
  state: {
    process: []
  },
  mutations: {
    addProcess(state, payload) {
      state.process.push(payload)
    },
    dictionaryResetCacheProcess(state) {
      state.process = []
    }
  },
  actions: {
    getProcessFromServer: ({ commit, dispatch }, parameters) => {
      return new Promise((resolve, reject) => {
        var processUuid = parameters.containerUuid
        getProcessMetadata(processUuid)
          .then(response => {
            let panelType = 'process'
            if (response.getIsreport()) {
              panelType = 'report'
            }

            const additionalAttributes = {
              processUuid: response.getUuid(),
              processId: response.getId(),
              containerUuid: response.getUuid(),
              panelType: panelType
            }

            //  Convert from gRPC
            const fieldsRangeList = []
            var fieldDefinitionList = response.getParametersList().map((fieldItem, index) => {
              const someAttributes = {
                ...additionalAttributes,
                fieldListIndex: index
              }
              const field = convertField(fieldItem, someAttributes)
              // Add new field if is range number
              if (field.isRange && field.componentPath === 'FieldNumber') {
                const fieldRange = convertField(fieldItem, someAttributes, true)
                if (!isEmptyValue(fieldRange.value)) {
                  fieldRange.isShowedFromUser = true
                }
                fieldsRangeList.push(fieldRange)
              }

              // if field with value displayed in main panel
              if (!isEmptyValue(field.value)) {
                field.isShowedFromUser = true
              }

              return field
            })
            fieldDefinitionList = fieldDefinitionList.concat(fieldsRangeList)

            //  Get dependent fields
            fieldDefinitionList
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

            //  Get export list
            var reportExportTypeList = response.getReportexporttypesList().map(reportType => {
              return {
                name: reportType.getName(),
                description: reportType.getDescription(),
                reportExportType: reportType.getType()
              }
            })
            //  Default Action
            var actions = []
            actions.push({
              name: language.t('components.RunProcess'),
              processName: response.getName(),
              type: 'action',
              action: 'startProcess',
              uuid: response.getUuid(),
              id: response.getId(),
              description: response.getDescription(),
              help: response.getHelp(),
              isReport: response.getIsreport(),
              accessLevel: response.getAccesslevel(),
              showHelp: response.getShowhelp(),
              isDirectPrint: response.getIsdirectprint(),
              reportExportType: undefined
            }, {
              name: language.t('components.ChangeParameters'),
              processName: response.getName(),
              type: 'process',
              action: 'changeParameters',
              uuid: response.getUuid(),
              id: response.getId(),
              description: response.description,
              help: response.getHelp(),
              isReport: response.getIsreport(),
              accessLevel: response.getAccesslevel(),
              showHelp: response.getShowhelp(),
              isDirectPrint: response.getIsdirectprint()
            })

            var summaryAction = {
              name: language.t('components.RunProcessAs'),
              processName: response.getName(),
              type: 'summary',
              action: '',
              childs: [],
              uuid: response.getUuid(),
              id: response.getId(),
              description: response.getDescription(),
              help: response.getHelp(),
              isReport: response.getIsreport(),
              accessLevel: response.getAccesslevel(),
              showHelp: response.getShowhelp(),
              isDirectPrint: response.getIsdirectprint()
            }
            reportExportTypeList.forEach(actionValue => {
              //  Push values
              summaryAction.childs.push({
                name: language.t('components.ExportTo') + ' (' + actionValue.name + ')',
                processName: response.getName(),
                type: 'action',
                action: 'startProcess',
                uuid: response.getUuid(),
                id: response.getId(),
                description: actionValue.description,
                help: response.getHelp(),
                isReport: response.getIsreport(),
                accessLevel: response.getAccesslevel(),
                showHelp: response.getShowhelp(),
                isDirectPrint: response.getIsdirectprint(),
                reportExportType: actionValue.reportExportType
              })
            })
            //  Add summary Actions
            actions.push(summaryAction)

            var processDefinition = {
              id: response.getId(),
              uuid: response.getUuid(),
              name: response.getName(),
              description: response.getDescription(),
              help: response.getHelp(),
              isReport: response.getIsreport(),
              accessLevel: response.getAccesslevel(),
              showHelp: response.getShowhelp(),
              isDirectPrint: response.getIsdirectprint(),
              reportExportTypeList: reportExportTypeList,
              value: response.getValue(),
              panelType: panelType,
              fieldList: fieldDefinitionList
            }

            dispatch('addPanel', processDefinition)
            commit('addProcess', processDefinition)

            //  Add process menu
            dispatch('setContextMenu', {
              containerUuid: response.getUuid(),
              relations: [],
              actions: actions,
              references: []
            })
            resolve(processDefinition)
          })
          .catch(error => {
            router.push({ path: '/dashboard' })
            dispatch('tagsView/delView', parameters.routeToDelete)
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
            console.warn('Dictionary Process (State) - Error ' + error)
            reject(error)
          })
      })
    }
  },
  getters: {
    getProcess: (state) => (processUuid) => {
      return state.process.find(
        item => item.uuid === processUuid
      )
    },
    getProcessById: (state) => (processId) => {
      return state.process.find(
        item => item.id === parseInt(processId)
      )
    }
  }
}

export default process
