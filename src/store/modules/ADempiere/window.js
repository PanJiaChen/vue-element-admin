import {
  getWindow as getWindowMetadata,
  getTab as getTabMetadata
} from '@/api/ADempiere/dictionary'
import { showMessage } from '@/utils/ADempiere'
import language from '@/lang'
import router from '@/router'
import { generateField, getFieldTemplate } from '@/utils/ADempiere/dictionaryUtils'

const window = {
  state: {
    window: [],
    windowIndex: 0
  },
  mutations: {
    addWindow(state, payload) {
      state.window.push(payload)
      state.windowIndex++
    },
    dictionaryResetCacheWindow(state) {
      state.window = []
      state.windowIndex = 0
    },
    changeShowedDetailWindow(state, payload) {
      payload.window.isShowedDetail = payload.changeShowedDetail
    },
    changeShowedRecordWindow(state, payload) {
      payload.window.isShowedRecordNavigation = payload.isShowedRecordNavigation
    },
    setCurrentTab(state, payload) {
      payload.window.currentTabUuid = payload.tabUuid
    },
    setTabIsLoadField(state, payload) {
      payload.tab.isLoadFieldList = payload.isLoadFieldList
    }
  },
  actions: {
    getWindowFromServer({ commit, state, dispatch }, {
      windowUuid,
      routeToDelete
    }) {
      return getWindowMetadata(windowUuid)
        .then(responseWindow => {
          const firstTab = responseWindow.tabsList[0].tableName
          const firstTabUuid = responseWindow.tabsList[0].uuid
          const childrenTabs = []
          const parentTabs = []

          const tabs = responseWindow.tabsList.map((tabItem, index) => {
            // let tab = tabItem
            const tab = {
              ...tabItem,
              containerUuid: tabItem.uuid,
              parentUuid: windowUuid,
              windowUuid: windowUuid,
              tabGroup: tabItem.fieldGroup,
              firstTabUuid: firstTabUuid,
              // relations
              isParentTab: Boolean(firstTab === tabItem.tableName),
              // app properties
              isShowedRecordNavigation: !(tabItem.isSingleRow),
              isLoadFieldList: false,
              index: index
            }
            delete tab.processesList

            // action is dispatch used in vuex
            let actions = []
            actions.push({
              // action to set default values and enable fields not isUpdateable
              name: language.t('window.newRecord'),
              processName: language.t('window.newRecord'),
              type: 'dataAction',
              action: 'resetPanelToNew',
              uuidParent: responseWindow,
              disabled: !tab.isInsertRecord || tab.isReadOnly
            }, {
              // action to delete record selected
              name: language.t('window.deleteRecord'),
              processName: language.t('window.deleteRecord'),
              type: 'dataAction',
              action: 'deleteEntity',
              uuidParent: responseWindow,
              disabled: tab.isReadOnly
            }, {
              // action to undo create, update, delete record
              name: language.t('data.undo'),
              processName: language.t('data.undo'),
              type: 'dataAction',
              action: 'undoModifyData',
              uuidParent: responseWindow,
              disabled: false
            }, {
              name: language.t('data.lockRecord'),
              processName: language.t('data.lockRecord'),
              type: 'dataAction',
              action: 'lockRecord',
              disabled: false,
              hidden: true,
              tableName: '',
              recordId: null
            }, {
              name: language.t('data.unlockRecord'),
              processName: language.t('data.unlockRecord'),
              type: 'dataAction',
              action: 'unlockRecord',
              disabled: false,
              hidden: true,
              tableName: '',
              recordId: null
            })

            // get processess associated in tab
            if (tabItem.processesList && tabItem.processesList.length) {
              const processList = tabItem.processesList.map(processItem => {
                dispatch('addProcessAssociated', {
                  processToGenerate: processItem,
                  containerUuidAssociated: tabItem.uuid
                })
                return {
                  id: processItem.id,
                  uuid: processItem.uuid,
                  name: processItem.name,
                  type: 'process',
                  description: processItem.description,
                  help: processItem.help,
                  isReport: processItem.isReport,
                  isDirectPrint: processItem.isDirectPrint
                }
              })
              actions = actions.concat(processList)
            }
            //  Add process menu
            dispatch('setContextMenu', {
              containerUuid: tab.uuid,
              relations: [],
              actions: actions,
              references: []
            })

            // TODO: Add support to isSortTab and isTranslationTab
            if (!(tab.isSortTab || tab.isTranslationTab)) {
              if (tab.isParentTab) {
                parentTabs.push(tab)
              } else {
                childrenTabs.push(tab)
              }
            }
            return tab
          }).filter(itemTab => {
            return !(itemTab.isSortTab || itemTab.isTranslationTab)
          })

          const tabProperties = {
            tabsList: tabs,
            currentTab: parentTabs[0],
            tabsListParent: parentTabs,
            tabsListChildren: childrenTabs,
            // app attributes
            isShowedDetail: Boolean(childrenTabs.length),
            currentTabUuid: parentTabs[0].uuid
          }

          const newWindow = {
            ...responseWindow,
            ...tabProperties,
            isShowedRecordNavigation: undefined,
            firstTabUuid: firstTabUuid,
            windowIndex: state.windowIndex + 1
          }
          commit('addWindow', newWindow)
          return newWindow
        })
        .catch(error => {
          router.push({ path: '/dashboard' })
          dispatch('tagsView/delView', routeToDelete)
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn(`Dictionary Window (State Window) - Error ${error.code}: ${error.message}`)
        })
    },
    getTabAndFieldFromServer({ dispatch, getters }, {
      parentUuid,
      containerUuid,
      panelType = 'window',
      isAdvancedQuery = false
    }) {
      return getTabMetadata(containerUuid)
        .then(tabResponse => {
          const additionalAttributes = {
            parentUuid: parentUuid,
            containerUuid: containerUuid,
            isShowedFromUser: true,
            panelType: panelType,
            tableName: tabResponse.tableName,
            //
            isReadOnlyFromForm: false,
            isAdvancedQuery: isAdvancedQuery
          }

          let fieldUuidsequence = 0
          let fieldLinkColumnName
          //  Convert from gRPC
          const fieldsList = tabResponse.fieldsList.map((fieldItem, index) => {
            fieldItem = generateField(fieldItem, {
              ...additionalAttributes,
              fieldListIndex: index
            })
            if (fieldItem.sequence > fieldUuidsequence) {
              fieldUuidsequence = fieldItem.sequence
            }

            if (fieldItem.isParent) {
              fieldLinkColumnName = fieldItem.columnName
            }

            return fieldItem
          })

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

          if (!fieldsList.find(field => field.columnName === 'UUID')) {
            const attributesOverwrite = {
              panelType: panelType,
              sequence: (fieldUuidsequence + 10),
              name: 'UUID',
              columnName: 'UUID',
              isAdvancedQuery: isAdvancedQuery,
              componentPath: 'FieldText'
            }
            const field = getFieldTemplate(attributesOverwrite)
            fieldsList.push(field)
          }

          //  Panel for save on store
          const panel = {
            ...getters.getTab(parentUuid, containerUuid),
            isAdvancedQuery: isAdvancedQuery,
            fieldLinkColumnName: fieldLinkColumnName,
            fieldList: fieldsList,
            panelType: panelType,
            // app attributes
            isShowedTotals: false
          }

          dispatch('addPanel', panel)
          dispatch('setTabIsLoadField', {
            parentUuid: parentUuid,
            containerUuid: containerUuid
          })
          return panel
        })
        .catch(error => {
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn(`Dictionary Tab (State Window) - Error ${error.code}: ${error.message}`)
        })
    },
    changeShowedDetailWindow: ({ commit, state }, params) => {
      const window = state.window.find(itemWindow => {
        return itemWindow.uuid === params.containerUuid
      })
      commit('changeShowedDetailWindow', {
        window: window,
        changeShowedDetail: params.isShowedDetail
      })
    },
    changeShowedRecordWindow: ({ commit, state }, params) => {
      const window = state.window.find(itemWindow => {
        return itemWindow.uuid === params.parentUuid
      })
      commit('changeShowedRecordWindow', {
        window: window,
        isShowedRecordNavigation: params.isShowedRecordNavigation
      })
    },
    /**
     * @param {string} parameters.parentUuid
     * @param {string} parameters.containerUuid
     */
    setCurrentTab: ({ commit, getters }, parameters) => {
      commit('setCurrentTab', {
        window: getters.getWindow(parameters.parentUuid),
        tabUuid: parameters.containerUuid
      })
    },
    setTabIsLoadField: ({ commit, getters }, { parentUuid, containerUuid }) => {
      const tab = getters.getTab(parentUuid, containerUuid)
      commit('setTabIsLoadField', {
        tab: tab,
        isLoadFieldList: true
      })
    }
  },
  getters: {
    getWindow: (state) => (windowUuid) => {
      return state.window.find(
        item => item.uuid === windowUuid
      )
    },
    getIndexWindow: (state) => {
      return state.windowIndex
    },
    getIsShowedRecordNavigation: (state, getters) => (windowUuid) => {
      const window = getters.getWindow(windowUuid)
      if (window) {
        return window.isShowedRecordNavigation
      }
      return window
    },
    getTab: (state, getters) => (windowUuid, tabUuid) => {
      const window = getters.getWindow(windowUuid)
      if (window) {
        return window.tabsList.find(tabItem => {
          return tabItem.uuid === tabUuid
        })
      }
      return window
    },
    getCurrentTab: (state, getters) => (windowUuid) => {
      const window = getters.getWindow(windowUuid)
      if (window) {
        return window.tabsList.find(tabItem => {
          return tabItem.uuid === window.currentTabUuid
        })
      }
      return {
        isInsertRecord: false
      }
    },
    getTabIsLoadField: (state, getters) => (windowUuid, tabUuid) => {
      const tab = getters.getTab(windowUuid, tabUuid)
      if (tab) {
        return tab.isLoadFieldList
      }
      return tab
    },
    getTableNameFromTab: (state, getters) => (windowUuid, tabUuid) => {
      return getters.getTab(windowUuid, tabUuid).tableName
    }
  }
}

export default window
