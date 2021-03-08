import {
  isEmptyValue,
  typeValue
} from '@/utils/ADempiere/valueUtils.js'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'
import evaluator, { getContext, parseContext } from '@/utils/ADempiere/contextUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import { assignedGroup } from '@/utils/ADempiere/dictionaryUtils.js'
import router from '@/router'
import language from '@/lang'

const actions = {
  addPanel({ commit, dispatch, getters }, params) {
    const {
      panelType,
      // isParentTab,
      // parentUuid,
      uuid: containerUuid
    } = params
    let keyColumn = ''
    let selectionColumn = []
    let identifierColumns = []
    let count = 0

    if (params.fieldsList) {
      params.fieldsList.forEach((itemField, index, listFields) => {
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
        if (panelType === 'table' || params.isAdvancedQuery) {
          itemField.isShowedFromUser = false
          if (count < 2 && itemField.isSelectionColumn && itemField.sequence >= 10) {
            itemField.isShowedFromUser = true
            count++
          }
        }
        //  For all
        if (['browser', 'process', 'report', 'form', 'table'].includes(panelType) ||
          (panelType === 'window' && params.isParentTab)) {
          // TODO: Verity with updateValueOfField, setContext, setPreferenceContext
          // commit('updateValueOfField', {
          //   parentUuid,
          //   containerUuid,
          //   // isOverWriteParent: Boolean(isParentTab),
          //   columnName: itemField.columnName,
          //   value: itemField.value
          // })
        }
        //  Get dependent fields
        if (!isEmptyValue(itemField.parentFieldsList) && itemField.isActive) {
          itemField.parentFieldsList.forEach(parentColumnName => {
            const parentField = listFields.find(parentFieldItem => {
              return parentFieldItem.columnName === parentColumnName &&
                parentColumnName !== itemField.columnName
            })
            if (parentField) {
              parentField.dependentFieldsList.push(itemField.columnName)
            }
          })
        }
      })

      let orderBy = 'sequence'
      if ((panelType === 'window' && !params.isParentTab) || panelType === 'browser') {
        orderBy = 'seqNoGrid'
      }
      params.fieldsList = assignedGroup({
        fieldsList: params.fieldsList,
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

    if (!['table'].includes(panelType)) {
      dispatch('setDefaultValues', {
        parentUuid: params.parentUuid,
        containerUuid,
        // isOverWriteParent: Boolean(isParentTab),
        panelType
      })
    }
    if (params.isCustomForm) {
      dispatch('addForm', params)
    }

    return params
  },
  /**
   * Used by components/fields/filterFields
   */
  changeFieldShowedFromUser({ commit, dispatch, getters, rootGetters }, {
    containerUuid,
    isAdvancedQuery,
    fieldsUser,
    groupField
  }) {
    const panel = getters.getPanel(containerUuid)
    let isChangedDisplayedWithValue = false
    const fieldsList = panel.fieldsList.map(itemField => {
      const isShowedOriginal = itemField.isShowedFromUser
      if (groupField === itemField.groupAssigned) {
        itemField.isShowedFromUser = false
        if (fieldsUser.includes(itemField.columnName)) {
          itemField.isShowedFromUser = true
        }
      }

      if (!isChangedDisplayedWithValue) {
        const value = rootGetters.getValueOfField({
          parentUuid: itemField.parentUuid,
          containerUuid: containerUuid,
          columnName: itemField.columnName
        })
        // if isShowedFromUser was changed, and field has some value, the SmartBrowser
        // or AdvancedQuery  must send the parameters to update the search result
        if ((isShowedOriginal !== itemField.isShowedFromUser && !isEmptyValue(value)) ||
          (isAdvancedQuery && ['NULL', 'NOT_NULL'].includes(itemField.operator))) {
          isChangedDisplayedWithValue = true
        }
      }
      return itemField
    })

    commit('changePanelAttribute', {
      panel,
      attributeName: 'fieldsList',
      attributeValue: fieldsList
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
   * @param {string}  fieldsList
   * @param {string}  attribute
   * @param {boolean} valueAttribute
   * @param {array}   fieldsIncludes fields to set valueAttribute
   * @param {array}   fieldsExcludes fields to dont change
   */
  changeFieldAttributesBoolean({ commit, getters }, {
    containerUuid,
    attribute,
    valueAttribute,
    fieldsIncludes = [],
    fieldsExcludes = []
  }) {
    const panel = getters.getPanel(containerUuid)

    const fieldsList = panel.fieldsList.map(itemField => {
      const { columnName } = itemField

      // not change exlude field
      if (!isEmptyValue(fieldsExcludes) && fieldsExcludes.includes(columnName)) {
        return itemField
      }
      // if it field is included to change value
      if (!isEmptyValue(fieldsIncludes) && fieldsIncludes.includes(columnName)) {
        itemField[attribute] = valueAttribute
        return itemField
      }
      // changed current value by opposite set value
      itemField[attribute] = !valueAttribute
      return itemField
    })

    commit('changePanelAttribute', {
      panel,
      attributeName: 'fieldsList',
      attributeValue: fieldsList
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
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }
    const fieldsIncludes = []
    fieldsList.array.forEach(fieldItem => {
      const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
      if (isMandatory) {
        fieldsIncludes.push(fieldItem.columnName)
      }
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
   * @param {array}   fieldsList
   */
  showAllAvailableColumns({ dispatch, getters }, {
    containerUuid,
    fieldsList = []
  }) {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }
    const fieldsIncludes = []
    fieldsList.foreach(fieldItem => {
      const isDisplayed = fieldItem.isDisplayed && fieldItem.isDisplayedFromLogic && !fieldItem.isKey
      // Verify for displayed and is active
      if (fieldItem.isActive && isDisplayed) {
        fieldsIncludes.push(fieldItem.columnName)
      }
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
   * @param {array}   fieldsList
   * TODO: Evaluate if it is necessary to parse the default values
   */
  setDefaultValues({ commit, dispatch, getters }, {
    parentUuid,
    containerUuid,
    panelType = 'window',
    isOverWriteParent = true,
    isNewRecord = false
  }) {
    return new Promise(resolve => {
      const panel = getters.getPanel(containerUuid)
      if (isEmptyValue(panel)) {
        resolve()
        return
      }

      const oldRoute = router.app._route
      const defaultAttributes = getters.getParsedDefaultValues({
        parentUuid,
        containerUuid,
        isSOTrxMenu: oldRoute.meta.isSalesTransaction,
        fieldsList: panel.fieldsList
      })

      if (panelType === 'window' && isNewRecord) {
        // redirect to create new record
        if (!(oldRoute.query && oldRoute.query.action === 'create-new')) {
          router.push({
            name: oldRoute.name,
            params: {
              ...oldRoute.params
            },
            query: {
              ...oldRoute.query,
              action: 'create-new'
            }
          }, () => {})
        }
        showMessage({
          message: language.t('data.createNewRecord'),
          type: 'info'
        })

        defaultAttributes.forEach(attribute => {
          commit('addChangeToPersistenceQueue', {
            ...attribute,
            containerUuid
          })
        })
        // panel.fieldsList.forEach(fieldToBlank => {
        //   if (isEmptyValue(fieldToBlank.parsedDefaultValue)) {
        //     commit('changeFieldValueToNull', {
        //       field: fieldToBlank,
        //       value: undefined
        //     })
        //   }
        // })

        // if (panel.isTabsChildren) {
        //   // delete records tabs children when change record uuid
        //   dispatch('deleteRecordContainer', {
        //     viewUuid: parentUuid,
        //     withOut: [containerUuid],
        //     isNew: true
        //   })
        // }
      }

      dispatch('updateValuesOfContainer', {
        parentUuid,
        containerUuid,
        isOverWriteParent,
        attributes: defaultAttributes
      })
        .then(() => {
          if (['browser', 'form', 'process', 'report'].includes(panelType)) {
          // const fieldsUser = []
            panel.fieldsList.forEach(itemField => {
              if (!itemField.isAdvancedQuery || itemField.isActiveLogics) {
              // Change Dependents
                dispatch('changeDependentFieldsList', {
                  field: itemField
                })
              }
            // if (itemField.isShowedFromUserDefault || !isEmptyValue(itemField.value)) {
            //   fieldsUser.push(itemField.columnName)
            // }
            })

          // dispatch('changeFieldShowedFromUser', {
          //   containerUuid,
          //   fieldsUser,
          //   groupField: ''
          // })
          }
        })

      resolve(defaultAttributes)
    })
  },
  seekRecord({ dispatch, getters }, {
    parentUuid,
    containerUuid,
    recordUuid
  }) {
    const recordRow = getters.getDataRecordAndSelection(containerUuid).record.find(record => record.UUID === recordUuid)
    let attributes = []
    if (!isEmptyValue(recordRow)) {
      attributes = convertObjectToKeyValue({
        object: recordRow
      })
    }
    //  Change Value
    dispatch('notifyPanelChange', {
      parentUuid,
      containerUuid,
      attributes
    })
  },
  // Change all values of panel and dispatch actions for each field
  notifyPanelChange({ dispatch, getters }, {
    parentUuid,
    containerUuid,
    attributes = []
  }) {
    if (typeValue(attributes) === 'OBJECT') {
      attributes = convertObjectToKeyValue({
        object: attributes
      })
    }
    // Update field
    dispatch('updateValuesOfContainer', {
      parentUuid,
      containerUuid,
      attributes
    })
      .then(() => {
        const panel = getters.getPanel(containerUuid)
        if (!panel.isAdvancedQuery) {
          const fieldsList = panel.fieldsList
          fieldsList.forEach(field => {
            // Change Dependents
            dispatch('changeDependentFieldsList', {
              field,
              fieldsList
            })
          })
        }
      })

    // return new Promise(resolve => {
    //   if (isEmptyValue(fieldsList)) {
    //     fieldsList = getters.getFieldsListFromPanel(containerUuid)
    //   }
    //   let fieldsShowed = []
    //   // const promisessList = []
    //   fieldsList.map(async actionField => {
    //     if (actionField.isShowedFromUser) {
    //       fieldsShowed.push(actionField.columnName)
    //     }
    //
    //     // Evaluate with hasOwnProperty if exits this value
    //     if (!Object.prototype.hasOwnProperty.call(newValues, actionField.columnName)) {
    //       if (!isChangedAllValues || withOutColumnNames.includes(actionField.columnName)) {
    //         // breaks if this value does not exist or ignore with out column names
    //         return
    //       }
    //       // set empty value and continue
    //       newValues[actionField.columnName] = undefined
    //     }
    //
    //     if (isChangeFromCallout &&
    //       actionField.componentPath === 'FieldSelect' &&
    //       !Object.prototype.hasOwnProperty.call(newValues, actionField.displayColumnName)) {
    //       let lookup = rootGetters.getLookupItem({
    //         parentUuid,
    //         containerUuid,
    //         directQuery: actionField.reference.directQuery,
    //         tableName: actionField.reference.tableName,
    //         value: newValues[actionField.columnName]
    //       })
    //
    //       if (isEmptyValue(lookup) && !isEmptyValue(newValues[actionField.columnName])) {
    //         lookup = await dispatch('getLookupItemFromServer', {
    //           parentUuid,
    //           containerUuid,
    //           tableName: actionField.reference.tableName,
    //           directQuery: actionField.reference.parsedDirectQuery,
    //           value: newValues[actionField.columnName]
    //         })
    //       }
    //       if (!isEmptyValue(lookup)) {
    //         newValues[actionField.displayColumnName] = lookup.label
    //       }
    //     }
    //     //  Update field
    //     commit('updateValueOfField', {
    //       parentUuid,
    //       containerUuid,
    //       columnName: actionField.columnName,
    //       value: newValues[actionField.columnName]
    //     })
    //   })
    //   // show fields in query
    //   if (isShowedField && !isEmptyValue(newValues)) {
    //     // join column names without duplicating it
    //     fieldsShowed = Array.from(new Set([
    //       ...fieldsShowed,
    //       ...Object.keys(newValues)
    //     ]))
    //
    //     dispatch('changeFieldAttributesBoolean', {
    //       containerUuid,
    //       attribute: 'isShowedFromUser',
    //       valueAttribute: true,
    //       fieldsIncludes: fieldsShowed
    //     })
    //   }
    //   if (panelType === 'window') {
    //     dispatch('setIsloadContext', {
    //       containerUuid
    //     })
    //     if (isPrivateAccess) {
    //       const tableName = rootGetters.getTableNameFromTab(parentUuid, containerUuid)
    //       // TODO: Add current id and new id to comparison
    //       if (!isEmptyValue(newValues[`${tableName}_ID`])) {
    //         dispatch('getPrivateAccessFromServer', {
    //           tableName,
    //           recordId: newValues[`${tableName}_ID`],
    //           userUuid: rootGetters['user/getUserUuid']
    //         })
    //       }
    //     }
    //   }
    // })

    dispatch('setIsloadContext', {
      containerUuid
    })
  },
  /**
   * Handle all trigger for a field:
   * - Display Logic
   * - Mandatory Logic
   * - Read Only Logic
   * - Action for Custom panel from type
  */
  notifyFieldChange({ dispatch, getters }, {
    containerUuid,
    columnName,
    field,
    newValue
  }) {
    return new Promise(resolve => {
      // get field
      let fieldsList = []
      if (isEmptyValue(field)) {
        fieldsList = getters.getFieldsListFromPanel(containerUuid)
        field = fieldsList.find(fieldItem => fieldItem.columnName === columnName)
      }
      let value
      if (isEmptyValue(newValue)) {
        value = getters.getValueOfField({
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          columnName: field.columnName
        })
      } else {
        value = newValue
      }
      // if (!(panelType === 'table' || isAdvancedQuery)) {
      //   if (!['IN', 'NOT_IN'].includes(field.operator)) {
      //     value = parsedValueComponent({
      //       componentPath: field.componentPath,
      //       columnName: field.columnName,
      //       displayType: field.displayType,
      //       value,
      //       isIdentifier: field.columnName.includes('_ID')
      //     })
      //     if (field.isRange) {
      //       valueTo = parsedValueComponent({
      //         componentPath: field.componentPath,
      //         columnName: field.columnName,
      //         displayType: field.displayType,
      //         value: valueTo,
      //         isIdentifier: field.columnName.includes('_ID')
      //       })
      //     }
      //   }
      // }
      resolve({
        tableName: field.tableName,
        field,
        value
      })

      // Run specific action
      dispatch(field.panelType + 'ActionPerformed', {
        containerUuid: field.containerUuid,
        field,
        value
      })
        .then(response => {
          if (response) {
            dispatch('notifyPanelChange', {
              containerUuid: field.containerUuid,
              columnName: field.columnName,
              attributes: response.attributes
            })
          }
          if (!field.isAdvancedQuery) {
            // Change Dependents
            dispatch('changeDependentFieldsList', {
              field,
              fieldsList
            })
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`${field.panelType}ActionPerformed error: ${error.message}.`)
        })
    })
  },
  /**
   * Change dependent fields (default value, logics displayed, mandatory and read only)
   * @param {object} field, definition and attributes
   * TODO: Not working with fields generated on lookupFactory
   */
  changeDependentFieldsList({ commit, dispatch, getters }, {
    field,
    fieldsList
  }) {
    if (isEmptyValue(field.dependentFieldsList)) {
      // breaks if there are no field dependencies
      return
    }
    //  Get all fields
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getFieldsListFromPanel(field.containerUuid)
    }
    const dependentsList = fieldsList.filter(fieldItem => {
      return field.dependentFieldsList.includes(fieldItem.columnName)
    })

    //  Iterate for change logic
    dependentsList.map(async fieldDependent => {
      //  isDisplayed Logic
      let isDisplayedFromLogic, isMandatoryFromLogic, isReadOnlyFromLogic, defaultValue
      if (!isEmptyValue(fieldDependent.displayLogic)) {
        isDisplayedFromLogic = evaluator.evaluateLogic({
          context: getContext,
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          logic: fieldDependent.displayLogic
        })
      }
      //  Mandatory Logic
      if (!isEmptyValue(fieldDependent.mandatoryLogic)) {
        isMandatoryFromLogic = evaluator.evaluateLogic({
          context: getContext,
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          logic: fieldDependent.mandatoryLogic
        })
      }
      //  Read Only Logic
      if (!isEmptyValue(fieldDependent.readOnlyLogic)) {
        isReadOnlyFromLogic = evaluator.evaluateLogic({
          context: getContext,
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          logic: fieldDependent.readOnlyLogic
        })
      }
      //  Default Value
      if (!isEmptyValue(fieldDependent.defaultValue) &&
        fieldDependent.defaultValue.includes('@') &&
        !fieldDependent.defaultValue.includes('@SQL=')) {
        defaultValue = parseContext({
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          value: fieldDependent.defaultValue
        }).value
      }
      if (!isEmptyValue(fieldDependent.defaultValue) &&
        fieldDependent.defaultValue.includes('@SQL=')) {
        defaultValue = parseContext({
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          isSQL: true,
          value: fieldDependent.defaultValue
        }).query
        if (defaultValue !== fieldDependent.parsedDefaultValue) {
          const newValue = await dispatch('getValueBySQL', {
            parentUuid: field.parentUuid,
            containerUuid: field.containerUuid,
            query: defaultValue
          })
          //  Update values for field
          commit('updateValueOfField', {
            parentUuid: field.parentUuid,
            containerUuid: field.containerUuid,
            columnName: fieldDependent.columnName,
            value: newValue
          })

          // dispatch('notifyFieldChange', {
          //   parentUuid,
          //   containerUuid,
          //   isSendToServer,
          //   panelType: fieldDependent.panelType,
          //   columnName: fieldDependent.columnName,
          //   newValue
          // })
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
      case 'form':
        executeAction = 'getFormFromServer'
        break
      case 'window':
      case 'table':
      default:
        executeAction = 'getFieldsFromTab'
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
    if (isEmptyValue(attributeValue)) {
      attributeValue = !panel[attributeName]
    }

    commit('changePanelAttribute', {
      panel,
      attributeName,
      attributeValue
    })
  },
  /**
   * Change a attribute in field state
   * @param {string} containerUuid
   * @param {string} columnName
   * @param {object} field
   * @param {string} attributeName
   * @param {mixed}  attributeValue
   */
  changeFieldAttribure({ commit, getters }, {
    containerUuid,
    columnName,
    field,
    attributeName,
    attributeValue
  }) {
    if (isEmptyValue(field)) {
      field = getters.getFieldFromColumnName({
        containerUuid,
        columnName
      })
    }

    commit('changeFieldAttribure', {
      field,
      attributeName,
      attributeValue
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
}

export default actions
