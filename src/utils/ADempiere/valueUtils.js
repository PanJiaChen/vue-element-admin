// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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

import { convertStringToBoolean, convertBooleanToString } from '@/utils/ADempiere/valueFormat.js'
import { TABLE, TABLE_DIRECT } from '@/utils/ADempiere/references.js'

/**
 * Checks if value is empty. Deep-checks arrays and objects
 * Note: isEmpty([]) == true, isEmpty({}) == true,
 * isEmpty([{0: false}, "", 0]) == true, isEmpty({0: 1}) == false
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @link https://gist.github.com/EdwinBetanc0urt/3fc02172ada073ded4b52e46543553ce
 * @param {boolean|array|object|number|string|date|map|set|function} value
 * @returns {boolean}
 */
export const isEmptyValue = function(value) {
  // Custom empty value ADempiere to lookup
  if (String(value).trim() === '-1') {
    return true
  }

  let isEmpty = false
  const typeOfValue = typeValue(value)

  switch (typeOfValue) {
    case 'UNDEFINED':
    case 'ERRORR':
    case 'NULL':
      isEmpty = true
      break
    case 'BOOLEAN':
    case 'DATE':
    case 'FUNCTION': // Or class
    case 'PROMISE':
    case 'REGEXP':
      isEmpty = false
      break
    case 'STRING':
      isEmpty = Boolean(!value.trim().length)
      break
    case 'MATH':
    case 'NUMBER':
      if (Number.isNaN(value)) {
        isEmpty = true
        break
      }
      isEmpty = false
      break
    case 'JSON':
      if (value.trim().length) {
        isEmpty = Boolean(value.trim() === '{}')
        break
      }
      isEmpty = true
      break
    case 'OBJECT':
      isEmpty = Boolean(!Object.keys(value).length)
      break
    case 'ARGUMENTS':
    case 'ARRAY':
      isEmpty = Boolean(!value.length)
      break
    case 'MAP':
    case 'SET':
      isEmpty = Boolean(!value.size)
      break
  }

  return isEmpty
}

/**
 * Evaluates the type of data sent, useful with 'array' type data as the typeof
 * function returns 'object' in this and other cases.
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @link https://gist.github.com/EdwinBetanc0urt/3fc02172ada073ded4b52e46543553ce
 * @param {boolean|array|object|number|string|date|map|set|function} value
 * @returns {string} value type in capital letters (STRING, NUMBER, BOOLEAN, ...)
 */
export function typeValue(value) {
  const typeOfValue = Object.prototype
    .toString
    .call(value)
    .match(/^\[object\s(.*)\]$/)[1]
    .toUpperCase()

  return typeOfValue
}

/**
 * Return token of pagination.
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @param {string} token
 * @returns {string}
 */
export function extractPagingToken(token) {
  let onlyToken = token.slice(0, -2)
  if (onlyToken.substr(-1, 1) === '-') {
    onlyToken = onlyToken.slice(0, -1)
  }
  return onlyToken
}

/**
 * zero pad
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @param {number|string} number
 * @param {number} pad
 * @returns {string}
 */
export function zeroPad(number, pad = 2) {
  const zero = Number(pad) - number.toString().length + 1
  return Array(+(zero > 0 && zero)).join('0') + number
}

/**
 * Get date and time from client in a object value
 * @param {string} type Type value of return
 * @returns {object|string}
 */
export function clientDateTime(date = null, type = '') {
  if (date == null || date === undefined || (typeof date === 'string' && date.trim() === '')) {
    // instance the objet Data with current date from client
    date = new Date()
  } else {
    // instance the objet Data with date or time send
    date = new Date(date)
  }

  const currentDate = date.getFullYear() +
    '-' + zeroPad(date.getMonth() + 1) +
    '-' + zeroPad(date.getDate())

  const currentTime = date.getHours() +
    ':' + date.getMinutes() +
    ':' + date.getSeconds()

  const currentDateTime = {
    date: currentDate,
    time: currentTime
  }

  if (type.toLowerCase() === 't') {
    // time format HH:II:SS
    return currentDateTime.time
  } else if (type.toLowerCase() === 'd') {
    // date format YYYY-MM-DD
    return currentDateTime.date
  } else if (type.toLocaleLowerCase() === 'o') {
    // object format
    return currentDateTime
  }
  return currentDateTime.date + ' ' + currentDateTime.time
}

export function convertFieldsListToShareLink(fieldsList) {
  let attributesListLink = ''
  fieldsList.map(fieldItem => {
    // assign values
    let value = fieldItem.value
    let valueTo = fieldItem.valueTo

    if (!isEmptyValue(value)) {
      if (['FieldDate', 'FieldTime'].includes(fieldItem.componentPath) || typeof value === 'object') {
        value = value.getTime()
      }
      attributesListLink += `${fieldItem.columnName}=${encodeURIComponent(value)}&`
    }

    if (fieldItem.isRange && !isEmptyValue(valueTo)) {
      if (['FieldDate', 'FieldTime'].includes(fieldItem.componentPath) || typeof value === 'object') {
        valueTo = valueTo.getTime()
      }
      attributesListLink += `${fieldItem.columnName}_To=${encodeURIComponent(valueTo)}&`
    }
  })

  return attributesListLink.slice(0, -1)
}

/**
 * Find element in an array recursively
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {object|array} treeData object recursive array
 * @param {string} attributeName, key to get value, default 'id'
 * @param {string} secondAttributeName, key to get value, default 'meta'
 * @param {mixed}  attributeValue, value to compare with search
 * @param {string} attributeChilds, 'childs' list into element
 */
export const recursiveTreeSearch = ({
  treeData,
  attributeValue,
  attributeName = 'id',
  secondAttribute = false,
  attributeChilds = 'childsList',
  isParent = false
}) => {
  if (Array.isArray(treeData)) {
    let index = 0
    const length = treeData.length
    while (index < length) {
      let value = treeData[index]
      if (!isEmptyValue(value) && Object.prototype.hasOwnProperty.call(value, attributeName)) {
        value = value[attributeName]
      }
      if (!isEmptyValue(value) && secondAttribute && Object.prototype.hasOwnProperty.call(value, secondAttribute)) {
        value = value[secondAttribute]
      }

      // compare item to search
      if (value === attributeValue) {
        return treeData[index]
      }

      if (treeData[index] && treeData[index][attributeChilds]) {
        const found = recursiveTreeSearch({
          treeData: treeData[index][attributeChilds],
          attributeValue,
          attributeName,
          secondAttribute,
          attributeChilds,
          isParent
        })
        if (found) {
          return found
        }
      }
      index++
    }
  } else {
    let value = treeData
    if (!isEmptyValue(value) && Object.prototype.hasOwnProperty.call(value, attributeName)) {
      value = value[attributeName]
    }
    if (!isEmptyValue(value) && secondAttribute && Object.prototype.hasOwnProperty.call(value, secondAttribute)) {
      value = value[secondAttribute]
    }

    // compare item to search
    if (value === attributeValue) {
      return treeData
    }

    const found = recursiveTreeSearch({
      treeData: treeData[attributeChilds],
      attributeValue,
      attributeName,
      secondAttribute,
      attributeChilds
    })
    return found
  }
}

/**
 * Preference Value
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {mixed} value, value to parsed
 * @param {string} componentPath
 * @param {number} displayType, reference in ADempiere
 * @param {boolean} isMandatory, field is mandatory
 * @param {boolean} isIdentifier, field is ID
 */
export function parsedValueComponent({
  componentPath,
  value,
  columnName,
  displayType,
  isMandatory = false
}) {
  const isEmpty = isEmptyValue(value)
  if (isEmpty && !isMandatory) {
    if (componentPath === 'FieldYesNo') {
      if (columnName === 'IsActive') {
        return true
      }
      // Processing, Processed, and any other columnName, return false by default
      return Boolean(value)
    }
    return undefined
  }
  let returnValue

  switch (componentPath) {
    // data type Number
    case 'FieldNumber':
      if (isEmpty) {
        returnValue = undefined
        if (isMandatory) {
          returnValue = 0
        }
      } else if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'query')) {
        returnValue = value
      } else {
        if (Array.isArray(value) && value.length) {
          returnValue = value
        } else {
          returnValue = Number(value)
        }
      }
      break

    // data type Boolean
    case 'FieldYesNo':
      if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'query')) {
        returnValue = value
      }
      returnValue = convertStringToBoolean(value)
      returnValue = Boolean(returnValue)
      break

    // data type String
    case 'FieldText':
    case 'FieldTextArea':
      if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'query')) {
        returnValue = value
      }
      returnValue = value ? String(value) : undefined
      break

    // data type Date
    case 'FieldDate':
    case 'FieldTime ':
      if (isEmpty) {
        value = undefined
      }
      if (!isNaN(value)) {
        value = Number(value)
      }
      if (typeof value === 'number' || typeof value === 'string') {
        value = new Date(value)
      }
      if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'query')) {
        returnValue = value
      }
      returnValue = value
      break

    case 'FieldSelect':
      if (isEmpty) {
        value = undefined
      }
      if (typeof value === 'boolean') {
        value = convertBooleanToString(value)
      }
      // Table (18) or Table Direct (19)
      if (TABLE_DIRECT.id === displayType || TABLE.id === displayType && columnName.includes('_ID')) {
        if (!isEmptyValue(value)) {
          value = Number(value)
        }
      }
      // Search or List
      returnValue = value
      break

    default:
      returnValue = value
      break
  }
  return returnValue
}

/**
 * add a tab depending on the status of the document
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {string} tag, document status key
 */
export function tagStatus(tag) {
  let type
  switch (tag) {
    case 'VO':
      type = 'danger'
      break
    case 'AP':
      type = 'success'
      break
    case 'DR':
      type = 'info'
      break
    case 'CL':
      type = 'primary'
      break
    case 'CO':
      type = 'success'
      break
    case '??':
      type = 'info'
      break
    case 'IP':
      type = 'warning'
      break
    case 'WC':
      type = 'warning'
      break
    case 'WP':
      type = 'warning'
      break
    case 'NA':
      type = 'danger'
      break
    case 'IN':
      type = 'danger'
      break
    case 'RE':
      type = 'danger'
      break
  }
  return type
}

/**
 * add a tab depending on the status of the document
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {string} iconElment, icon the Elment
 */
export function iconStatus(iconElment) {
  let icon
  switch (iconElment) {
    case 'A':
      icon = 'el-icon-wallet'
      break
    case 'M':
      icon = 'el-icon-wallet'
      break
    case 'K':
      icon = 'el-icon-postcard'
      break
    case 'X':
      icon = 'el-icon-money'
      break
    case 'Z':
      icon = 'el-icon-coin'
      break
    case 'T':
      icon = 'el-icon-bank-card'
      break
    case 'P':
      icon = 'el-icon-mobile'
      break
    case 'C':
      icon = 'el-icon-bank-card'
      break
    case 'D':
      icon = 'el-icon-bank-card'
      break
  }
  return icon
}

let partialValue = ''
export function calculationValue(value, event) {
  const isZero = Number(value) === 0
  const VALIDATE_EXPRESSION = /[\d\/.()%\*\+\-]/gim
  const isValidKey = VALIDATE_EXPRESSION.test(event.key)
  if (event.type === 'keydown' && isValidKey) {
    partialValue += event.key
    const operation = isEmptyValue(value) || isZero ? partialValue : String(value) + partialValue
    if (!isEmptyValue(operation)) {
      try {
        // eslint-disable-next-line no-eval
        return eval(operation) + ''
      } catch (error) {
        return null
      }
    }
  } else if (event.type === 'click') {
    if (!isEmptyValue(value)) {
      try {
        // eslint-disable-next-line no-eval
        return eval(value) + ''
      } catch (error) {
        return null
      }
    }
  } else {
    if ((event.key === 'Backspace' || event.key === 'Delete') && !isEmptyValue(value)) {
      try {
        // eslint-disable-next-line no-eval
        return eval(value) + ''
      } catch (error) {
        return null
      }
    } else {
      return null
    }
  }
}
/**
 * Search in the currency lists for the current currency
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {string} currencyCurrent current currency to search
 * @param {array} listCurrency Currency Listing
 * @param {object} currencyCurrent Default Currency
 */
export function currencyFind({
  currencyCurrent,
  listCurrency,
  defaultCurrency
}) {
  if (!isEmptyValue(listCurrency)) {
    const currency = listCurrency.find(item => {
      if (item.currencyUuid === currencyCurrent) {
        return item
      }
    })
    if (currency) {
      return currency
    }
  }
  return defaultCurrency.iSOCode
}
/**
 * Search the Payment List for the Current Payment
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {string} currentPayment Current Payment
 * @param {array} listTypePayment Payment Type Listings
 */

export function tenderTypeFind({
  currentPayment,
  listTypePayment
}) {
  const payment = listTypePayment.find(item => {
    if (item.id === currentPayment) {
      return item.label
    }
  })
  if (payment) {
    return payment.label
  }
  return currentPayment
}
export function clearVariables() {
  partialValue = ''
}
