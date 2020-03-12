/**
 * Checks if value is empty. Deep-checks arrays and objects
 * Note: isEmpty([]) == true, isEmpty({}) == true,
 * isEmpty([{0: false}, "", 0]) == true, isEmpty({0: 1}) == false
 * @param   {boolean|array|object|number|string} value
 * @returns {boolean}
 */
export function isEmptyValue(value) {
  if (value === undefined || value == null) {
    return true
  } else if (String(value).trim() === '-1') {
    return true
  } else if (typeof value === 'string') {
    return Boolean(!value.trim().length)
  } else if (typeof value === 'function' || typeof value === 'number' || typeof value === 'boolean' || Object.prototype.toString.call(value) === '[object Date]') {
    return false
  } else if (Object.prototype.toString.call(value) === '[object Map]' || Object.prototype.toString.call(value) === '[object Set]') {
    return Boolean(!value.size)
  } else if (Array.isArray(value)) {
    return Boolean(!value.length)
  } else if (typeof value === 'object') {
    return Boolean(!Object.keys(value).length)
  }

  return true
}

export function typeValue(value) {
  if (typeof value === 'undefined' || value == null) {
    return value
  } else if (typeof value === 'string') {
    return 'STRING'
  } else if (typeof value === 'function') {
    return 'FUNCTION'
  } else if (typeof value === 'number') {
    if (value.isInteger()) {
      return 'INTEGER'
    }
    return 'DOUBLE'
  } else if (typeof value === 'boolean') {
    return 'BOOLEAN'
  } else if (Object.prototype.toString.call(value) === '[object Date]') {
    return 'DATE'
  } else if (Array.isArray(value)) {
    return 'ARRAY'
  } else if (typeof value === 'object') {
    return 'OBJECT'
  }
  return value
}

/**
 * zero pad
 * @param {number} number
 * @param {number} pad
 * @returns {string}
 */
export function zeroPad(number, pad = 2) {
  var zero = Number(pad) - number.toString().length + 1
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

/**
 * Convert a object to array pairs
 * @param {object} objectToConvert, object to convert
 * @param {string} nameKey, name from key in pairs
 * @param {string} nameValue, name from value in pairs
 * @returns {array} [ { nameKey: key, nameValue: value } ]
 */
export function convertObjectToArrayPairs(objectToConvert, nameKey = 'columnName', nameValue = 'value') {
  return Object.keys(objectToConvert).map(key => {
    const returnPairs = {}
    returnPairs[nameKey] = key
    returnPairs[nameValue] = objectToConvert[key]
    return returnPairs
  })
}

/**
 * Convert array pairs of object to simple object { key:value }
 * @param {array} arrayToConvert, object to convert
 * @param {string} nameKey, name from key in pairs
 * @param {string} nameValue, name from value in pairs
 */
export function convertArrayPairsToObject({
  arrayToConvert,
  nameKey = 'columnName',
  nameValue = 'value'
}) {
  const result = {}
  arrayToConvert.forEach(element => {
    result[element[nameKey]] = element[nameValue]
  })

  return result
}

export function convertHasMapToObject(hasMapToConvert) {
  const result = {}
  hasMapToConvert.forEach((value, key) => {
    result[key] = value
  })
  return result
}

export function convertFieldListToShareLink(fieldList) {
  var attributesListLink = ''
  fieldList.map(fieldItem => {
    // assign values
    var value = fieldItem.value
    var valueTo = fieldItem.valueTo

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
 * @param {object|array} treeData
 * @param {string} attributeName, key to get value, default id
 * @param {mixed}  attributeValue, value to compare with search
 * @param {string} attributeChilds, childs list into element
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
      if (!isEmptyValue(value) && value.hasOwnProperty(attributeName)) {
        value = value[attributeName]
      }
      if (!isEmptyValue(value) && secondAttribute && value.hasOwnProperty(secondAttribute)) {
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
    if (!isEmptyValue(value) && value.hasOwnProperty(attributeName)) {
      value = value[attributeName]
    }
    if (!isEmptyValue(value) && secondAttribute && value.hasOwnProperty(secondAttribute)) {
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
 * Parsed value to component type
 * @param {mixed} value, value to parsed
 * @param {string} fieldType, or componentPath
 * @param {string} referenceType, reference in ADempiere
 * @param {boolean} isMandatory, field is mandatory
 */
export function parsedValueComponent({ fieldType, value, referenceType, isMandatory = false }) {
  if ((value === undefined || value === null) && !isMandatory) {
    if (fieldType === 'FieldYesNo') {
      return Boolean(value)
    }
    return undefined
  }
  var returnValue

  switch (fieldType) {
    // data type Number
    case 'FieldNumber':
      if (String(value).trim() === '' || value === undefined || value === null) {
        returnValue = undefined
        if (isMandatory) {
          returnValue = 0
        }
      } else if (typeof value === 'object' && value.hasOwnProperty('query')) {
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
      if (value === 'false' || value === 'N') {
        value = false
      } else if (typeof value === 'object' && value.hasOwnProperty('query')) {
        returnValue = value
      }
      returnValue = Boolean(value)
      break

    // data type String
    case 'FieldText':
    case 'FieldTextArea':
      if (typeof value === 'object' && value.hasOwnProperty('query')) {
        returnValue = value
      }
      returnValue = value ? String(value) : undefined
      break

    // data type Date
    case 'FieldDate':
    case 'FieldTime ':
      if (String(value).trim() === '') {
        value = undefined
      }
      if (!isNaN(value)) {
        value = Number(value)
      }
      if (typeof value === 'number' || typeof value === 'string') {
        value = new Date(value)
      }
      if (typeof value === 'object' && value.hasOwnProperty('query')) {
        returnValue = value
      }
      returnValue = value
      break

    case 'FieldSelect':
      if (String(value).trim() === '') {
        value = undefined
      }
      if (typeof value === 'boolean') {
        value = value ? 'Y' : 'N'
      }
      if (referenceType === 'TableDirect') {
        if (value !== '' && value !== null && value !== undefined) {
          value = Number(value)
        }
      } // Search or List
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

let partialValue = ''
export function calculationValue(value, event) {
  const VALIDATE_EXPRESSION = /[^\d\/.()%\*\+\-]/gim
  if (!this.isEmptyValue(event) && !VALIDATE_EXPRESSION.test(event.key)) {
    partialValue += event.key
    const operation = String(value) + partialValue
    if (!isEmptyValue(operation)) {
      try {
        // eslint-disable-next-line no-eval
        return eval(operation) + ''
      } catch (error) {
        return null
      }
    }
  } else {
    if (value.key === 'Backspace') {
      partialValue = partialValue.slice(0, -1)
    } else {
      return null
    }
  }
}

export function clearVariables() {
  partialValue = ''
}
