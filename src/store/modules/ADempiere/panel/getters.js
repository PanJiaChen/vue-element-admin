// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import {
  isEmptyValue,
  parsedValueComponent
} from '@/utils/ADempiere/valueUtils.js'
import { specialColumns } from '@/utils/ADempiere/contextUtils.js'
import {
  fieldIsDisplayed,
  getDefaultValue
} from '@/utils/ADempiere/dictionaryUtils.js'
import { LOG_COLUMNS_NAME_LIST } from '@/utils/ADempiere/dataUtils.js'

const getters = {
  getPanel: (state) => (containerUuid) => {
    return state.panel.find(item => {
      // uuid as containerUuid alias
      return item.containerUuid === containerUuid
    })
  },

  getFieldsListFromPanel: (state, getters) => (containerUuid) => {
    const panel = getters.getPanel(containerUuid)
    if (isEmptyValue(panel)) {
      return []
    }
    return panel.fieldsList
  },

  getFieldFromColumnName: (state, getters) => ({ containerUuid, columnName }) => {
    return getters.getFieldsListFromPanel(containerUuid).find(itemField => {
      return itemField.columnName === columnName
    })
  },

  /**
   * Determinate if panel is ready fron send, all fiedls mandatory and displayed with values
   * @param {string}  containerUuid
   * @param {object}  row, data to compare if is table
   * @returns {object}
   */
  isNotReadyForSubmit: (state, getters, rootState, rootGetters) => (containerUuid, row) => {
    const fieldsList = getters.getFieldsListFromPanel(containerUuid)

    const fieldNotReadyToSend = fieldsList.find(fieldItem => {
      const { columnName } = fieldItem
      // Omit log columns list only created or updated record, this is manage for backend
      if (fieldItem.panelType === 'window' && LOG_COLUMNS_NAME_LIST.includes(columnName)) {
        return false
      }

      const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
      const isDisplayed = fieldIsDisplayed(fieldItem) && (fieldItem.isShowedFromUser || isMandatory)
      if (isDisplayed && isMandatory) {
        let value
        // used when evaluate data in table
        if (row) {
          value = row[columnName]
        } else {
          value = rootGetters.getValueOfField({
            parentUuid: fieldItem.parentUuid,
            containerUuid,
            columnName
          })
        }

        if (isEmptyValue(value)) {
          return true
        }
      }
    })

    return fieldNotReadyToSend
  },

  /**
   * Obtain empty obligatory fields
   * @param {string} containerUuid
   * @param {array} fieldsList
   * @param {string} formatReturn
   */
  getFieldsListEmptyMandatory: (state, getters) => ({
    containerUuid,
    fieldsList,
    formatReturn = 'name'
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }

    // all mandatory and empty fields value
    const fieldsNameEmpty = fieldsList.filter(fieldItem => {
      const value = getters.getValueOfField({
        parentUuid: fieldItem.parentUuid,
        containerUuid,
        columnName: fieldItem.columnName
      })

      if (isEmptyValue(value)) {
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
        if (fieldIsDisplayed(fieldItem) && isMandatory) {
          return true
        }
      }
    })

    if (formatReturn) {
      return fieldsNameEmpty.map(fieldItem => {
        // fieldItem.name by default
        return fieldItem[formatReturn]
      })
    }

    return fieldsNameEmpty
  },

  /**
   * Show all available fields not mandatory and not button
   * to show, used in components FilterFields
   * @param {string} containerUuid
   * @param {boolean} isEvaluateShowed
   */
  getFieldsListNotMandatory: (state, getters) => ({
    containerUuid,
    isEvaluateShowed = true
  }) => {
    // all optionals (not mandatory) fields
    return getters.getFieldsListFromPanel(containerUuid)
      .filter(fieldItem => {
        const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
        if (isMandatory) {
          return false
        }
        const isButtonField = fieldItem.componentPath === 'FieldButton'
        if (isButtonField) {
          return false
        }
        if (isEvaluateShowed) {
          return fieldIsDisplayed(fieldItem)
        }
        return true
      })
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
    fieldsList = []
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }

    let attributesList = fieldsList
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
          // TODO: Verify displayColumn attribute, or get dispay column to fieldValue store
          attributesObject[fieldItem.displayColumnName] = fieldItem.displayColumn
          displayColumnsList.push({
            columnName: fieldItem.displayColumnName,
            value: fieldItem.displayColumn
          })
        }

        // add range columns
        if (isAddRangeColumn && fieldItem.isRange) {
          attributesObject[`${fieldItem.columnName}_To`] = fieldItem.valueTo
          rangeColumnsList.push({
            columnName: `${fieldItem.columnName}_To`,
            value: fieldItem.valueTo
            // valueType: fieldItem.valueType
          })
        }

        return {
          columnName: fieldItem.columnName,
          value: valueToReturn
          // valueType: fieldItem.valueType
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
    isSOTrxMenu,
    fieldsList = [],
    formatToReturn = 'array'
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }
    const attributesRangue = []
    const attributesObject = {}
    let attributesList = fieldsList
      .map(fieldItem => {
        const { columnName, defaultValue } = fieldItem
        let isSQL = false
        let parsedDefaultValue = fieldItem.parsedDefaultValue
        const isSpeciaColumn = specialColumns.includes(columnName) || specialColumns.includes(fieldItem.elementName)

        if (String(defaultValue).includes('@') || isSpeciaColumn) {
          parsedDefaultValue = getDefaultValue({
            ...fieldItem,
            parentUuid,
            isSOTrxMenu
          })
          if (String(defaultValue).includes('@SQL=') && isGetServer) {
            isSQL = true
          }
        }
        attributesObject[columnName] = parsedDefaultValue

        if (fieldItem.isRange && fieldItem.componentPath !== 'FieldNumber') {
          const { columnNameTo, elementNameTo, defaultValueTo } = fieldItem
          let parsedDefaultValueTo = fieldItem.parsedDefaultValueTo
          let isSQLTo = false
          if (String(defaultValueTo).includes('@') || isSpeciaColumn) {
            if (String(defaultValueTo).includes('@SQL=') && isGetServer) {
              isSQLTo = true
            }

            parsedDefaultValueTo = getDefaultValue({
              ...fieldItem,
              parentUuid,
              isSOTrxMenu,
              columnName: columnNameTo,
              elementName: elementNameTo
            })
          }

          attributesObject[columnNameTo] = parsedDefaultValueTo
          attributesRangue.push({
            columnName: columnNameTo,
            value: parsedDefaultValueTo,
            // valueType: fieldItem.valueType,
            isSQL: isSQLTo
          })
        }

        // add display column to default
        if (fieldItem.componentPath === 'FieldSelect' && fieldItem.value === parsedDefaultValue) {
          // TODO: Verify displayColumn attribute, or get dispay column to fieldValue store
          attributesObject[fieldItem.displayColumnName] = fieldItem.displayColumn
        }

        return {
          columnName,
          value: parsedDefaultValue,
          // valueType: fieldItem.valueType,
          isSQL
        }
      })
    if (formatToReturn === 'array') {
      attributesList = attributesList.concat(attributesRangue)
      return attributesList
    }
    return attributesObject
  },

  getFieldsIsDisplayed: (state, getters) => (containerUuid) => {
    const fieldsList = getters.getFieldsListFromPanel(containerUuid)
    let fieldsIsDisplayed = []
    const fieldsNotDisplayed = []
    if (fieldsList.length) {
      fieldsIsDisplayed = fieldsList.filter(itemField => {
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
      totalField: fieldsList.length,
      isDisplayed: Boolean(fieldsIsDisplayed.length)
    }
  },

  getParametersToShare: (state, getters) => ({
    containerUuid,
    withOut = [],
    isOnlyDisplayed = false
  }) => {
    let fieldsList = getters.getFieldsListFromPanel(containerUuid)
    let attributesListLink = ''
    if (withOut.length) {
      fieldsList = fieldsList.filter(fieldItem => {
        // columns to exclude
        if (withOut.includes(fieldItem.columnName)) {
          return false
        }
        return true
      })
    }

    if (isOnlyDisplayed) {
      fieldsList = fieldsList.filter(fieldItem => {
        const isMandatory = Boolean(fieldItem.isMandatory || fieldItem.isMandatoryFromLogic) && !fieldItem.isAdvancedQuery
        const isDisplayed = fieldIsDisplayed(fieldItem) && (fieldItem.isShowedFromUser || isMandatory)
        if (isDisplayed) {
          return true
        }
        return false
      })
    }

    fieldsList.map(fieldItem => {
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
   * @param {Array<Object>} fieldsList
   * @param {Array<String>} withOutColumnNames
   * @param {Boolean} isEvaluateMandatory, default value is true
   * @returns {Array<Object>} [{ columnName: name key, value: value to send, operator }]
   */
  getParametersToServer: (state, getters, rootState, rootGetters) => ({
    containerUuid,
    row,
    fieldsList = [],
    withOutColumnNames = [],
    isEvaluateMandatory = true
  }) => {
    if (isEmptyValue(fieldsList)) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }
    const parametersRange = []

    // filter fields
    let parametersList = fieldsList
      .filter(fieldItem => {
        const { columnName } = fieldItem

        // columns to exclude
        if (withOutColumnNames.includes(columnName)) {
          return false
        }

        // exclude key column if is new
        if (row && row.isNew && fieldItem.isKey) {
          return false
        }

        const isMandatory = Boolean(fieldItem.isMandatory || fieldItem.isMandatoryFromLogic)
        // mandatory fields
        if (isEvaluateMandatory && fieldItem.panelType !== 'browser') {
          if (isMandatory && !fieldItem.isAdvancedQuery) {
            return true
          }
        }

        // evaluate displayed fields
        let isDisplayed = fieldItem.isShowedFromUser
        if (!fieldItem.isAdvancedQuery) {
          // window, process, browser, form
          isDisplayed = fieldIsDisplayed(fieldItem) && (fieldItem.isShowedFromUser || isMandatory)
        }

        if (isDisplayed) {
          // from table
          if (row) {
            if (!isEmptyValue(row[columnName])) {
              return true
            }
            return false
          }

          // from field value
          const value = rootGetters.getValueOfField({
            parentUuid: fieldItem.parentUuid,
            containerUuid,
            columnName
          })
          let valueTo
          if (fieldItem.isRange && fieldItem.componentPath !== 'FieldNumber') {
            valueTo = rootGetters.getValueOfField({
              parentUuid: fieldItem.parentUuid,
              containerUuid,
              columnName: fieldItem.columnNameTo
            })
          }
          if (!isEmptyValue(value) || !isEmptyValue(valueTo) || (fieldItem.isAdvancedQuery &&
            ['NULL', 'NOT_NULL'].includes(fieldItem.operator))) {
            return true
          }
        }

        return false
      })

    // conever parameters
    parametersList = parametersList
      .map(parameterItem => {
        const { columnName, isRange } = parameterItem
        let value
        let valueTo
        if (row) {
          value = row[columnName]
          valueTo = row[parameterItem.columnNameTo]
        } else {
          value = rootGetters.getValueOfField({
            parentUuid: parameterItem.parentUuid,
            containerUuid,
            columnName: columnName
          })
        }

        let values = []
        if (parameterItem.isAdvancedQuery && ['IN', 'NOT_IN'].includes(parameterItem.operator)) {
          if (Array.isArray(value)) {
            values = value.map(itemValue => {
              const isMandatory = !parameterItem.isAdvancedQuery &&
                (parameterItem.isMandatory || parameterItem.isMandatoryFromLogic)

              return parsedValueComponent({
                columnName,
                componentPath: parameterItem.componentPath,
                displayType: parameterItem.displayType,
                isMandatory,
                value: itemValue
              })
            })
          } else {
            values.push(value)
          }
          value = undefined
        }

        let operator
        // set default operator of field
        if (parameterItem.isAdvancedQuery || ['process', 'report'].includes(parameterItem.panelType)) {
          operator = parameterItem.operator
        }
        // only to fields type Time, Date and DateTime, and is range, with values
        // manage as Array = [value, valueTo]
        if (isRange && parameterItem.componentPath !== 'FieldNumber') {
          valueTo = rootGetters.getValueOfField({
            parentUuid: parameterItem.parentUuid,
            containerUuid,
            columnName: parameterItem.columnNameTo
          })
          operator = 'LESS_EQUAL' // operand to value is second position of array
          parametersRange.push({
            columnName: parameterItem.columnNameTo,
            operator,
            // valueType: parameterItem.valueType,
            value: valueTo
          })
          operator = 'GREATER_EQUAL' // rewrite to assign first position of array
        }

        return {
          columnName,
          value,
          // valueType: parameterItem.valueType,
          values,
          operator
        }
      })

    parametersList = parametersList.concat(parametersRange)
    return parametersList
  }
}

export default getters
