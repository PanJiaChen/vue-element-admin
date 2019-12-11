// Vuex file for store all related to panel and fields
// Use it for handle events for changes and put context, also can be
// used for hadle isDisplayed logic, read only logic and mandatory logic
// The scope is use panel as storage of:
// - Window: Just need storage tab and fields
// - Process & Report: Always save a panel and parameters
// - Smart Browser: Can have a search panel, table panel and process panel
import { isEmptyValue, parsedValueComponent } from '@/utils/ADempiere/valueUtils'
import evaluator, { parseContext } from '@/utils/ADempiere/contextUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { assignedGroup, fieldIsDisplayed } from '@/utils/ADempiere/dictionaryUtils'
import router from '@/router'
import language from '@/lang'

const panel = {
  state: {
    panel: []
  },
  mutations: {
    addPanel(state, payload) {
      state.panel.push(payload)
    },
    changeFieldLogic(state, payload) {
      if (payload.isDisplayedFromLogic !== undefined) {
        payload.field.isDisplayedFromLogic = payload.isDisplayedFromLogic
      }
      if (payload.isMandatoryFromLogic !== undefined) {
        payload.field.isMandatoryFromLogic = payload.isMandatoryFromLogic
      }
      if (payload.isReportFromLogic !== undefined) {
        payload.field.isReportFromLogic = payload.isReportFromLogic
      }
    },
    dictionaryResetCache(state) {
      state.panel = []
    },
    changePanel(state, payload) {
      payload.panel = payload.newPanel
    },
    changeFieldList(state, payload) {
      payload.fieldList = payload.newFieldList
    },
    changeFieldValue(state, payload) {
      payload.field.oldValue = payload.field.value
      payload.field.value = payload.newValue
      if (payload.isChangedOldValue) {
        payload.field.oldValue = payload.newValue
      }

      payload.field.valueTo = payload.valueTo
      payload.field.displayColumn = payload.displayColumn
    },
    changeFieldValueToNull(state, payload) {
      payload.field.oldValue = payload.value
      payload.field.value = payload.value
      payload.field.valueTo = payload.value
      payload.field.displayColumn = payload.value
    }
  },
  actions: {
    addPanel({ commit, dispatch, getters }, params) {
      let keyColumn = ''
      let selectionColumn = []
      let identifierColumns = []
      let count = 0
      params.fieldList.forEach(itemField => {
        if (itemField.isKey) {
          keyColumn = itemField.columnName
        }
        if (itemField.isSelectionColumn) {
          selectionColumn.push(itemField.columnName)
        }
        if (itemField.isIdentifier) {
          identifierColumns.push({
            columnName: itemField.columnName,
            identifierSequence: itemField.identifierSequence,
            componentPath: itemField.componentPath
          })
        }

        if (params.panelType === 'table' || params.isAdvancedQuery) {
          itemField.isShowedFromUser = false
          if (count < 2 && itemField.isSelectionColumn && itemField.sequence >= 10) {
            itemField.isShowedFromUser = true
            count++
          }
        } else {
          if (params.isParentTab) {
            dispatch('setContext', {
              parentUuid: params.parentUuid,
              containerUuid: params.uuid,
              columnName: itemField.columnName,
              value: itemField.value
            })
          }
        }
      })

      params.keyColumn = keyColumn
      if (params.isSortTab) {
        const panelParent = getters.getPanel(params.tabAssociatedUuid)
        selectionColumn = selectionColumn.concat(panelParent.selectionColumn)
        identifierColumns = identifierColumns.concat(panelParent.identifierColumns)
        params.fieldLinkColumnName = panelParent.fieldLinkColumnName
        params.keyColumn = panelParent.keyColumn
      }
      params.selectionColumn = selectionColumn
      params.identifierColumns = identifierColumns
        .sort((itemA, itemB) => {
          return itemA.identifierSequence - itemB.identifierSequence
        })

      params.recordUuid = null
      params.fieldList = assignedGroup(params.fieldList)

      commit('addPanel', params)
    },
    /**
     * Used by components/fields/filterFields
     */
    changeFieldShowedFromUser({ commit, dispatch, getters }, params) {
      const panel = getters.getPanel(params.containerUuid, params.isAdvancedQuery)
      var newPanel = panel
      var showsFieldsWithValue = false
      var hiddenFieldsWithValue = false
      var newFields = panel.fieldList.map(itemField => {
        const isMandatory = itemField.isMandatory || itemField.isMandatoryFromLogic
        if (!isMandatory && fieldIsDisplayed(itemField)) {
          if (itemField.groupAssigned === params.groupField) {
            if (params.fieldsUser.length && params.fieldsUser.includes(itemField.columnName)) {
              // if it isShowedFromUser it is false, and it has some value, it means
              // that it is going to show, therefore the SmartBrowser must be searched
              if (!isEmptyValue(itemField.value) && !itemField.isShowedFromUser) {
                showsFieldsWithValue = true
              }
              if (params.isAdvancedQuery) {
                itemField.isShowedFromUser = false
              }
              itemField.isShowedFromUser = true
              return itemField
            }
            // if it isShowedFromUser it is true, and it has some value, it means
            // that it is going to hidden, therefore the SmartBrowser must be searched
            if (!isEmptyValue(itemField.value) && itemField.isShowedFromUser) {
              hiddenFieldsWithValue = true
            }
            if (params.isAdvancedQuery) {
              itemField.isShowedFromUser = false
            }
            itemField.isShowedFromUser = false
          }
        } else {
          if (itemField.groupAssigned === params.groupField) {
            if (params.fieldsUser.length && params.fieldsUser.includes(itemField.columnName)) {
              // if it isShowedFromUser it is false, and it has some value, it means
              // that it is going to show, therefore the SmartBrowser must be searched
              if (!isEmptyValue(itemField.value) && !itemField.isShowedFromUser) {
                showsFieldsWithValue = true
              }
              if (params.isAdvancedQuery) {
                itemField.isShowedFromUser = false
              }
              itemField.isShowedFromUser = true
              return itemField
            }
            if (!isEmptyValue(itemField.value) && itemField.isShowedFromUser) {
              hiddenFieldsWithValue = true
            }
            if (params.isAdvancedQuery) {
              itemField.isShowedFromUser = false
            }
            itemField.isShowedFromUser = false
          }
        }
        return itemField
      })
      panel.fieldList = newFields
      commit('changePanel', {
        containerUuid: params.containerUuid,
        newPanel: newPanel,
        panel: panel
      })
      if (showsFieldsWithValue || hiddenFieldsWithValue) {
        // Updated record result
        if (panel.panelType === 'browser') {
          dispatch('getBrowserSearch', {
            containerUuid: panel.uuid,
            isClearSelection: true
          })
        } else if (panel.panelType === 'table' && panel.isAdvancedQuery) {
          dispatch('getObjectListFromCriteria', {
            parentUuid: panel.parentUuid,
            containerUuid: panel.uuid,
            tableName: panel.tableName,
            query: panel.query,
            whereClause: panel.whereClause,
            conditions: getters.getParametersToServer({
              containerUuid: params.containerUuid,
              isAdvancedQuery: true,
              isEvaluateMandatory: false
            })
          })
            .catch(error => {
              console.warn('Error getting Advanced Query (changeFieldShowedFromUser):', error.message + '. Code: ', error.code)
            })
        }
      }
    },
    /**
     * Change some attribute boolean from fields in panel
     * @param {string}  containerUuid
     * @param {string}  fieldList
     * @param {string}  attribute
     * @param {boolean} valueAttribute
     * @param {array}   fieldsIncludes fields to set valueAttribute
     * @param {array}   fieldsExcludes fields to dont change
     */
    changeFieldAttributesBoolean({ commit, getters }, parameters) {
      const { containerUuid, attribute, valueAttribute, fieldsIncludes, fieldsExcludes } = parameters
      var { fieldList = [] } = parameters
      if (fieldList.length <= 0) {
        fieldList = getters.getFieldsListFromPanel(containerUuid)
      }

      var newFields = fieldList.map(itemField => {
        // not change exlude field
        if (fieldsExcludes && fieldsExcludes.length && fieldsExcludes.includes(itemField.columnName)) {
          return itemField
        }
        // if it field is included to change value
        if (fieldsIncludes && fieldsIncludes.length && fieldsIncludes.includes(itemField.columnName)) {
          itemField[attribute] = valueAttribute
          return itemField
        }
        // changed current value by opposite set value
        itemField[attribute] = !valueAttribute
        return itemField
      })
      commit('changeFieldList', {
        fieldList: fieldList,
        newFieldList: newFields
      })
    },
    /**
     * @param {string}  containerUuid
     * @param {array}   fieldList
     */
    showOnlyMandatoryColumns({ dispatch, getters }, parameters) {
      const { containerUuid } = parameters
      var { fieldList = [] } = parameters
      if (fieldList.length <= 0) {
        fieldList = getters.getFieldsListFromPanel(containerUuid)
      }
      const fieldsExcludes = fieldList.filter(fieldItem => {
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
        if (isMandatory) {
          return true
        }
      }).map(fieldItem => {
        return fieldItem.columnName
      })

      dispatch('changeFieldAttributesBoolean', {
        containerUuid: containerUuid,
        fieldsIncludes: fieldsExcludes,
        attribute: 'isShowedTableFromUser',
        valueAttribute: true
      })
    },
    /**
     * @param {string}  containerUuid
     * @param {array}   fieldList
     */
    showAllAvailableColumns({ dispatch, getters }, parameters) {
      const { containerUuid } = parameters
      var { fieldList = [] } = parameters
      if (fieldList.length <= 0) {
        fieldList = getters.getFieldsListFromPanel(containerUuid)
      }
      const fieldsExcludes = fieldList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed && fieldItem.isDisplayedFromLogic && !fieldItem.isKey
        //  Verify for displayed and is active
        return fieldItem.isActive && isDisplayed
      }).map(fieldItem => {
        return fieldItem.columnName
      })

      dispatch('changeFieldAttributesBoolean', {
        containerUuid: containerUuid,
        fieldsIncludes: fieldsExcludes,
        attribute: 'isShowedTableFromUser',
        valueAttribute: true
      })
    },
    /**
     * Set default values to panel
     * @param {string} containerUuid
     * @param {string} panelType
     * TODO: Evaluate if it is necessary to parse the default values
     */
    resetPanelToNew({ commit, dispatch, getters }, parameters) {
      const { parentUuid, containerUuid, panelType = 'window', isNewRecord = false } = parameters
      var { fieldList = [] } = parameters

      const defaultAttributes = getters.getParsedDefaultValues({
        parentUuid: parentUuid,
        containerUuid: containerUuid
      })
      if (panelType === 'window' && isNewRecord) {
        // redirect to create new record
        const oldRoute = router.app._route
        router.push({
          name: oldRoute.name,
          query: {
            ...oldRoute.query,
            action: 'create-new'
          }
        })
        showMessage({
          message: language.t('data.createNewRecord'),
          type: 'info'
        })

        if (!fieldList.length) {
          fieldList = getters.getFieldsListFromPanel(containerUuid)
        }
        fieldList.forEach(fieldToBlanck => {
          commit('changeFieldValueToNull', {
            field: fieldToBlanck,
            value: undefined
          })
        })

        // delete records tabs children when change record uuid
        dispatch('deleteRecordContainer', {
          viewUuid: parentUuid,
          withOut: [containerUuid],
          isNew: true
        })
      }
      dispatch('notifyPanelChange', {
        parentUuid: parentUuid,
        containerUuid: containerUuid,
        panelType: panelType,
        newValues: defaultAttributes,
        isSendToServer: false,
        // if isNewRecord active callouts, if window is closed no send callout
        isSendCallout: isNewRecord,
        isPrivateAccess: false
      })
    },
    /**
     * Changed panel when receive or reset panel to new record
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {object} fieldList, field list of panel
     * @param {object} newValues, values to set in panel
     * @param {boolean} isSendToServer, indicate if changes send to server
     */
    notifyPanelChange({ dispatch, getters, rootGetters }, parameters) {
      const {
        parentUuid,
        containerUuid,
        newValues = {},
        isSendToServer = true,
        isShowedField = false,
        panelType = 'window',
        withOutColumnNames = [],
        isSendCallout = true,
        isAdvancedQuery = false,
        isPrivateAccess = true
      } = parameters
      var { fieldList = [] } = parameters

      if (!fieldList.length) {
        fieldList = getters.getFieldsListFromPanel(containerUuid, isAdvancedQuery)
      }
      var fieldsShowed = []
      fieldList.forEach(actionField => {
        if (actionField.isShowedFromUser) {
          fieldsShowed.push(actionField.columnName)
        }

        // Evaluate with hasOwnProperty if exits this value
        if (!newValues.hasOwnProperty(actionField.columnName)) {
          return
        }
        dispatch('notifyFieldChange', {
          isSendToServer: isSendToServer,
          isSendCallout: isSendCallout,
          isAdvancedQuery: isAdvancedQuery,
          panelType: panelType,
          parentUuid: parentUuid,
          containerUuid: containerUuid,
          columnName: actionField.columnName,
          displayColumn: newValues['DisplayColumn_' + actionField.columnName],
          newValue: newValues[actionField.columnName],
          valueTo: newValues[actionField.columnName + '_To'],
          fieldList: fieldList,
          field: actionField,
          withOutColumnNames: withOutColumnNames,
          isChangedOldValue: true // defines if set oldValue with newValue instead of current value
        })
      })
      if (isShowedField && Object.keys(newValues).length) {
        // join column names without duplicating it
        fieldsShowed = Array.from(new Set([
          ...fieldsShowed,
          ...Object.keys(newValues)
        ]))

        dispatch('changeFieldAttributesBoolean', {
          parentUuid: parentUuid,
          containerUuid: containerUuid,
          attribute: 'isShowedFromUser',
          valueAttribute: true,
          fieldsIncludes: fieldsShowed
        })
      }
      if (panelType === 'window') {
        dispatch('setIsloadContext', {
          containerUuid: containerUuid
        })
        if (isPrivateAccess) {
          var tableName = rootGetters.getTableNameFromTab(parentUuid, containerUuid)
          dispatch('getPrivateAccessFromServer', {
            tableName: tableName,
            recordId: newValues[`${tableName}_ID`],
            userUuid: rootGetters['user/getUserUuid']
          })
        }
      }
    },
    /**
     * TODO: Add fieldAttributes
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} panelType
     * @param {boolean} isAdvancedQuery
     * @param {string} columnName
     * @param {mixin} newValue
     * @param {mixin} valueTo
     * @param {string} displayColumn, only used for lookup
     * @param {boolean} isSendToServer
     * @param {boolean} isSendCallout
     * @param {boolean} isSendToQuery
     * @param {boolean} isChangedOldValue
     * @param {array} withOutColumnNames
     */
    notifyFieldChange({ commit, dispatch, getters }, {
      parentUuid, containerUuid, panelType = 'window', isAdvancedQuery = false, columnName,
      newValue, valueTo, displayColumn,
      isSendToServer = true, isSendCallout = true, isSendToQuery = true,
      isChangedOldValue = false, withOutColumnNames = []
    }) {
      const panel = getters.getPanel(containerUuid, isAdvancedQuery)
      var fieldList = panel.fieldList
      // get field
      var field = fieldList.find(fieldItem => fieldItem.columnName === columnName)

      newValue = parsedValueComponent({
        fieldType: field.componentPath,
        referenceType: field.referenceType,
        value: newValue
      })

      if (field.isRange) {
        valueTo = parsedValueComponent({
          fieldType: field.componentPath,
          referenceType: field.referenceType,
          value: valueTo
        })
      }

      if (!(panelType === 'table' || isAdvancedQuery)) {
        //  Call context management
        dispatch('setContext', {
          parentUuid: parentUuid,
          containerUuid: containerUuid,
          columnName: columnName,
          value: newValue
        })

        // request context info field
        if (!isEmptyValue(field.value) && !isEmptyValue(field.contextInfo) && !isEmptyValue(field.contextInfo.sqlStatement)) {
          var isSQL = false
          var sqlStatement = field.contextInfo.sqlStatement
          if (sqlStatement.includes('@')) {
            if (sqlStatement.includes('@SQL=')) {
              isSQL = true
            }
            sqlStatement = parseContext({
              parentUuid: parentUuid,
              containerUuid: containerUuid,
              columnName: columnName,
              value: sqlStatement,
              isSQL: isSQL
            })
            if (isSQL && String(sqlStatement) === '[object Object]') {
              sqlStatement = sqlStatement.query
            }
          }
          dispatch('getContextInfoValueFromServer', {
            parentUuid: parentUuid,
            containerUuid: containerUuid,
            contextInfoUuid: field.contextInfo.uuid,
            columnName: columnName,
            sqlStatement: sqlStatement
          })
            .then(response => {
              if (!isEmptyValue(response) && !isEmptyValue(response.messageText)) {
                field.contextInfo.isActive = true
                field.contextInfo.messageText.msgText = response.messageText
                field.contextInfo.messageText.msgTip = response.messageTip
              }
            })
        }
      }

      // the field has not changed, then the action is broken
      if (newValue === field.value && isEmptyValue(displayColumn)) {
        return
      }

      commit('changeFieldValue', {
        field: field,
        newValue: newValue,
        valueTo: valueTo,
        displayColumn: displayColumn,
        isChangedOldValue: isChangedOldValue
      })

      //  Change Dependents
      const dependents = fieldList.filter(fieldItem => {
        return field.dependentFieldsList.includes(fieldItem.columnName)
      })
      //  Iterate for change logic
      dependents.forEach(dependent => {
        //  isDisplayed Logic
        let isDisplayedFromLogic, isMandatoryFromLogic, isReadOnlyFromLogic
        if (dependent.displayLogic.trim() !== '') {
          isDisplayedFromLogic = evaluator.evaluateLogic({
            context: getters,
            parentUuid: parentUuid,
            containerUuid: containerUuid,
            logic: dependent.displayLogic,
            type: 'displayed'
          })
        }
        //  Mandatory Logic
        if (dependent.mandatoryLogic.trim() !== '') {
          isMandatoryFromLogic = evaluator.evaluateLogic({
            context: getters,
            parentUuid: parentUuid,
            containerUuid: containerUuid,
            logic: dependent.mandatoryLogic
          })
        }
        //  Read Only Logic
        if (dependent.readOnlyLogic.trim() !== '') {
          isReadOnlyFromLogic = evaluator.evaluateLogic({
            context: getters,
            parentUuid: parentUuid,
            containerUuid: containerUuid,
            logic: dependent.readOnlyLogic
          })
        }
        commit('changeFieldLogic', {
          field: dependent,
          isDisplayedFromLogic: isDisplayedFromLogic,
          isMandatoryFromLogic: isMandatoryFromLogic,
          isReadOnlyFromLogic: isReadOnlyFromLogic
        })
      })

      // request callouts
      if (field.panelType === 'window' && isSendCallout) {
        if (!withOutColumnNames.includes(field.columnName) && !isEmptyValue(newValue) && !isEmptyValue(field.callout)) {
          withOutColumnNames.push(field.columnName)
          dispatch('getCallout', {
            parentUuid: parentUuid,
            containerUuid: containerUuid,
            tableName: panel.tableName,
            columnName: field.columnName,
            callout: field.callout,
            value: newValue,
            oldValue: field.oldValue,
            withOutColumnNames: withOutColumnNames
          })
        }
      }

      if (isSendToServer) {
        // TODO: refactory for it and change for a standard method
        if (!getters.isNotReadyForSubmit(containerUuid)) {
          if (field.panelType === 'browser' && fieldIsDisplayed(field)) {
            dispatch('getBrowserSearch', {
              containerUuid: containerUuid,
              isClearSelection: true
            })
          }
          if (field.panelType === 'window' && fieldIsDisplayed(field)) {
            var uuid = getters.getUuid(containerUuid)
            if (isEmptyValue(uuid)) {
              dispatch('createNewEntity', {
                parentUuid: parentUuid,
                containerUuid: containerUuid
              })
                .then(() => {
                  // change old value so that it is not send in the next update
                  commit('changeFieldValue', {
                    field: field,
                    newValue: newValue,
                    valueTo: valueTo,
                    displayColumn: displayColumn,
                    isChangedOldValue: true
                  })
                })
                .catch(error => {
                  showMessage({
                    message: error.message,
                    type: 'error'
                  })
                  console.warn('Create Entity Error ' + error.code + ': ' + error.message)
                })
            } else {
              dispatch('updateCurrentEntity', {
                containerUuid: containerUuid,
                recordUuid: uuid
              })
                .then(response => {
                  // change old value so that it is not send in the next update
                  showMessage({
                    message: language.t('notifications.updateFields') + field.name,
                    type: 'success'
                  })
                  commit('changeFieldValue', {
                    field: field,
                    newValue: newValue,
                    valueTo: valueTo,
                    displayColumn: displayColumn,
                    isChangedOldValue: true
                  })

                  // change value in table
                  dispatch('notifyRowTableChange', {
                    containerUuid: containerUuid,
                    row: response,
                    isEdit: false,
                    isParent: true
                  })
                })
            }
          }
        } else {
          const fieldsEmpty = getters.getFieldListEmptyMandatory({
            containerUuid: containerUuid
          })
          showMessage({
            message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
            type: 'info'
          })
        }
      } else {
        if (panelType === 'table' || isAdvancedQuery) {
          if (field.isShowedFromUser) {
            // change action to advanced query on field value is changed in this panel
            if (router.currentRoute.query.action !== 'advancedQuery') {
              router.push({
                query: {
                  ...router.currentRoute.query,
                  action: 'advancedQuery'
                }
              })
            }
            dispatch('getObjectListFromCriteria', {
              parentUuid: parentUuid,
              containerUuid: containerUuid,
              tableName: panel.tableName,
              query: panel.query,
              whereClause: panel.whereClause,
              conditions: getters.getParametersToServer({
                containerUuid: containerUuid,
                isAdvancedQuery: true,
                isEvaluateMandatory: false
              })
            })
              .catch(error => {
                console.warn('Error getting Advanced Query (notifyFieldChange):', error.message + '. Code: ', error.code)
              })
          }
        }
      }
    },
    notifyFieldChangeDisplayColumn({ commit, getters }, parameters) {
      var field = getters.getFieldFromColumnName(parameters.containerUuid, parameters.columnName)
      var newField = {
        field: field,
        newValue: field.value,
        valueTo: field.valueTo,
        displayColumn: parameters.displayColumn
      }
      commit('changeFieldValue', newField)
    },
    getPanelAndFields({ dispatch }, parameters) {
      if (parameters.panelType === 'process' || parameters.panelType === 'report') {
        return dispatch('getProcessFromServer', parameters)
          .then(response => {
            return response
          })
          .catch(error => {
            return {
              ...error,
              moreInfo: `Dictionary getPanelAndFields ${parameters.panelType} (State Panel)`,
              parameters: parameters
            }
          })
      } else if (parameters.panelType === 'browser') {
        return dispatch('getBrowserFromServer', parameters)
          .then(response => {
            return response
          })
          .catch(error => {
            return {
              ...error,
              moreInfo: 'Dictionary getPanelAndFields browser (State Panel)',
              parameters: parameters
            }
          })
      } else if (parameters.panelType === 'window' || parameters.panelType === 'table') {
        return dispatch('getTabAndFieldFromServer', {
          parentUuid: parameters.parentUuid,
          containerUuid: parameters.containerUuid,
          isAdvancedQuery: parameters.isAdvancedQuery,
          panelType: parameters.panelType
        }).then(response => {
          return response
        }).catch(error => {
          return {
            ...error,
            moreInfo: 'Dictionary getPanelAndFields Window (State Panel)',
            parameters: parameters
          }
        })
      }
    },
    showedTotals({ commit, getters }, containerUuid) {
      const panel = getters.getPanel(containerUuid)
      const newPanel = panel
      newPanel.isShowedTotals = !panel.isShowedTotals
      commit('changePanel', {
        panel: panel,
        newPanel: newPanel
      })
    },
    dictionaryResetCache({ commit }) {
      commit('dictionaryResetCache')
      commit('dictionaryResetCacheContext')
      commit('dictionaryResetCacheContextMenu')
      commit('dictionaryResetCacheWindow')
      commit('dictionaryResetCacheProcess')
      commit('dictionaryResetCacheBrowser')
    }
  },
  getters: {
    getPanel: (state) => (containerUuid, isAdvancedQuery = false) => {
      return state.panel.find(item => {
        return item.uuid === containerUuid && (!isAdvancedQuery || (isAdvancedQuery && item.isAdvancedQuery))
      })
    },
    getFieldsListFromPanel: (state, getters) => (containerUuid, isAdvancedQuery = false) => {
      const panel = getters.getPanel(containerUuid, isAdvancedQuery)
      if (panel === undefined) {
        return []
      }
      return panel.fieldList
    },
    getFieldFromColumnName: (state, getters) => (containerUuid, columnName) => {
      return getters.getFieldsListFromPanel(containerUuid).find(itemField => itemField.columnName === columnName)
    },
    /**
     * Determinate if panel is ready fron send, all fiedls mandatory and displayed with values
     * @param {string}  containerUuid
     * @param {object}  row, data to compare if is table
     * @returns {object}
     */
    isNotReadyForSubmit: (state, getters) => (containerUuid, row) => {
      const field = getters.getFieldsListFromPanel(containerUuid).find(fieldItem => {
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
        var value = fieldItem.value
        // used when evaluate data in table
        if (row) {
          value = row[fieldItem.columnName]
        }
        if (fieldIsDisplayed(fieldItem) && isMandatory && isEmptyValue(value)) {
          return true
        }
      })

      return field
    },
    getEmptyMandatory: (state, getters) => (containerUuid) => {
      return getters.getFieldsListFromPanel(containerUuid).find(itemField => {
        if ((itemField.isMandatory || itemField.isMandatoryFromLogic) && isEmptyValue(itemField.value)) {
          return true
        }
      })
    },
    // Obtain empty obligatory fields
    getFieldListEmptyMandatory: (state, getters) => (parameters) => {
      const { containerUuid, evaluateShowed = true, row } = parameters
      // all optionals (not mandatory) fields
      var fieldList = getters.getFieldsListFromPanel(containerUuid).filter(fieldItem => {
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
        if (isMandatory) {
          const isDisplayed = fieldIsDisplayed(fieldItem)
          if (evaluateShowed) {
            return isDisplayed
          }
          return isMandatory
        }
      })
      fieldList = fieldList.filter(fieldItem => {
        var value = fieldItem.value
        // used when evaluate data in table
        if (row) {
          value = row[fieldItem.columnName]
        }
        if (isEmptyValue(value)) {
          return true
        }
      })
      return fieldList.map(fieldItem => {
        return fieldItem.name
      })
    },
    // all available fields not mandatory to show, used in components panel/filterFields.vue
    getFieldsListNotMandatory: (state, getters) => (containerUuid, evaluateShowed = true) => {
      // all optionals (not mandatory) fields
      return getters.getFieldsListFromPanel(containerUuid).filter(fieldItem => {
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
        if (!isMandatory) {
          const isDisplayed = fieldIsDisplayed(fieldItem)
          if (evaluateShowed) {
            return isDisplayed
          }
          return !isMandatory
        }
      })
    },
    getUuid: (state, getters) => (containerUuid) => {
      const fieldUuid = getters.getColumnNamesAndValues({
        containerUuid: containerUuid,
        isObjectReturn: true,
        isAddDisplayColumn: true
      })

      if (fieldUuid) {
        return fieldUuid.UUID
      }
      return undefined
    },
    /**
     * @param {string}  containerUuid, unique identifier of the panel to search your list of fields
     * @param {string}  propertyName, property name to return its value (value, oldValue)
     * @param {boolean} isObjectReturn, define if is an object to return, else arraylist return
     * @param {boolean} isEvaluateValues, define if evaluate emty values
     * @param {boolean} isAddDisplayColumn, define if return display columns
     * @param {boolean} isAddRangeColumn, define if return rangue columns_To
     * @param {array} withOut, define if return display columns
     * @param {array} isEvaluatedChangedValue, define if return only fields with values changes
     * @returns {array|object}
     */
    getColumnNamesAndValues: (state, getters) => ({
      containerUuid,
      propertyName = 'value',
      isObjectReturn = false,
      isEvaluateValues = false,
      isAddDisplayColumn = false,
      isAddRangeColumn = false,
      withOut = [],
      isEvaluatedChangedValue = false,
      fieldList = []
    }) => {
      if (!fieldList.length) {
        fieldList = getters.getFieldsListFromPanel(containerUuid)
      }

      let attributesList = fieldList
      const attributesObject = {}
      const displayColumnsList = []
      const rangeColumnsList = []
      if (withOut.length || isEvaluatedChangedValue || isEvaluateValues) {
        attributesList = attributesList.filter(fieldItem => {
          // columns to exclude
          if (withOut.includes(fieldItem.columnName)) {
            return false
          }
          // if value is changed
          if (isEvaluatedChangedValue && fieldItem.value === fieldItem.oldValue) {
            return false
          }
          // TODO: Evaluate valueTo for range
          if (isEvaluateValues && isEmptyValue(fieldItem.value)) {
            return false
          }
          return true
        })
      }

      attributesList = attributesList
        .map(fieldItem => {
          const valueToReturn = fieldItem[propertyName]
          attributesObject[fieldItem.columnName] = valueToReturn

          // Add display columns if field has value
          if (fieldItem[propertyName] && fieldItem.displayColumn) {
            attributesObject[`DisplayColumn_${fieldItem.columnName}`] = fieldItem.displayColumn
            displayColumnsList.push({
              columnName: `DisplayColumn_${fieldItem.columnName}`,
              value: fieldItem.displayColumn
            })
          }

          // add range columns
          if (isAddRangeColumn && fieldItem.isRange) {
            attributesObject[`${fieldItem.columnName}_To`] = fieldItem.valueTo
            rangeColumnsList.push({
              columnName: `${fieldItem.columnName}_To`,
              value: fieldItem.valueTo
            })
          }

          return {
            columnName: fieldItem.columnName,
            value: valueToReturn
          }
        })

      if (isAddDisplayColumn) {
        attributesList = attributesList.concat(displayColumnsList, rangeColumnsList)
      }

      if (isObjectReturn) {
        return attributesObject
      }
      return attributesList
    },
    getParsedDefaultValues: (state, getters) => ({
      parentUuid,
      containerUuid,
      isGetServer = true,
      fieldList = []
    }) => {
      if (!fieldList.length) {
        fieldList = getters.getFieldsListFromPanel(containerUuid)
      }
      var attributesObject = {}

      fieldList
        .map(fieldItem => {
          let isSQL = false
          let valueToReturn = fieldItem.parsedDefaultValue
          if (String(fieldItem.defaultValue).includes('@')) {
            if (String(fieldItem.defaultValue).includes('@SQL=') && isGetServer) {
              isSQL = true
            }
            valueToReturn = parseContext({
              parentUuid: parentUuid,
              containerUuid: containerUuid,
              columnName: fieldItem.columnName,
              value: fieldItem.defaultValue,
              isSQL: isSQL
            })
          }

          valueToReturn = parsedValueComponent({
            fieldType: fieldItem.componentPath,
            referenceType: fieldItem.referenceType,
            isMandatory: fieldItem.isMandatory,
            value: valueToReturn
          })
          attributesObject[fieldItem.columnName] = valueToReturn

          // add display column to default
          if (fieldItem.componentPath === 'FieldSelect' && fieldItem.value === valueToReturn) {
            attributesObject['DisplayColumn_' + fieldItem.columnName] = fieldItem.displayColumn
          }

          return {
            columnName: fieldItem.columnName,
            value: valueToReturn,
            isSQL: isSQL
          }
        })
      return attributesObject
    },
    getFieldsIsDisplayed: (state, getters) => (containerUuid) => {
      const fieldList = getters.getFieldsListFromPanel(containerUuid)
      var fieldsIsDisplayed = []
      var fieldsNotDisplayed = []
      if (fieldList.length) {
        fieldsIsDisplayed = fieldList.filter(itemField => {
          const isMandatory = itemField.isMandatory && itemField.isMandatoryFromLogic
          if (fieldIsDisplayed(itemField) && (isMandatory || itemField.isShowedFromUser)) {
            return true
          }
          fieldsNotDisplayed.push(itemField)
        })
      }
      return {
        fieldIsDisplayed: fieldsIsDisplayed,
        fieldsNotDisplayed: fieldsNotDisplayed,
        totalField: fieldList.length,
        isDisplayed: Boolean(fieldsIsDisplayed.length)
      }
    },
    getParametersToShare: (state, getters) => ({
      containerUuid,
      withOut = [],
      isOnlyDisplayed = false,
      isAdvancedQuery = false
    }) => {
      var fieldList = getters.getFieldsListFromPanel(containerUuid, isAdvancedQuery)
      var attributesListLink = ''
      if (withOut.length) {
        fieldList = fieldList.filter(fieldItem => {
          // columns to exclude
          if (withOut.includes(fieldItem.columnName)) {
            return false
          }
          return true
        })
      }

      if (isOnlyDisplayed) {
        fieldList = fieldList.filter(fieldItem => {
          const isMandatory = Boolean(fieldItem.isMandatory || fieldItem.isMandatoryFromLogic) && !isAdvancedQuery
          const isDisplayed = fieldIsDisplayed(fieldItem) && (fieldItem.isShowedFromUser || isMandatory)
          if (isDisplayed) {
            return true
          }
          return false
        })
      }

      fieldList.map(fieldItem => {
        // assign values
        var value = fieldItem.value
        var valueTo = fieldItem.valueTo

        if (!isEmptyValue(value)) {
          if (['FieldDate', 'FieldTime'].includes(fieldItem.componentPath)) {
            value = value.getTime()
          }
          attributesListLink += `${fieldItem.columnName}=${encodeURIComponent(value)}&`
        }

        if (fieldItem.isRange && !isEmptyValue(valueTo)) {
          if (['FieldDate', 'FieldTime'].includes(fieldItem.componentPath)) {
            valueTo = valueTo.getTime()
          }
          attributesListLink += `${fieldItem.columnName}_To=${encodeURIComponent(valueTo)}&`
        }
      })

      return attributesListLink.slice(0, -1)
    },
    /**
     * get field list visible and with values
     * TODO: Deprecated, change by getColumnNamesAndValues
     */
    getPanelParameters: (state, getters) => (containerUuid, isEvaluateEmptyDisplayed = false, withOut = [], isAdvancedQuery) => {
      if (isAdvancedQuery) {
        var panel = getters.getPanel(containerUuid, isAdvancedQuery)
      } else {
        panel = getters.getPanel(containerUuid)
      }
      const fieldList = panel.fieldList
      const fields = fieldList.length
      var params = []
      var fieldsMandatory = []
      var isEmptyFieldDisplayed = false // indicate if exists a field displayed and empty value

      if (fields > 0) {
        params = fieldList.filter(fieldItem => {
          // columns to exclude
          if (withOut.find(subItem => subItem === fieldItem.columnName)) {
            return false
          }

          const isMandatory = Boolean(fieldItem.isMandatory || fieldItem.isMandatoryFromLogic)
          const isDisplayed = fieldIsDisplayed(fieldItem) && (fieldItem.isShowedFromUser || isMandatory)

          // mandatory fields
          if (isMandatory) {
            fieldsMandatory.push(fieldItem)
          }
          if (!isEmptyValue(fieldItem.value) && isDisplayed) {
            return true
          }
          // empty value
          if (isMandatory && isEvaluateEmptyDisplayed) {
            isEmptyFieldDisplayed = true
          }
          return false
        })

        if (isEvaluateEmptyDisplayed && isEmptyFieldDisplayed) {
          return {
            fields: fields,
            params: [],
            fieldsMandatory: fieldsMandatory
          }
        }
      }
      return {
        fields: fields,
        params: params,
        fieldsMandatory: fieldsMandatory
      }
    },
    /**
     * Getter converter selection params with value format
     * [{ columname: name key, value: value to send }]
     */
    getParametersToServer: (state, getters) => ({
      containerUuid,
      row,
      fieldList = [],
      withOutColumnNames = [],
      isEvaluateDisplayed = true,
      isEvaluateMandatory = true,
      isConvertedDateToTimestamp = false,
      isAdvancedQuery = false
    }) => {
      if (fieldList.length <= 0) {
        fieldList = getters.getFieldsListFromPanel(containerUuid, isAdvancedQuery)
      }
      var parametersRange = []

      // filter fields
      var parametersList = fieldList
        .filter(fieldItem => {
          // columns to exclude
          if (withOutColumnNames.includes(fieldItem.columnName)) {
            return false
          }

          // exclude key column if is new
          if (row && row.isNew && fieldItem.isKey) {
            return false
          }

          const isMandatory = Boolean(fieldItem.isMandatory || fieldItem.isMandatoryFromLogic)
          // mandatory fields
          if (isEvaluateMandatory && fieldItem.panelType !== 'browser') {
            if (isMandatory && !isAdvancedQuery) {
              return true
            }
          }

          // evaluate displayed fields
          if (isEvaluateDisplayed) {
            var isDisplayed = fieldIsDisplayed(fieldItem) && (fieldItem.isShowedFromUser || isMandatory)
            if (isAdvancedQuery) {
              isDisplayed = fieldItem.isShowedFromUser
            }

            if (isDisplayed) {
              if (row) {
                if (!isEmptyValue(row[fieldItem.columnName])) {
                  return true
                }
              } else {
                if (!isEmptyValue(fieldItem.value)) {
                  return true
                }
              }
            }
          }

          return false
        })

      // conever parameters
      parametersList = parametersList
        .map(parameterItem => {
          var value = row ? row[parameterItem.columnName] : parameterItem.value
          var valueTo = row ? row[`${parameterItem.columnName}_To`] : parameterItem.valueTo

          if (isConvertedDateToTimestamp) {
            if (['FieldDate', 'FieldTime'].includes(parameterItem.componentPath) &&
              Object.prototype.toString.call(value) === '[object Date]') {
              value = value.getTime()
              if (valueTo) {
                valueTo = valueTo.getTime()
              }
            }
          }
          // only to fields type Time, Datea and DateTime
          if (parameterItem.isRange && parameterItem.componentPath !== 'FieldNumber') {
            parametersRange.push({
              columnName: `${parameterItem.columnName}_To`,
              value: valueTo
            })
          }

          return {
            columnName: parameterItem.columnName,
            value: value
          }
        })

      parametersList = parametersList.concat(parametersRange)
      return parametersList
    }
  }
}

export default panel
