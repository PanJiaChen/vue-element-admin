import { getBrowser as getBrowserMetadata } from '@/api/ADempiere/dictionary'
import { isEmptyValue, showMessage } from '@/utils/ADempiere'
import { generateField } from '@/utils/ADempiere/dictionaryUtils'
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
    getBrowserFromServer({ commit, dispatch }, {
      containerUuid,
      routeToDelete
    }) {
      return new Promise((resolve, reject) => {
        getBrowserMetadata(containerUuid)
          .then(browserResponse => {
            const panelType = 'browser'
            const additionalAttributes = {
              containerUuid: browserResponse.uuid,
              panelType: panelType
            }
            const {
              query,
              whereClause,
              process
            } = browserResponse

            //  Convert from gRPC
            const fieldsRangeList = []
            let isMandatoryParams = false
            let fieldsList = browserResponse.fieldsList.map((fieldItem, index) => {
              const someAttributes = {
                ...additionalAttributes,
                fieldListIndex: index
              }
              const field = generateField(fieldItem, someAttributes)
              // Add new field if is range number
              if (field.isRange && field.componentPath === 'FieldNumber') {
                const fieldRange = generateField(fieldItem, someAttributes, true)
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
              ...browserResponse,
              containerUuid: browserResponse.uuid,
              fieldList: fieldsList,
              panelType: panelType,
              // app attributes
              isMandatoryParams: isMandatoryParams,
              isShowedCriteria: Boolean(fieldsList.length && isMandatoryParams),
              isShowedTotals: true
            }
            //  Convert from gRPC process list
            const actions = []
            if (process) {
              actions.push({
                type: 'process',
                panelType: 'process',
                uuid: process.uuid,
                name: process.name,
                description: process.description,
                isReport: process.isReport,
                isDirectPrint: process.isDirectPrint,
                containerUuidAssociated: newBrowser.uuid,
                panelTypeAssociated: panelType
              })
              // TODO: No list of parameters
              // // add process associated in vuex store
              // dispatch('addProcessAssociated', {
              //   processToGenerate: process,
              //   containerUuidAssociated: newBrowser.uuid
              // })
            }

            dispatch('addPanel', newBrowser)
            commit('addBrowser', newBrowser)

            //  Add process menu
            dispatch('setContextMenu', {
              containerUuid: browserResponse.uuid,
              relations: [],
              actions: actions,
              references: []
            })
            resolve(newBrowser)
          })
          .catch(error => {
            router.push({ path: '/dashboard' })
            dispatch('tagsView/delView', routeToDelete)
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
            console.warn(`Dictionary Browser - Error ${error.code}: ${error.message}`)
            reject(error)
          })
      })
    },
    changeShowedCriteriaBrowser({ commit, getters }, {
      containerUuid,
      isShowedCriteria
    }) {
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
