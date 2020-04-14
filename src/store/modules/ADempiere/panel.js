// Vuex file for store all related to panel and fields
// Use it for handle events for changes and put context, also can be
// used for hadle isDisplayed logic, read only logic and mandatory logic
// The scope is use panel as storage of:
// - Window: Just need storage tab and fields
// - Process & Report: Always save a panel and parameters
// - Smart Browser: Can have a search panel, table panel and process panel
import { isEmptyValue, parsedValueComponent } from '@/utils/ADempiere/valueUtils'
import evaluator, { getContext, parseContext } from '@/utils/ADempiere/contextUtils'
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
    changePanel(state, payload) {
      payload.panel = payload.newPanel
    },
    changeFieldLogic(state, payload) {
      if (payload.isDisplayedFromLogic !== undefined && payload.isDisplayedFromLogic !== null) {
        payload.field.isDisplayedFromLogic = Boolean(payload.isDisplayedFromLogic)
      }
      payload.field.isMandatoryFromLogic = Boolean(payload.isMandatoryFromLogic)
      payload.field.isReadOnlyFromLogic = Boolean(payload.isReadOnlyFromLogic)
      payload.field.parsedDefaultValue = payload.parsedDefaultValue
    },
    dictionaryResetCache(state) {
      state.panel = []
    },
    changeField(state, payload) {
      payload.field = payload.newField
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

      if (params.fieldList) {
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
            if (['browser', 'process', 'report'].includes(params.panelType) ||
              params.panelType === 'window' && params.isParentTab) {
              dispatch('setContext', {
                parentUuid: params.parentUuid,
                containerUuid: params.uuid,
                columnName: itemField.columnName,
                value: itemField.value
              })
            }
          }
        })

        let orderBy = 'sequence'
        if ((params.panelType === 'window' && !params.isParentTab) || params.panelType === 'browser') {
          orderBy = 'seqNoGrid'
        }
        params.fieldList = assignedGroup({
          fieldsList: params.fieldList,
          orderBy
        })
      }

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
      // show/hidden optionals columns to table
      params.isShowedTableOptionalColumns = false

      commit('addPanel', params)
    },
    /**
     * Used by components/fields/filterFields
     */
    changeFieldShowedFromUser({ commit, dispatch, getters }, {
      containerUuid,
      isAdvancedQuery,
      fieldsUser,
      groupField
    }) {
      const panel = getters.getPanel(containerUuid, isAdvancedQuery)
      const newPanel = panel
      let isChangedDisplayedWithValue = false
      newPanel.fieldList = panel.fieldList.map(itemField => {
        const isShowedOriginal = itemField.isShowedFromUser
        if (groupField === itemField.groupAssigned) {
          itemField.isShowedFromUser = false
          if (fieldsUser.includes(itemField.columnName)) {
            itemField.isShowedFromUser = true
          }
        }

        if (!isChangedDisplayedWithValue) {
          // if isShowedFromUser was changed, and field has some value, the SmartBrowser
          // or AdvancedQuery  must send the parameters to update the search result
          if ((isShowedOriginal !== itemField.isShowedFromUser && !isEmptyValue(itemField.value)) ||
            (isAdvancedQuery && ['NULL', 'NOT_NULL'].includes(itemField.operator))) {
            isChangedDisplayedWithValue = true
          }
        }
        return itemField
      })

      commit('changePanel', {
        panel,
        newPanel
      })

      if (isChangedDisplayedWithValue) {
        // Updated record result
        if (panel.panelType === 'browser') {
          dispatch('getBrowserSearch', {
            containerUuid,
            isClearSelection: true
          })
        } else if (panel.panelType === 'table' || panel.isAdvancedQuery) {
          dispatch('getObjectListFromCriteria', {
            parentUuid: panel.parentUuid,
            containerUuid,
            tableName: panel.tableName,
            query: panel.query,
            whereClause: panel.whereClause,
            conditionsList: getters.getParametersToServer({
              containerUuid,
              isAdvancedQuery,
              isEvaluateMandatory: false
            })
          })
            .catch(error => {
              console.warn(`Error getting Advanced Query (changeFieldShowedFromUser): ${error.message}. Code: ${error.code}.`)
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
    changeFieldAttributesBoolean({ commit, getters }, {
      containerUuid,
      isAdvancedQuery = false,
      attribute,
      valueAttribute,
      fieldsIncludes = [],
      fieldsExcludes = []
    }) {
      const panel = getters.getPanel(containerUuid, isAdvancedQuery)
      const newPanel = panel

      newPanel.fieldList = panel.fieldList.map(itemField => {
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

      commit('changePanel', {
        panel,
        newPanel
      })
    },
    /**
     * @param {string}  containerUuid
     * @param {array}   fieldsList
     */
    showOnlyMandatoryColumns({ dispatch, getters }, {
      containerUuid,
      fieldsList = []
    }) {
      if (fieldsList.length <= 0) {
        fieldsList = getters.getFieldsListFromPanel(containerUuid)
      }
      const fieldsIncludes = fieldsList.filter(fieldItem => {
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
        if (isMandatory) {
          return true
        }
      }).map(fieldItem => {
        return fieldItem.columnName
      })

      dispatch('changeFieldAttributesBoolean', {
        containerUuid,
        fieldsIncludes,
        attribute: 'isShowedTableFromUser',
        valueAttribute: true
      })
    },
    /**
     * @param {string}  containerUuid
     * @param {array}   fieldList
     */
    showAllAvailableColumns({ dispatch, getters }, {
      containerUuid,
      fieldsList = []
    }) {
      if (fieldsList.length <= 0) {
        fieldsList = getters.getFieldsListFromPanel(containerUuid)
      }
      const fieldsIncludes = fieldsList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed && fieldItem.isDisplayedFromLogic && !fieldItem.isKey
        //  Verify for displayed and is active
        return fieldItem.isActive && isDisplayed
      }).map(fieldItem => {
        return fieldItem.columnName
      })

      dispatch('changeFieldAttributesBoolean', {
        containerUuid,
        fieldsIncludes,
        attribute: 'isShowedTableFromUser',
        valueAttribute: true
      })
    },
    /**
     * Set default values to panel
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * @param {string}  panelType
     * @param {boolean} isNewRecord
     * @param {array}   fieldList
     * TODO: Evaluate if it is necessary to parse the default values
     */
    resetPanelToNew({ commit, dispatch, getters }, {
      parentUuid,
      containerUuid,
      panelType = 'window',
      isNewRecord = false
    }) {
      return new Promise(resolve => {
        const panel = getters.getPanel(containerUuid)
        const defaultAttributes = getters.getParsedDefaultValues({
          parentUuid,
          containerUuid,
          fieldsList: panel.fieldList
        })

        if (panelType === 'window' && isNewRecord) {
          // redirect to create new record
          const oldRoute = router.app._route
          router.push({
            name: oldRoute.name,
            params: {
              ...oldRoute.params
            },
            query: {
              ...oldRoute.query,
              action: 'create-new'
            }
          })
          showMessage({
            message: language.t('data.createNewRecord'),
            type: 'info'
          })

          panel.fieldList.forEach(fieldToBlank => {
            if (isEmptyValue(fieldToBlank.parsedDefaultValue)) {
              commit('changeFieldValueToNull', {
                field: fieldToBlank,
                value: undefined
              })
            }
          })

          if (panel.isTabsChildren) {
            // delete records tabs children when change record uuid
            dispatch('deleteRecordContainer', {
              viewUuid: parentUuid,
              withOut: [containerUuid],
              isNew: true
            })
          }
        }

        dispatch('notifyPanelChange', {
          parentUuid,
          containerUuid,
          panelType,
          fieldList: panel.fieldList,
          newValues: defaultAttributes,
          isSendToServer: false,
          // if isNewRecord active callouts, if window is closed no send callout
          isSendCallout: isNewRecord,
          isPrivateAccess: false
        })
          .then(() => {
            if (['process', 'report'].includes(panelType)) {
              const fieldsUser = panel.fieldList.filter(itemField => {
                return itemField.isShowedFromUserDefault || !isEmptyValue(itemField.value)
              }).map(itemField => {
                return itemField.columnName
              })

              dispatch('changeFieldShowedFromUser', {
                containerUuid,
                fieldsUser,
                groupField: ''
              })
            }
          })
        resolve(defaultAttributes)
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
    notifyPanelChange({ dispatch, getters, rootGetters }, {
      parentUuid,
      containerUuid,
      newValues = {},
      isSendToServer = true,
      isShowedField = false,
      panelType = 'window',
      withOutColumnNames = [],
      isSendCallout = true,
      isAdvancedQuery = false,
      isPrivateAccess = false,
      fieldList = [],
      isChangeFromCallout = false,
      isChangeMultipleFields = true
    }) {
      return new Promise(resolve => {
        if (!fieldList.length) {
          fieldList = getters.getFieldsListFromPanel(containerUuid, isAdvancedQuery)
        }
        let fieldsShowed = []
        const promisessList = []
        fieldList.map(async actionField => {
          if (actionField.isShowedFromUser) {
            fieldsShowed.push(actionField.columnName)
          }

          // Evaluate with hasOwnProperty if exits this value
          if (!newValues.hasOwnProperty(actionField.columnName)) {
            return
          }

          if (isChangeFromCallout &&
            actionField.componentPath === 'FieldSelect' &&
            !newValues.hasOwnProperty(`DisplayColumn_${actionField.columnName}`)) {
            let lookup = rootGetters.getLookupItem({
              parentUuid,
              containerUuid,
              directQuery: actionField.reference.directQuery,
              tableName: actionField.reference.tableName,
              value: newValues[actionField.columnName]
            })

            if (isEmptyValue(lookup) && !isEmptyValue(newValues[actionField.columnName])) {
              lookup = await dispatch('getLookupItemFromServer', {
                parentUuid,
                containerUuid,
                tableName: actionField.reference.tableName,
                directQuery: actionField.reference.parsedDirectQuery,
                value: newValues[actionField.columnName]
              })
            }
            if (!isEmptyValue(lookup)) {
              newValues[`DisplayColumn_${actionField.columnName}`] = lookup.label
            }
          }

          promisessList.push(dispatch('notifyFieldChange', {
            isSendToServer,
            isSendCallout,
            isAdvancedQuery,
            panelType,
            parentUuid,
            containerUuid,
            columnName: actionField.columnName,
            displayColumn: newValues[`DisplayColumn_${actionField.columnName}`],
            newValue: newValues[actionField.columnName],
            valueTo: newValues[`${actionField.columnName}_To`],
            fieldList,
            field: actionField,
            withOutColumnNames,
            isChangedOldValue: true, // defines if set oldValue with newValue instead of current value
            isChangeMultipleFields
          }))
        })

        Promise.all(promisessList)
          .then(response => {
            resolve()
            const calloutsToExecute = []
            if (isSendCallout) {
              response.forEach(item => {
                if (item && !isEmptyValue(item.field.callout) &&
                  !withOutColumnNames.includes(item.field.columnName)) {
                  withOutColumnNames.push(item.field.columnName)
                  calloutsToExecute.push({
                    parentUuid,
                    containerUuid,
                    tableName: item.tableName,
                    columnName: item.field.columnName,
                    callout: item.field.callout,
                    value: item.newValue,
                    oldValue: item.field.oldValue,
                    withOutColumnNames
                  })
                }
              })
            }

            calloutsToExecute.map(async executeCallout => {
              await dispatch('getCallout', {
                ...executeCallout
              })
            })
          })

        // show fields in query
        if (isShowedField && !isEmptyValue(newValues)) {
          // join column names without duplicating it
          fieldsShowed = Array.from(new Set([
            ...fieldsShowed,
            ...Object.keys(newValues)
          ]))

          dispatch('changeFieldAttributesBoolean', {
            containerUuid,
            attribute: 'isShowedFromUser',
            valueAttribute: true,
            fieldsIncludes: fieldsShowed
          })
        }
        if (panelType === 'window') {
          dispatch('setIsloadContext', {
            containerUuid
          })
          if (isPrivateAccess) {
            const tableName = rootGetters.getTableNameFromTab(parentUuid, containerUuid)
            // TODO: Add current id and new id to comparison
            if (!isEmptyValue(newValues[`${tableName}_ID`])) {
              dispatch('getPrivateAccessFromServer', {
                tableName,
                recordId: newValues[`${tableName}_ID`],
                userUuid: rootGetters['user/getUserUuid']
              })
            }
          }
        }
      })
    },
    /**
     * TODO: Add fieldAttributes
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * @param {string}  panelType
     * @param {boolean} isAdvancedQuery
     * @param {string}  columnName
     * @param {mixin}   newValue
     * @param {mixin}   valueTo
     * @param {string}  displayColumn, only used for lookup
     * @param {boolean} isSendToServer
     * @param {boolean} isSendCallout
     * @param {boolean} isChangedOldValue
     * @param {array}   withOutColumnNames
     */
    notifyFieldChange({ commit, dispatch, getters }, {
      parentUuid, containerUuid, panelType = 'window', isAdvancedQuery = false,
      columnName, newValue, valueTo, displayColumn,
      isSendToServer = true, isSendCallout = true,
      isChangedOldValue = false, withOutColumnNames = [],
      isChangeMultipleFields = false
    }) {
      return new Promise(async resolve => {
        const panel = getters.getPanel(containerUuid, isAdvancedQuery)
        const { fieldList: fieldsList, tableName } = panel
        // get field
        const field = fieldsList.find(fieldItem => fieldItem.columnName === columnName)

        if (!(panelType === 'table' || isAdvancedQuery)) {
          if (!['IN', 'NOT_IN'].includes(field.operator)) {
            newValue = parsedValueComponent({
              fieldType: field.componentPath,
              referenceType: field.referenceType,
              value: newValue,
              isIdentifier: field.columnName.includes('_ID')
            })
            if (field.isRange) {
              valueTo = parsedValueComponent({
                fieldType: field.componentPath,
                referenceType: field.referenceType,
                value: valueTo,
                isIdentifier: field.columnName.includes('_ID')
              })
            }
          }

          //  Call context management
          dispatch('setContext', {
            parentUuid,
            containerUuid,
            columnName,
            value: newValue
          })

          // request context info field
          if ((!isEmptyValue(field.value) || !isEmptyValue(newValue)) && !isEmptyValue(field.contextInfo) && !isEmptyValue(field.contextInfo.sqlStatement)) {
            let isSQL = false
            let sqlStatement = field.contextInfo.sqlStatement
            if (sqlStatement.includes('@')) {
              if (sqlStatement.includes('@SQL=')) {
                isSQL = true
              }
              sqlStatement = parseContext({
                parentUuid,
                containerUuid,
                columnName,
                value: sqlStatement,
                isSQL
              }).value
              if (isSQL && String(sqlStatement) === '[object Object]') {
                sqlStatement = sqlStatement.query
              }
            }
            const contextInfo = await dispatch('getContextInfoValueFromServer', {
              parentUuid,
              containerUuid,
              contextInfoUuid: field.contextInfo.uuid,
              columnName,
              sqlStatement
            })
            if (!isEmptyValue(contextInfo) && !isEmptyValue(contextInfo.messageText)) {
              field.contextInfo.isActive = true
              field.contextInfo.messageText.msgText = contextInfo.messageText
              field.contextInfo.messageText.msgTip = contextInfo.messageTip
            }
          }

          //  Change Dependents
          dispatch('changeDependentFieldsList', {
            parentUuid,
            containerUuid,
            dependentFieldsList: field.dependentFieldsList,
            fieldsList,
            isSendToServer
          })
        }

        // the field has not changed, then the action is broken
        if (newValue === field.value && isEmptyValue(displayColumn) && !isAdvancedQuery) {
          resolve()
          return
        }

        commit('changeFieldValue', {
          field,
          newValue,
          valueTo,
          displayColumn,
          isChangedOldValue
        })
        resolve({
          field,
          newValue,
          valueTo,
          displayColumn,
          tableName
        })

        // request callouts
        if (field.panelType === 'window' && isSendCallout && !isChangeMultipleFields) {
          if (!withOutColumnNames.includes(field.columnName) && !isEmptyValue(newValue) && !isEmptyValue(field.callout)) {
            withOutColumnNames.push(field.columnName)
            dispatch('getCallout', {
              parentUuid,
              containerUuid,
              tableName,
              columnName: field.columnName,
              callout: field.callout,
              value: newValue,
              oldValue: field.oldValue,
              valueType: field.valueType,
              withOutColumnNames
            })
          }
        }

        if (isSendToServer) {
          const fieldsEmpty = getters.getFieldListEmptyMandatory({
            containerUuid,
            fieldsList
          })
          if (panelType === 'table' || isAdvancedQuery) {
            if (field.isShowedFromUser && (field.oldValue !== field.value ||
              ['NULL', 'NOT_NULL'].includes(field.operator) ||
              field.operator !== field.oldOperator)) {
              // change action to advanced query on field value is changed in this panel
              if (router.currentRoute.query.action !== 'advancedQuery') {
                router.push({
                  query: {
                    ...router.currentRoute.query,
                    action: 'advancedQuery'
                  }
                })
              }
              commit('changeField', {
                field,
                newField: {
                  ...field,
                  oldOperator: field.operator
                }
              })
              dispatch('getObjectListFromCriteria', {
                parentUuid,
                containerUuid,
                tableName: panel.tableName,
                query: panel.query,
                whereClause: panel.whereClause,
                conditionsList: getters.getParametersToServer({
                  containerUuid,
                  isAdvancedQuery: true,
                  isEvaluateMandatory: false
                })
              })
                .then(response => {
                  if (response && response.length) {
                    dispatch('notifyPanelChange', {
                      parentUuid,
                      containerUuid,
                      isAdvancedQuery: false,
                      newValues: response[0],
                      isSendToServer: false,
                      isSendCallout: true,
                      panelType: 'window'
                    })
                  }
                })
                .catch(error => {
                  console.warn(`Error getting Advanced Query (notifyFieldChange): ${error.message}. Code: ${error.code}.`)
                })
            }
          } else if (isEmptyValue(fieldsEmpty)) {
            // TODO: refactory for it and change for a standard method
            if (field.panelType === 'browser' && fieldIsDisplayed(field)) {
              let isReadyForQuery = true
              if (field.isSQLValue) {
                let awaitForValuesToQuery = panel.awaitForValuesToQuery
                awaitForValuesToQuery--
                dispatch('changeBrowserAttribute', {
                  containerUuid,
                  attributeName: 'awaitForValuesToQuery',
                  attributeValue: awaitForValuesToQuery
                })
                if (awaitForValuesToQuery === 0) {
                  if (panel.isShowedCriteria) {
                    dispatch('changeBrowserAttribute', {
                      containerUuid,
                      attributeName: 'isShowedCriteria',
                      attributeValue: false
                    })
                  }
                } else if (awaitForValuesToQuery > 0) {
                  isReadyForQuery = false
                }
              }
              if (isReadyForQuery && !field.dependentFieldsList.length) {
                dispatch('getBrowserSearch', {
                  containerUuid,
                  isClearSelection: true
                })
              }
            }
            if (field.panelType === 'window' && fieldIsDisplayed(field)) {
              const uuid = getters.getUuid(containerUuid)
              if (isEmptyValue(uuid)) {
                dispatch('createNewEntity', {
                  parentUuid,
                  containerUuid
                })
                  .then(() => {
                    // change old value so that it is not send in the next update
                    commit('changeFieldValue', {
                      field,
                      newValue,
                      valueTo,
                      displayColumn,
                      isChangedOldValue: true
                    })
                  })
                  .catch(error => {
                    showMessage({
                      message: error.message,
                      type: 'error'
                    })
                    console.warn(`Create Entity Error ${error.code}: ${error.message}.`)
                  })
              } else {
                dispatch('updateCurrentEntity', {
                  containerUuid,
                  recordUuid: uuid
                })
                  .then(response => {
                    // change old value so that it is not send in the next update
                    showMessage({
                      message: language.t('notifications.updateFields') + field.name,
                      type: 'success'
                    })
                    commit('changeFieldValue', {
                      field,
                      newValue,
                      valueTo,
                      displayColumn,
                      isChangedOldValue: true
                    })

                    // change value in table
                    dispatch('notifyRowTableChange', {
                      containerUuid,
                      row: response,
                      isEdit: false,
                      isParent: true
                    })
                  })
              }
            }
          } else {
            showMessage({
              message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
              type: 'info'
            })
          }
        }
      })
    },
    changeDependentFieldsList({ commit, dispatch, getters }, {
      parentUuid,
      containerUuid,
      dependentFieldsList = [],
      fieldsList = [],
      isSendToServer
    }) {
      if (isEmptyValue(dependentFieldsList)) {
        // breaks if there are no field dependencies
        return
      }

      if (!fieldsList.length) {
        fieldsList = getters.getFieldsListFromPanel(containerUuid)
      }

      const dependentsList = fieldsList.filter(fieldItem => {
        return dependentFieldsList.includes(fieldItem.columnName)
      })

      //  Iterate for change logic
      dependentsList.map(async fieldDependent => {
        //  isDisplayed Logic
        let isDisplayedFromLogic, isMandatoryFromLogic, isReadOnlyFromLogic, defaultValue
        if (!isEmptyValue(fieldDependent.displayLogic)) {
          isDisplayedFromLogic = evaluator.evaluateLogic({
            context: getContext,
            parentUuid,
            containerUuid,
            logic: fieldDependent.displayLogic
          })
        }
        //  Mandatory Logic
        if (!isEmptyValue(fieldDependent.mandatoryLogic)) {
          isMandatoryFromLogic = evaluator.evaluateLogic({
            context: getContext,
            parentUuid,
            containerUuid,
            logic: fieldDependent.mandatoryLogic
          })
        }
        //  Read Only Logic
        if (!isEmptyValue(fieldDependent.readOnlyLogic)) {
          isReadOnlyFromLogic = evaluator.evaluateLogic({
            context: getContext,
            parentUuid,
            containerUuid,
            logic: fieldDependent.readOnlyLogic
          })
        }
        //  Default Value
        if (!isEmptyValue(fieldDependent.defaultValue) &&
          fieldDependent.defaultValue.includes('@') &&
          !fieldDependent.defaultValue.includes('@SQL=')) {
          defaultValue = parseContext({
            parentUuid,
            containerUuid,
            value: fieldDependent.defaultValue
          }).value
        }
        if (!isEmptyValue(fieldDependent.defaultValue) &&
          fieldDependent.defaultValue.includes('@SQL=')) {
          defaultValue = parseContext({
            parentUuid,
            containerUuid,
            isSQL: true,
            value: fieldDependent.defaultValue
          }).query
          if (defaultValue !== fieldDependent.parsedDefaultValue) {
            const newValue = await dispatch('getValueBySQL', {
              parentUuid,
              containerUuid,
              query: defaultValue
            })

            dispatch('notifyFieldChange', {
              parentUuid,
              containerUuid,
              isSendToServer,
              panelType: fieldDependent.panelType,
              columnName: fieldDependent.columnName,
              newValue
            })
          }
        }

        commit('changeFieldLogic', {
          field: fieldDependent,
          isDisplayedFromLogic,
          isMandatoryFromLogic,
          isReadOnlyFromLogic,
          parsedDefaultValue: defaultValue
        })
      })
    },
    getPanelAndFields({ dispatch }, {
      parentUuid,
      containerUuid,
      panelType,
      panelMetadata,
      routeToDelete,
      isAdvancedQuery = false
    }) {
      let executeAction
      switch (panelType) {
        case 'process':
        case 'report':
          executeAction = 'getProcessFromServer'
          break
        case 'browser':
          executeAction = 'getBrowserFromServer'
          break
        case 'window':
        case 'table':
        default:
          executeAction = 'getTabAndFieldFromServer'
          break
      }

      return dispatch(executeAction, {
        parentUuid,
        containerUuid,
        panelType,
        panelMetadata,
        isAdvancedQuery,
        routeToDelete
      })
        .then(panelResponse => {
          return panelResponse
        })
        .catch(error => {
          return {
            ...error,
            moreInfo: `Dictionary getPanelAndFields ${panelType} (State Panel).`
          }
        })
    },
    changePanelAttributesBoolean({ commit, getters }, {
      containerUuid,
      attributeName,
      attributeValue
    }) {
      const panel = getters.getPanel(containerUuid)
      const newPanel = panel
      if (isEmptyValue(attributeValue)) {
        newPanel[attributeName] = !panel[attributeName]
      } else {
        newPanel[attributeName] = attributeValue
      }
      commit('changePanel', {
        panel: panel,
        newPanel: newPanel
      })
    },
    /**
     * Change a attribute in field state
     * @param {string} attributeName
     * @param {mixed} attributeValue
     * @param {boolean|object} multipleAttributes
     */
    changeFieldAttribure({ commit, getters }, {
      containerUuid,
      isAdvancedQuery,
      columnName,
      field,
      attributeName,
      attributeValue,
      multipleAttributes = false
    }) {
      if (isEmptyValue(field)) {
        field = getters.getFieldFromColumnName({ containerUuid, isAdvancedQuery, columnName })
      }
      let newField = field
      if (multipleAttributes) {
        newField = {
          ...newField,
          multipleAttributes
        }
      } else {
        newField[attributeName] = attributeValue
      }
      commit('changeField', {
        field,
        newField
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
    getFieldFromColumnName: (state, getters) => ({ containerUuid, isAdvancedQuery, columnName }) => {
      return getters.getFieldsListFromPanel(containerUuid, isAdvancedQuery).find(itemField => {
        return itemField.columnName === columnName
      })
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
        let value = fieldItem.value
        // used when evaluate data in table
        if (row) {
          value = row[fieldItem.columnName]
        }
        if (fieldIsDisplayed(fieldItem) && isMandatory && !isEmptyValue(value)) {
          return true
        }
      })

      return field
    },
    // Obtain empty obligatory fields
    getFieldListEmptyMandatory: (state, getters) => ({
      containerUuid,
      fieldsList = [],
      isEvaluateShowed = true,
      row
    }) => {
      if (fieldsList.length <= 0) {
        fieldsList = getters.getFieldsListFromPanel(containerUuid)
      }

      // all optionals (not mandatory) fields
      fieldsList = fieldsList.filter(fieldItem => {
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
        if (isMandatory) {
          if (isEvaluateShowed) {
            return fieldIsDisplayed(fieldItem)
          }
          return isMandatory
        }
      })
      fieldsList = fieldsList.filter(fieldItem => {
        let value = fieldItem.value
        // used when evaluate data in table
        if (row) {
          value = row[fieldItem.columnName]
        }
        return isEmptyValue(value)
      })

      return fieldsList.map(fieldItem => {
        return fieldItem.name
      })
    },
    /**
     * Show all available fields not mandatory to show, used in components panel/filterFields.vue
     * @param {string} containerUuid
     * @param {boolean} isEvaluateShowed
     */
    getFieldsListNotMandatory: (state, getters) => ({ containerUuid, isEvaluateShowed = true }) => {
      // all optionals (not mandatory) fields
      return getters.getFieldsListFromPanel(containerUuid).filter(fieldItem => {
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
        if (!isMandatory) {
          if (isEvaluateShowed) {
            return fieldIsDisplayed(fieldItem)
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
              value: fieldItem.valueTo,
              valueType: fieldItem.valueType
            })
          }

          return {
            columnName: fieldItem.columnName,
            value: valueToReturn,
            valueType: fieldItem.valueType
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
      fieldsList = []
    }) => {
      if (isEmptyValue(fieldsList)) {
        fieldsList = getters.getFieldsListFromPanel(containerUuid)
      }
      const attributesObject = {}

      fieldsList
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
              isSQL
            })
            if (typeof valueToReturn === 'object') {
              valueToReturn = {
                ...valueToReturn,
                defaultValue: fieldItem.defaultValue
              }
            }
          }

          valueToReturn = parsedValueComponent({
            fieldType: fieldItem.componentPath,
            referenceType: fieldItem.referenceType,
            isMandatory: fieldItem.isMandatory,
            value: String(valueToReturn) === '[object Object]' && valueToReturn.isSQL ? valueToReturn : String(valueToReturn) === '[object Object]' ? valueToReturn.value : valueToReturn,
            isIdentifier: fieldItem.columnName.includes('_ID')
          })
          attributesObject[fieldItem.columnName] = valueToReturn

          // add display column to default
          if (fieldItem.componentPath === 'FieldSelect' && fieldItem.value === valueToReturn) {
            attributesObject[`DisplayColumn_${fieldItem.columnName}`] = fieldItem.displayColumn
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
      let fieldsIsDisplayed = []
      const fieldsNotDisplayed = []
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
        fieldIsDisplayed,
        fieldsNotDisplayed,
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
      let fieldList = getters.getFieldsListFromPanel(containerUuid, isAdvancedQuery)
      let attributesListLink = ''
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
        let value = fieldItem.value
        let valueTo = fieldItem.valueTo

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
     * Getter converter selection params with value format
     * @param {String} containerUuid
     * @param {Object} row
     * @param {Array<Object>} fieldList
     * @param {Array<String>} withOutColumnNames
     * @param {Boolean} isEvaluateDisplayed, default value is true
     * @param {Boolean} isEvaluateMandatory, default value is true
     * @param {Boolean} isAdvancedQuery, default value is false
     * @returns {Array<Object>} [{ columname: name key, value: value to send, operator }]
     */
    getParametersToServer: (state, getters) => ({
      containerUuid,
      row,
      fieldList = [],
      withOutColumnNames = [],
      isEvaluateDisplayed = true,
      isEvaluateMandatory = true,
      isAdvancedQuery = false
    }) => {
      if (isEmptyValue(fieldList)) {
        fieldList = getters.getFieldsListFromPanel(containerUuid, isAdvancedQuery)
      }
      const parametersRange = []

      // filter fields
      let parametersList = fieldList
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
            let isDisplayed = fieldIsDisplayed(fieldItem) && (fieldItem.isShowedFromUser || isMandatory)
            if (isAdvancedQuery) {
              isDisplayed = fieldItem.isShowedFromUser
            }

            if (isDisplayed) {
              if (row) {
                if (!isEmptyValue(row[fieldItem.columnName])) {
                  return true
                }
              } else {
                if (!isEmptyValue(fieldItem.value) || (isAdvancedQuery &&
                   ['NULL', 'NOT_NULL'].includes(fieldItem.operator))) {
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
          let value = parameterItem.value
          let valueTo = parameterItem.valueTo
          if (row) {
            value = row[parameterItem.columnName]
            valueTo = row[`${parameterItem.columnName}_To`]
          }

          let values = []
          if (isAdvancedQuery && ['IN', 'NOT_IN'].includes(parameterItem.operator)) {
            if (Array.isArray(value)) {
              values = value.map(itemValue => {
                const isMandatory = !isAdvancedQuery && (parameterItem.isMandatory || parameterItem.isMandatoryFromLogic)
                return parsedValueComponent({
                  fieldType: parameterItem.componentPath,
                  value: itemValue,
                  referenceType: parameterItem.referenceType,
                  isMandatory,
                  isIdentifier: parameterItem.columnName.includes('_ID')
                })
              })
            } else {
              values.push(value)
            }
            value = undefined
          }

          let operator
          // set default operator of field
          if (isAdvancedQuery || ['process', 'report'].includes(parameterItem.panelType)) {
            operator = parameterItem.operator
          }
          // only to fields type Time, Date and DateTime, and is range, with values
          // manage as Array = [value, valueTo]
          if (parameterItem.isRange && parameterItem.componentPath !== 'FieldNumber') {
            operator = 'LESS_EQUAL' // operand to value is second position of array
            parametersRange.push({
              columnName: `${parameterItem.columnName}_To`,
              operator,
              valueType: parameterItem.valueType,
              value: valueTo
            })
            operator = 'GREATER_EQUAL' // rewrite to assign first position of array
          }

          return {
            columnName: parameterItem.columnName,
            value,
            valueType: parameterItem.valueType,
            isRange: parameterItem.isRange,
            values,
            operator
          }
        })

      parametersList = parametersList.concat(parametersRange)
      return parametersList
    }
  }
}

export default panel
