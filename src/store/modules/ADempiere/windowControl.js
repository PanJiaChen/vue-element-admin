import { createEntity, updateEntity, deleteEntity, getReferencesList, rollbackEntity } from '@/api/ADempiere/data'
import { convertObjectToArrayPairs, convertValuesMapToObject, isEmptyValue, parseContext, showMessage } from '@/utils/ADempiere'
import language from '@/lang'
import router from '@/router'

const windowControl = {
  state: {
    inCreate: [],
    references: [],
    windowRoute: {},
    windowOldRoute: {
      path: '',
      fullPath: '',
      query: {}
    },
    dataLog: {} // { containerUuid, recordId, tableName, eventType }
  },
  mutations: {
    addInCreate(state, payload) {
      state.inCreate.push(payload)
    },
    deleteInCreate(state, payload) {
      state.inCreate = state.inCreate.filter(item => item.containerUuid !== payload.containerUuid)
    },
    addReferencesList(state, payload) {
      state.references.push(payload)
    },
    deleteReference(state, payload) {
      state.references = state.references.filter(itemReference => {
        if (itemReference.parentUuid === payload.windowUuid &&
          itemReference.recordUuid === payload.recordUuid) {
          return false
        }
        return true
      })
    },
    addWindowRoute(state, payload) {
      state.windowRoute = payload
    },
    setDataLog(state, payload) {
      state.dataLog = payload
    },
    setWindowOldRoute(state, payload) {
      state.windowOldRoute = payload
    }
  },
  actions: {
    undoPanelToNew({ dispatch, rootGetters }, parameters) {
      const oldAttributes = rootGetters.getColumnNamesAndValues({
        containerUuid: parameters.containerUuid,
        propertyName: 'oldValue',
        isObjectReturn: true,
        isAddDisplayColumn: true
      })
      dispatch('notifyPanelChange', {
        containerUuid: parameters.containerUuid,
        newValues: oldAttributes
      })
    },
    createNewEntity({ commit, dispatch, getters, rootGetters }, parameters) {
      return new Promise((resolve, reject) => {
        // exists some call to create new record with container uuid
        if (getters.getInCreate(parameters.containerUuid)) {
          return reject({
            error: 0,
            message: `In this panel (${parameters.containerUuid}) is a create new record in progress`
          })
        }

        const panel = rootGetters.getPanel(parameters.containerUuid)
        // delete key from attributes
        const finalAttributes = rootGetters.getColumnNamesAndValues({
          containerUuid: parameters.containerUuid,
          propertyName: 'value',
          isEvaluateValues: true,
          isAddDisplayColumn: true
        })

        commit('addInCreate', {
          containerUuid: parameters.containerUuid,
          tableName: panel.tableName,
          attributesList: finalAttributes
        })
        createEntity({
          tableName: panel.tableName,
          attributesList: finalAttributes
        })
          .then(response => {
            var newValues = convertValuesMapToObject(response.getValuesMap())
            finalAttributes.forEach(element => {
              if (element.columnName.includes('DisplayColumn')) {
                newValues[element.columnName] = element.value
              }
            })

            showMessage({
              message: language.t('data.createRecordSuccessful'),
              type: 'success'
            })

            // update fields with new values
            dispatch('notifyPanelChange', {
              parentUuid: parameters.parentUuid,
              containerUuid: parameters.containerUuid,
              newValues: newValues,
              isSendToServer: false
            })
            dispatch('addNewRow', {
              parentUuid: parameters.parentUuid,
              containerUuid: parameters.containerUuid,
              isPanelValues: true,
              isEdit: false
            })

            // set data log to undo action
            const fieldId = panel.fieldList.find(itemField => itemField.isKey)
            dispatch('setDataLog', {
              containerUuid: parameters.containerUuid,
              tableName: panel.tableName,
              recordId: fieldId.value, // TODO: Verify performance with tableName_ID
              recordUuid: newValues.UUID,
              eventType: 'INSERT'
            })

            const oldRoute = router.app._route
            router.push({
              name: oldRoute.name,
              query: {
                ...oldRoute.query,
                action: response.getUuid()
              }
            })
            dispatch('tagsView/delView', oldRoute, true)

            resolve({
              data: newValues,
              recordUuid: response.getUuid(),
              recordId: response.getId(),
              tableName: response.getTablename()
            })
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            console.warn('Create Entity error: ' + error.message)
            reject(error)
          })
          .finally(() => {
            commit('deleteInCreate', {
              containerUuid: parameters.containerUuid,
              tableName: panel.tableName,
              attributesList: finalAttributes
            })
          })
      })
    },
    createEntityFromTable({ commit, getters, rootGetters }, parameters) {
      const { containerUuid, row } = parameters
      // exists some call to create new record with container uuid
      if (getters.getInCreate(containerUuid)) {
        return {
          error: 0,
          message: `In this panel (${containerUuid}) is a create new record in progress.`
        }
      }
      const panel = rootGetters.getPanel(containerUuid)

      // TODO: Add support to Binary columns (BinaryData)
      const columnsToDontSend = ['BinaryData', 'isSendServer', 'isEdit']

      // attributes or fields
      var finalAttributes = convertObjectToArrayPairs(row)
      finalAttributes = finalAttributes.filter(itemAttribute => {
        if (isEmptyValue(itemAttribute.value)) {
          return false
        }
        if (columnsToDontSend.includes(itemAttribute.columnName) || itemAttribute.columnName.includes('DisplayColumn')) {
          return false
        }
        return true
      })

      commit('addInCreate', {
        containerUuid: parameters.containerUuid,
        tableName: panel.tableName,
        attributesList: finalAttributes
      })
      return createEntity({
        tableName: panel.tableName,
        attributesList: finalAttributes
      })
        .then(response => {
          const newValues = convertValuesMapToObject(response.getValuesMap())

          const result = {
            data: newValues,
            recordUuid: response.getUuid(),
            recordId: response.getId(),
            tableName: response.getTablename()
          }
          showMessage({
            message: language.t('data.createRecordSuccessful'),
            type: 'success'
          })
          if (panel.isParentTab) {
            // redirect to create new record
            const oldRoute = router.app._route
            router.push({
              name: oldRoute.name,
              query: {
                ...oldRoute.query,
                action: result.recordUuid
              }
            })
          }
          return result
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn('Create Entity Table Error ' + error.code + ': ' + error.message)
        })
        .finally(() => {
          commit('deleteInCreate', {
            containerUuid: containerUuid,
            tableName: panel.tableName,
            attributesList: finalAttributes
          })
        })
    },
    updateCurrentEntity({ commit, dispatch, rootGetters }, {
      containerUuid,
      recordUuid = null
    }) {
      const panel = rootGetters.getPanel(containerUuid)
      if (!recordUuid) {
        recordUuid = rootGetters.getUuid(containerUuid)
      }

      // TODO: Add support to Binary columns (BinaryData)
      const columnsToDontSend = ['Account_Acct']

      // attributes or fields
      var finalAttributes = rootGetters.getColumnNamesAndValues({
        containerUuid: containerUuid,
        isEvaluatedChangedValue: true
      })

      finalAttributes = finalAttributes.filter(itemAttribute => {
        if (columnsToDontSend.includes(itemAttribute.columnName) || itemAttribute.columnName.includes('DisplayColumn')) {
          return false
        }
        const field = panel.fieldList.find(itemField => itemField.columnName === itemAttribute.columnName)
        if (!field || !field.isUpdateable || !field.isDisplayed) {
          return false
        }
        return true
      })

      return updateEntity({
        tableName: panel.tableName,
        recordUuid: recordUuid,
        attributesList: finalAttributes
      })
        .then(response => {
          const newValues = convertValuesMapToObject(response.getValuesMap())
          const responseConvert = {
            data: newValues,
            id: response.getId(),
            uuid: recordUuid,
            tableName: panel.tableName
          }

          // set data log to undo action
          const fieldId = panel.fieldList.find(itemField => itemField.isKey)
          dispatch('setDataLog', {
            containerUuid: containerUuid,
            tableName: panel.tableName,
            recordId: fieldId.value, // TODO: Verify performance with tableName_ID
            recordUuid: newValues.UUID,
            eventType: 'UPDATE'
          })

          commit('setRecordDetail', responseConvert)
          return newValues
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn('Update Entity Error ' + error.code + ': ' + error.message)
        })
    },
    updateCurrentEntityFromTable({ rootGetters }, parameters) {
      const panel = rootGetters.getPanel(parameters.containerUuid)

      // TODO: Add support to Binary columns (BinaryData)
      const columnsToDontSend = ['BinaryData', 'isSendServer', 'isEdit']

      // attributes or fields
      var finalAttributes = convertObjectToArrayPairs(parameters.row)
      finalAttributes = finalAttributes.filter(itemAttribute => {
        if (columnsToDontSend.includes(itemAttribute.columnName) || itemAttribute.columnName.includes('DisplayColumn')) {
          return false
        }
        const field = panel.fieldList.find(itemField => itemField.columnName === itemAttribute.columnName)
        if (!field || !field.isUpdateable || !field.isDisplayed) {
          return false
        }
        return true
      })

      return updateEntity({
        tableName: panel.tableName,
        recordUuid: parameters.row.UUID,
        attributesList: finalAttributes
      })
        .then(response => {
          return response
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn('Update Entity Table Error ' + error.code + ': ' + error.message)
        })
    },
    /**
     * Update record after run process associated with window
     * @param {object} parameters
     * @param {string} parameters.parentUuid
     * @param {string} parameters.containerUuid
     * @param {object} parameters.tab
     */
    updateRecordAfterRunProcess({ dispatch, rootGetters }, parameters) {
      const recordUuid = rootGetters.getUuid(parameters.containerUuid)
      // get new values
      dispatch('getEntity', {
        parentUuid: parameters.parentUuid,
        containerUuid: parameters.containerUuid,
        tableName: parameters.tab.tableName,
        recordUuid: recordUuid
      })
        .then(response => {
          // update panel
          if (parameters.tab.isParentTab) {
            dispatch('notifyPanelChange', {
              parentUuid: parameters.parentUuid,
              containerUuid: parameters.containerUuid,
              newValues: response,
              isSendToServer: false
            })
          }
          // update row in table
          dispatch('notifyRowTableChange', {
            parentUuid: parameters.parentUuid,
            containerUuid: parameters.containerUuid,
            row: response,
            isEdit: false
          })
        })
    },
    deleteEntity({ dispatch, rootGetters }, parameters) {
      return new Promise((resolve, reject) => {
        const panel = rootGetters.getPanel(parameters.containerUuid)
        const recordUuid = rootGetters.getUuid(parameters.containerUuid)

        deleteEntity({
          tableName: panel.tableName,
          recordUuid: recordUuid
        })
          .then(response => {
            const oldRoute = router.app._route

            // refresh record list
            dispatch('getDataListTab', {
              parentUuid: parameters.parentUuid,
              containerUuid: parameters.containerUuid
            })
              .then(response => {
                // if response is void, go to new record
                if (response.length <= 0) {
                  dispatch('resetPanelToNew', {
                    parentUuid: parameters.parentUuid,
                    containerUuid: parameters.containerUuid,
                    panelType: 'window',
                    isNewRecord: true
                  })
                } else {
                  // else display first record of table in panel
                  router.push({
                    name: oldRoute.name,
                    query: {
                      ...oldRoute.query,
                      action: response[0].UUID
                    }
                  })
                }
              })
            showMessage({
              message: language.t('data.deleteRecordSuccessful'),
              type: 'success'
            })

            // set data log to undo action
            const fieldId = panel.fieldList.find(itemField => itemField.isKey)
            dispatch('setDataLog', {
              containerUuid: parameters.containerUuid,
              tableName: panel.tableName,
              recordId: fieldId.value, // TODO: Verify performance with tableName_ID
              recordUuid: parameters.recordUuid,
              eventType: 'DELETE'
            })

            resolve(response)
          })
          .catch(error => {
            showMessage({
              message: language.t('data.deleteRecordError'),
              type: 'error'
            })
            console.warn('Delete Entity - Error ', error.message, ', Code:', error.code)
            reject(error)
          })
      })
    },
    /**
     * Delete selection records in table
     * @param {string} containerUuid
     * @param {string} parentUuid
     */
    deleteSelectionDataList({ dispatch, rootGetters }, parameters) {
      const { parentUuid, containerUuid } = parameters
      const tab = rootGetters.getTab(parentUuid, containerUuid)
      var allData = rootGetters.getDataRecordAndSelection(containerUuid)
      var selectionLength = allData.selection.length

      allData.selection.forEach((record, index) => {
        // validate if the registry row has no uuid before sending to the server
        if (isEmptyValue(record.UUID)) {
          selectionLength = selectionLength - 1
          console.warn(`This row does not contain a record with UUID`, record)
          // refresh record list
          dispatch('getDataListTab', {
            parentUuid: parentUuid,
            containerUuid: containerUuid
          })
          return
        }
        deleteEntity({
          tableName: tab.tableName,
          recordUuid: record.UUID
        })
          .then(() => {
            if (tab.isParentTab) {
              // redirect to create new record
              const oldRoute = router.app._route
              if (record.UUID === oldRoute.query.action) {
                router.push({
                  name: oldRoute.name,
                  query: {
                    ...oldRoute.query,
                    action: 'create-new'
                  }
                })
                // clear fields with default values
                dispatch('resetPanelToNew', {
                  parentUuid: parentUuid,
                  containerUuid: containerUuid
                })
                // delete view with uuid record delete
                dispatch('tagsView/delView', oldRoute, true)
              }
            }

            if ((index + 1) >= selectionLength) {
              // refresh record list
              dispatch('getDataListTab', {
                parentUuid: parentUuid,
                containerUuid: containerUuid
              })
              showMessage({
                message: language.t('data.deleteRecordSuccessful'),
                type: 'success'
              })
            }
          })
      })
    },
    undoModifyData({ getters }, parameters) {
      const { containerUuid, recordUuid } = parameters
      return rollbackEntity(getters.getDataLog(containerUuid, recordUuid))
        .then(response => {
          console.log('rollback successfull', response)
          return response
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn('Rollback Entity error: ' + error.message)
        })
    },
    setDataLog({ commit }, parameters) {
      commit('setDataLog', {
        containerUuid: parameters.containerUuid,
        tableName: parameters.tableName,
        recordId: parameters.recordId,
        recordUuid: parameters.recordUuid,
        eventType: parameters.eventType
      })
    },
    /**
     * Get data to table in tab
     * @param {string}  parentUuid, window to search record data
     * @param {string}  containerUuid, tab to search record data
     * @param {string}  recordUuid, uuid to search
     * @param {boolean} isRefreshPanel, if main panel is updated with new response data
     * @param {boolean} isLoadAllRecords, if main panel is updated with new response data
     */
    getDataListTab({ dispatch, rootGetters }, parameters) {
      const {
        parentUuid,
        containerUuid,
        recordUuid,
        isRefreshPanel = false,
        isLoadAllRecords = false,
        isReference = false,
        referenceWhereClause = '',
        columnName,
        value
      } = parameters
      const tab = rootGetters.getTab(parentUuid, containerUuid)

      var parsedQuery = tab.query
      if (!isEmptyValue(parsedQuery) && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid: parentUuid,
          containerUuid: containerUuid,
          value: tab.query
        }, true)
      }

      var parsedWhereClause = tab.whereClause
      if (!isEmptyValue(parsedWhereClause) && parsedWhereClause.includes('@')) {
        parsedWhereClause = parseContext({
          parentUuid: parentUuid,
          containerUuid: containerUuid,
          value: tab.whereClause
        }, true)
      }

      if (isReference) {
        if (!isEmptyValue(parsedWhereClause)) {
          parsedWhereClause += ' AND ' + referenceWhereClause
        } else {
          parsedWhereClause += referenceWhereClause
        }
      }

      var conditions = []
      if (tab.isParentTab && !isEmptyValue(tab.tableName) && !isEmptyValue(value)) {
        conditions.push({
          columnName: columnName,
          value: value
        })
      }
      return dispatch('getObjectListFromCriteria', {
        parentUuid: tab.parentUuid,
        containerUuid: containerUuid,
        tableName: tab.tableName,
        query: parsedQuery,
        whereClause: parsedWhereClause,
        orderByClause: tab.orderByClause,
        // TODO: evaluate if overwrite values to conditions
        conditions: isLoadAllRecords ? [] : conditions,
        isParentTab: tab.isParentTab
      })
        .then(response => {
          if (isRefreshPanel && !isEmptyValue(recordUuid) && recordUuid !== 'create-new') {
            const newValues = response.find(itemData => itemData.UUID === recordUuid)
            if (newValues) {
              // update fields with values obtained from the server
              dispatch('notifyPanelChange', {
                parentUuid: tab.parentUuid,
                containerUuid: containerUuid,
                newValues: newValues,
                isSendToServer: false
              })
            } else {
              // this record is missing (Deleted or the query does not include it)
              dispatch('resetPanelToNew', {
                parentUuid: tab.parentUuid,
                containerUuid: containerUuid
              })
            }
          }
          return response
        })
        .catch(error => {
          return error
        })
    },
    /**
     * Get references asociate to record
     * @param {string} parameters.parentUuid
     * @param {string} parameters.containerUuid
     * @param {string} parameters.recordUuid
     */
    getReferencesListFromServer({ commit, rootGetters }, parameters) {
      // TODO: check if you get better performance search only the window and get the current tab
      const tab = rootGetters.getTab(parameters.parentUuid, parameters.containerUuid)
      return new Promise((resolve, reject) => {
        getReferencesList({
          windowUuid: parameters.parentUuid,
          tableName: tab.tableName,
          recordUuid: parameters.recordUuid
        })
          .then(response => {
            const referencesList = response.getReferencesList().map(item => {
              return {
                uuid: item.getUuid(),
                windowUuid: item.getWindowuuid(),
                displayName: item.getDisplayname(),
                tableName: item.getTablename(),
                whereClause: item.getWhereclause(),
                recordCount: item.getRecordcount(),
                recordUuid: parameters.recordUuid,
                type: 'reference'
              }
            })
            const references = {
              windowUuid: parameters.parentUuid,
              recordUuid: parameters.recordUuid,
              recordCount: response.getRecordcount(),
              referencesList: referencesList,
              nextPageToken: response.getNextPageToken()
            }
            commit('addReferencesList', references)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getWindowByUuid({ dispatch, commit }, parameters) {
      parameters.routes.forEach((routeItem) => {
        if (routeItem.meta && routeItem.meta.uuid === parameters.windowUuid) {
          commit('addWindowRoute', routeItem)
        } else if (routeItem.meta && routeItem.meta.childs && routeItem.meta.childs.length > 0) {
          dispatch('getWindowByUuid', { routes: routeItem.meta.childs, windowUuid: parameters.windowUuid })
        }
      })
    },
    setWindowOldRoute({ commit }, oldPath = { path: '', fullPath: '', query: {}}) {
      commit('setWindowOldRoute', oldPath)
    }
  },
  getters: {
    getInCreate: (state) => (containerUuid) => {
      return state.inCreate.find(item => item.containerUuid === containerUuid)
    },
    getReferencesList: (state) => (windowUuid, recordUuid) => {
      return state.references.find(item => item.windowUuid === windowUuid && item.recordUuid === recordUuid)
    },
    getReferencesInfo: (state, getters) => (windowUuid, recordUuid, referenceUuid) => {
      const references = getters.getReferencesList(windowUuid, recordUuid)
      return references.referencesList.find(item => item.uuid === referenceUuid)
    },
    getWindowRoute: (state) => (windowUuid) => {
      if (state.windowRoute && state.windowRoute.meta && state.windowRoute.meta.uuid === windowUuid) {
        return state.windowRoute
      }
    },
    getDataLog: (state) => (containerUuid, recordUuid) => {
      const current = state.dataLog
      if (current.containerUuid === containerUuid &&
        ((current.recordUuid === recordUuid) ||
        (current.eventType === 'DELETE' && recordUuid === 'create-new'))) {
        return current
      }
      return undefined
    }
  }
}

export default windowControl
