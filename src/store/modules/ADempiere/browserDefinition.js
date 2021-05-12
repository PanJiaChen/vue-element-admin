import { requestBrowserMetadata } from '@/api/ADempiere/dictionary/smart-browser.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
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
    changeBrowserAttribute(state, payload) {
      let value = payload.attributeValue
      if (payload.attributeNameControl) {
        value = payload.browser[payload.attributeNameControl]
      }
      payload.browser[payload.attributeName] = value
    }
  },
  actions: {
    /**
     * Get Smart Browser metadata from server
     * @param {string} containerUuid
     * @param {number} browserId
     * @param {object} routeToDelete, route to close in tagView when fail
     */
    getBrowserFromServer({ commit, dispatch }, {
      containerUuid,
      browserId,
      routeToDelete
    }) {
      return new Promise(resolve => {
        requestBrowserMetadata({
          uuid: containerUuid,
          id: browserId
        })
          .then(browserResponse => {
            const panelType = 'browser'
            const additionalAttributes = {
              containerUuid,
              panelType,
              isEvaluateValueChanges: true
            }
            const {
              query,
              whereClause,
              process
            } = browserResponse

            //  Convert from gRPC
            const fieldsRangeList = []
            let isShowedCriteria = false
            let awaitForValues = 0
            let fieldsList = browserResponse.fields.map((fieldItem, index) => {
              const someAttributes = {
                ...additionalAttributes,
                fieldsListIndex: index
              }
              const field = generateField({
                fieldToGenerate: fieldItem,
                moreAttributes: someAttributes,
                isSOTrxMenu: routeToDelete.meta.isSalesTransaction
              })
              // Add new field if is range number
              if (field.isRange && field.componentPath === 'FieldNumber') {
                const fieldRange = generateField({
                  fieldToGenerate: fieldItem,
                  moreAttributes: someAttributes,
                  typeRange: true
                })
                if (!isEmptyValue(fieldRange.value)) {
                  fieldRange.isShowedFromUser = true
                }
                fieldsRangeList.push(fieldRange)
              }

              // Only isQueryCriteria fields with values, displayed in main panel
              if (field.isQueryCriteria) {
                if (field.isSQLValue) {
                  isShowedCriteria = true
                  field.isShowedFromUser = true
                  awaitForValues++
                }
                if (query.includes(`@${field.columnName}@`) ||
                  query.includes(`@${field.columnName}_To@`) ||
                  whereClause.includes(`@${field.columnName}@`) ||
                  whereClause.includes(`@${field.columnName}_To@`)) {
                  field.isMandatory = true
                  field.isMandatoryFromLogic = true
                  field.isShowedFromUser = true
                }

                if (isEmptyValue(field.value)) {
                  // isMandatory params to showed search criteria
                  if (field.isMandatory || field.isMandatoryFromLogic) {
                    isShowedCriteria = true
                  }
                } else {
                  // with value
                  field.isShowedFromUser = true
                }
              }

              return field
            })
            fieldsList = fieldsList.concat(fieldsRangeList)

            // Panel for save on store
            const newBrowser = {
              ...browserResponse,
              containerUuid,
              fieldsList,
              panelType,
              // app attributes
              awaitForValues, // control to values
              awaitForValuesToQuery: awaitForValues, // get values from request search
              isShowedCriteria,
              isShowedTotals: true
            }

            commit('addBrowser', newBrowser)
            dispatch('addPanel', newBrowser)

            resolve(newBrowser)

            // Convert from gRPC process list
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
                containerUuidAssociated: containerUuid,
                panelTypeAssociated: panelType
              })
              // TODO: No list of parameters
              // // add process associated in vuex store
              // dispatch('addProcessAssociated', {
              //   processToGenerate: process,
              //   containerUuidAssociated: containerUuid
              // })
            }
            // Add process menu
            dispatch('setContextMenu', {
              containerUuid,
              actions
            })
          })
          .catch(error => {
            router.push({
              path: '/dashboard'
            }, () => {})
            dispatch('tagsView/delView', routeToDelete)
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
            console.warn(`Dictionary Browser - Error ${error.code}: ${error.message}.`)
          })
      })
    },
    changeBrowserAttribute({ commit, getters }, {
      containerUuid,
      browser,
      attributeName,
      attributeNameControl,
      attributeValue
    }) {
      if (isEmptyValue(browser)) {
        browser = getters.getBrowser(containerUuid)
      }
      commit('changeBrowserAttribute', {
        browser,
        attributeName,
        attributeValue,
        attributeNameControl
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
