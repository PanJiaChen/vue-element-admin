import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertBooleanToString } from '@/utils/ADempiere/valueFormat.js'
import evaluator from '@/utils/ADempiere/evaluator'
import store from '@/store'

export default evaluator

// get context state from vuex store
export const getContext = ({
  parentUuid,
  containerUuid,
  columnName
}) => {
  let value
  const isPreferenceValue = columnName.startsWith('$') ||
    columnName.startsWith('#') ||
    columnName.startsWith(`P|`)
  if (isPreferenceValue) {
    value = store.getters.getPreference({
      parentUuid,
      containerUuid,
      columnName
    })
  }
  if (!isPreferenceValue && isEmptyValue(value)) {
    value = store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName
    })
  }
  return value
}

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
  let value
  if (isEmptyValue(columnName)) {
    console.warn('Require Context ColumnName')
    return value
  }

  //        USER PREFERENCES
  // View Preferences
  if (parentUuid) {
    value = getContext({
      parentUuid: 'P' + parentUuid,
      containerUuid,
      columnName
    })
    if (!isEmptyValue(value)) {
      return value
    }
  }

  //  Global Preferences
  value = getContext({
    columnName: 'P|' + columnName
  })
  if (!isEmptyValue(value)) {
    return value
  }

  //        SYSTEM PREFERENCES
  // Login setting
  // get # globals context only window
  value = getContext({
    columnName: '#' + columnName
  })
  if (!isEmptyValue(value)) {
    return value
  }

  //  Accounting setting
  value = getContext({
    columnName: '$' + columnName
  })

  return value
} // get preference value

/**
 * Extracts the associated fields from the logics or default values
 * @param {string} displayLogic
 * @param {string} mandatoryLogic
 * @param {string} readOnlyLogic
 * @param {object} reference
 * @param {string} defaultValue
 * @returns {array} List column name of parent fields
 */
export function getParentFields({
  displayLogic,
  mandatoryLogic,
  readOnlyLogic,
  reference,
  defaultValue
}) {
  const parentFields = Array.from(new Set([
    //  For Display logic
    ...evaluator.parseDepends(displayLogic),
    //  For Mandatory Logic
    ...evaluator.parseDepends(mandatoryLogic),
    //  For Read Only Logic
    ...evaluator.parseDepends(readOnlyLogic),
    //  For Default Value
    ...evaluator.parseDepends(defaultValue)
  ]))
  //  Validate reference
  if (!isEmptyValue(reference)) {
    parentFields.push(...evaluator.parseDepends(reference.validationCode))
  }
  return parentFields
}

export const specialColumns = [
  'C_AcctSchema_ID',
  'C_Currency_ID',
  'C_Convertion_Type_ID'
]

/**
 * Parse Context String
 * @param {string} value: (REQUIRED) String to parsing
 * @param {string} parentUuid: (REQUIRED from Window) UUID Window
 * @param {string} containerUuid: (REQUIRED) UUID Tab, Process, SmartBrowser, Report and Form
 * @param {string} columnName: (Optional if exists in value) Column name to search in context
 * @param {boolean} isBooleanToString, convert boolean values to string ('Y' or 'N')
 * @param {boolean} isSQL
 * @param {boolean} isSOTrxMenu
 */
export function parseContext({
  parentUuid,
  containerUuid,
  columnName,
  value,
  isSQL = false,
  isBooleanToString = false,
  isSOTrxMenu
}) {
  let isError = false
  const errorsList = []

  if (isEmptyValue(value)) {
    value = undefined
    if (specialColumns.includes(columnName)) {
      value = contextInfo = getContext({
        columnName: '$' + columnName
      })
    }

    return {
      value,
      isError: true,
      errorsList
    }
  }
  value = String(value).replace('@SQL=', '')
  // const instances = value.length - value.replace('@', '').length
  // if ((instances > 0) && (instances % 2) !== 0) { // could be an email address
  //   return value
  // }

  let token, contextInfo
  let inString = value
  let outString = ''

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

    contextInfo = getContext({
      parentUuid,
      containerUuid,
      columnName
    }) // get context

    if (isEmptyValue(contextInfo)) {
      // get global context
      if (token.startsWith('#') || token.startsWith('$')) {
        contextInfo = getContext({
          columnName
        })
      } else {
        // get accounting context
        if (specialColumns.includes(columnName)) {
          contextInfo = getContext({
            columnName: '$' + columnName
          })
        }
      }
    }

    // menu attribute isEmptyValue isSOTrx
    if (!isEmptyValue(isSOTrxMenu) && token === 'IsSOTrx' && isEmptyValue(contextInfo)) {
      contextInfo = isSOTrxMenu
    }

    if ((isBooleanToString || isSQL) && typeof contextInfo === 'boolean') {
      contextInfo = convertBooleanToString(contextInfo)
    }

    if (isEmptyValue(contextInfo)) {
      // console.info(`No Context for: ${token}`)
      isError = true
      errorsList.push(token)
    } else {
      if (['object', 'boolean'].includes(typeof contextInfo)) {
        outString = contextInfo
      } else {
        outString = outString + contextInfo // replace context with Context
      }
    }

    inString = inString.substring(secondIndexTag + 1, inString.length) // from second @
    firstIndexTag = inString.indexOf('@')
  } // end while loop

  if (!['object', 'boolean'].includes(typeof contextInfo)) {
    outString = outString + inString // add the rest of the string
  }
  if (isSQL) {
    return {
      errorsList,
      isError,
      isSQL,
      query: outString,
      value: contextInfo
    }
  }
  return {
    errorsList,
    isError,
    isSQL,
    value: outString
  }
} // parseContext
