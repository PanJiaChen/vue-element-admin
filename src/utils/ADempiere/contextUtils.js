import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import evaluator from '@/utils/ADempiere/evaluator'

export default evaluator

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
 * @param {object} context
 *  - value: (REQUIRED) String to parsing
 *  - parentUuid: (REQUIRED from Window) UUID Window
 *  - containerUuid: (REQUIRED) UUID Tab, Process, SmartBrowser, Report and Form
 *  - columnName: (Optional if exists in value) Column name to search in context
 * @param {boolean} isBoolToString, convert boolean values to string
 */
export function parseContext(context, isBoolToString = false) {
  const store = require('@/store')
  var value = String(context.value)
  var valueSQL = {}
  if (isEmptyValue(value)) {
    return ''
  }
  if (value.includes('@SQL=')) {
    value = value.replace('@SQL=', '')
  }
  // var instances = value.length - value.replace('@', '').length
  // if ((instances > 0) && (instances % 2) !== 0) { // could be an email address
  //   return value
  // }

  var token
  var inStr = value
  var outStr = ''

  var i = inStr.indexOf('@')

  while (i !== -1) {
    outStr = outStr + inStr.substring(0, i) // up to @
    inStr = inStr.substring(i + 1, inStr.length)	// from first @
    var j = inStr.indexOf('@') // next @
    if (j < 0) {
      console.log('No second tag: ' + inStr)
      return ''	//	no second tag
    }

    token = inStr.substring(0, j)
    context.columnName = token

    var ctxInfo = store.default.getters.getContext(context)	// get context
    if (isBoolToString && typeof ctxInfo === 'boolean') {
      if (ctxInfo) {
        ctxInfo = 'Y'
      } else {
        ctxInfo = 'N'
      }
    }

    if ((ctxInfo === undefined || ctxInfo.length === 0) && (token.startsWith('#') || token.startsWith('$'))) {
      context.parentUuid = undefined
      context.containerUuid = undefined
      ctxInfo = store.default.getters.getContext(context)	// get global context
    }
    if (ctxInfo === undefined || ctxInfo.length === 0) {
      console.info('No Context for: ' + token)
    } else {
      if (typeof ctxInfo === 'object') {
        outStr = ctxInfo
      } else {
        outStr = outStr + ctxInfo // replace context with Context
      }
    }

    inStr = inStr.substring(j + 1, inStr.length)	// from second @
    i = inStr.indexOf('@')
  }
  if (typeof ctxInfo !== 'object') {
    outStr = outStr + inStr	// add the rest of the string
  }
  if (context.isSQL) {
    valueSQL['query'] = outStr
    valueSQL['value'] = ctxInfo
    return valueSQL
  }
  return outStr
}	//	parseContext
