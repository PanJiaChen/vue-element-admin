import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import evaluator from '@/utils/ADempiere/evaluator'
import store from '@/store'

export default evaluator

// get context state from vuex store
export const getContext = ({
  parentUuid,
  containerUuid,
  columnName
}) => {
  return store.getters.getContext({
    parentUuid,
    containerUuid,
    columnName
  })
}

/**
 * Extracts the associated fields from the logics or default values
 * @param {string} displayLogic
 * @param {string} mandatoryLogic
 * @param {string} readOnlyLogic
 * @param {string} defaultValue
 */
export function getParentFields({ displayLogic, mandatoryLogic, readOnlyLogic, defaultValue }) {
  let parentFields = []
  //  For Display logic
  if (displayLogic) {
    parentFields = Array.from(new Set([
      ...parentFields,
      ...evaluator.parseDepends(displayLogic)
    ]))
  }
  //  For Mandatory Logic
  if (mandatoryLogic) {
    parentFields = Array.from(new Set([
      ...parentFields,
      ...evaluator.parseDepends(mandatoryLogic)
    ]))
  }
  //  For Read Only Logic
  if (readOnlyLogic) {
    parentFields = Array.from(new Set([
      ...parentFields,
      ...evaluator.parseDepends(readOnlyLogic)
    ]))
  }
  //  For Default Value
  if (defaultValue) {
    parentFields = Array.from(new Set([
      ...parentFields,
      ...evaluator.parseDepends(defaultValue)
    ]))
  }
  return parentFields
}

/**
 * Parse Context String
 * @param {string} value: (REQUIRED) String to parsing
 * @param {string} parentUuid: (REQUIRED from Window) UUID Window
 * @param {string} containerUuid: (REQUIRED) UUID Tab, Process, SmartBrowser, Report and Form
 * @param {string} columnName: (Optional if exists in value) Column name to search in context
 * @param {boolean} isBooleanToString, convert boolean values to string
 */
export function parseContext({
  parentUuid,
  containerUuid,
  columnName,
  value,
  isSQL = false,
  isBooleanToString = false
}) {
  let isError = false
  const errorsList = []
  value = String(value)

  if (isEmptyValue(value)) {
    return {
      value: undefined,
      isError: true,
      errorsList: []
    }
  }
  if (value.includes('@SQL=')) {
    value = value.replace('@SQL=', '')
  }
  // var instances = value.length - value.replace('@', '').length
  // if ((instances > 0) && (instances % 2) !== 0) { // could be an email address
  //   return value
  // }

  var token
  var inString = value
  var outString = ''

  let firstIndexTag = inString.indexOf('@')

  while (firstIndexTag !== -1) {
    outString = outString + inString.substring(0, firstIndexTag) // up to @
    inString = inString.substring(firstIndexTag + 1, inString.length) // from first @
    const secondIndexTag = inString.indexOf('@') // next @
    // no exists second tag
    if (secondIndexTag < 0) {
      console.info(`No second tag: ${inString}`)
      return {
        value: undefined,
        isError: true,
        errorsList,
        isSQL
      }
    }

    token = inString.substring(0, secondIndexTag)
    columnName = token

    var contextInfo = getContext({
      parentUuid,
      containerUuid,
      columnName
    }) // get context
    if (isBooleanToString && typeof contextInfo === 'boolean') {
      if (contextInfo) {
        contextInfo = 'Y'
      } else {
        contextInfo = 'N'
      }
    }

    if ((contextInfo === undefined || contextInfo.length === 0) &&
      (token.startsWith('#') || token.startsWith('$'))) {
      contextInfo = getContext({
        columnName
      }) // get global context
    }
    if (contextInfo === undefined || contextInfo.length === 0) {
      console.info(`No Context for: ${token}`)
      isError = true
      errorsList.push(token)
    } else {
      if (typeof contextInfo === 'object') {
        outString = contextInfo
      } else {
        outString = outString + contextInfo // replace context with Context
      }
    }

    inString = inString.substring(secondIndexTag + 1, inString.length) // from second @
    firstIndexTag = inString.indexOf('@')
  }
  if (typeof contextInfo !== 'object') {
    outString = outString + inString // add the rest of the string
  }
  if (isSQL) {
    return {
      query: outString,
      value: contextInfo,
      isSQL
    }
  }
  return {
    value: outString,
    isError,
    errorsList,
    isSQL
  }
} // parseContext

/**
 *  Get Preference.
 *  <pre>
 *      0)  Current Setting
 *      1)  Window Preference
 *      2)  Global Preference
 *      3)  Login settings
 *      4)  Accounting settings
 *  </pre>
 *  @param  {string} parentUuid UUID Window
 *  @param  {string} containerUuid  UUID Tab, Process, SmartBrowser, Report and Form
 *  @param  {string}  columnName (context)  Entity to search
 *  @return preference value
 */
export function getPreference({
  parentUuid,
  containerUuid,
  columnName
}) {
  let retValue
  if (isEmptyValue(columnName)) {
    console.warn('Require Context ColumnName')
    return retValue
  }

  //        USER PREFERENCES
  // View Preferences
  retValue = getContext({
    parentUuid: 'P' + parentUuid,
    containerUuid,
    columnName: columnName
  })
  if (!isEmptyValue(retValue)) {
    return retValue
  }

  //  Global Preferences
  retValue = getContext({
    columnName: 'P|' + columnName
  })
  if (!isEmptyValue(retValue)) {
    return retValue
  }

  //        SYSTEM PREFERENCES
  // Login setting
  // get # globals context only window
  retValue = getContext({
    columnName: '#' + columnName
  })
  if (!isEmptyValue(retValue)) {
    return retValue
  }

  //  Accounting setting
  retValue = getContext({
    columnName: '$' + columnName
  })

  return retValue
} //  getPreference
