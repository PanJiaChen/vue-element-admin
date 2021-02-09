// A util class for handle format for time, date and others values to beused to display information
// Note that this file use moment library for a easy conversion
import moment from 'moment'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import store from '@/store'
import { DATE, DATE_PLUS_TIME, TIME, AMOUNT, COSTS_PLUS_PRICES, NUMBER, QUANTITY } from '@/utils/ADempiere/references.js'

/**
 * Convert string values ('Y' or 'N') to component compatible Boolean values
 * @param {mixed} valueToParsed
 */
export const convertStringToBoolean = (valueToParsed) => {
  const valueString = String(valueToParsed).trim()
  if (valueString === 'N' || valueString === 'false') {
    return false
  } else if (valueString === 'Y' || valueString === 'true') {
    return true
  }

  return valueToParsed
}

export const convertBooleanToString = (booleanValue) => {
  if (booleanValue || booleanValue === 'true') {
    return 'Y'
  }
  return 'N'
}

/**
 * Convert a object to array pairs
 * @param {object} object, object to convert
 * @param {string} nameKey, name from key in pairs
 * @param {string} nameValue, name from value in pairs
 * @returns {array} [ { nameKey: key, nameValue: value } ]
 */
export function convertObjectToKeyValue({
  object,
  keyName = 'columnName',
  valueName = 'value'
}) {
  return Object.keys(object).map(key => {
    const returnPairs = {}
    returnPairs[keyName] = key
    returnPairs[valueName] = object[key]
    return returnPairs
  })
}

/**
 * Convert array pairs of object to literal object { key: value }
 * @param {array} array, Array to convert
 * @param {string} keyName, name from key in pairs
 * @param {string} valueName, name from value in pairs
 * @returns {object} { key: value, key2: value2 }
 */
export function convertArrayKeyValueToObject({
  array,
  keyName = 'columnName',
  valueName = 'value'
}) {
  const result = {}
  array.forEach(element => {
    result[element[keyName]] = element[valueName]
  })

  return result
}

/**
 * Convert map of pairs to literal object
 * @param {object} object
 * @returns {map}
 */
export function convertObjectToHasMap({ object }) {
  return new Map(
    Object.entries(object)
  )
}

/**
 * Convert map of pairs to literal object
 * @param {map} hasMapToConvert
 * @returns {object} { key: value, key2: value2 }
 */
export function convertHasMapToObject({ map }) {
  return Object.fromEntries(map)
  // const result = {}
  // map.forEach((value, key) => {
  //   result[key] = value
  // })
  // return result
}

// This function just convert all java date format to moment format.
// For know about java format pattern see: https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
// Also you can read moment docus: https://momentjs.com/docs/
export function convertDateFormat(dateFormat) {
  return dateFormat
    //	Year
    .replace(/\byy\b/g, 'YY')
    .replace(/\byyyy\b/g, 'YYYY')
    //	Short Day of month
    .replace(/\bdd\b/g, 'DD')
    // Week of Year
    .replace(/\bw\b/g, 'W')
    // Long Day
    .replace(/\bEEE\b/g, 'ddd')
    .replace(/\bu\b/g, 'dddd')
    // Hour
    .replace(/\bhh\b/g, 'h')
    .replace(/\bK\b/g, 'h')
    .replace(/\baaa\b/g, 'a')
    // Hour 24
    .replace(/\bk\b/g, 'HH')
    // Day of Year
    .replace(/\bD\b/g, 'DDD')
    // Day of Week
    .replace(/\bF\b/g, 'R')
    // Time zone
    .replace(/\bz\b/g, 'Z')
}

// Format a date with specific format, if format is void use default date format for language
export function formatDate(date, isTime = false) {
  if (isEmptyValue(date)) {
    return undefined
  }
  //  Format
  return moment.utc(date).format(getDateFormat({
    isTime
  }))
}

//  Get Formatted Price
export function formatPrice(number, currency) {
  if (this.isEmptyValue(number)) {
    return undefined
  }
  if (this.isEmptyValue(currency)) {
    currency = getCurrency()
  }
  //  Get formatted number
  return new Intl.NumberFormat(getCountryCode(), {
    style: 'currency',
    currency
  }).format(number)
}

//  Format Quantity
export function formatQuantity(number) {
  if (this.isEmptyValue(number)) {
    return undefined
  }
  if (!Number.isInteger(number)) {
    return number
  }
  return Number.parseFloat(number).toFixed(2)
  //  Get formatted number
}

// Format percentage based on Intl library
export function formatPercent(number) {
  if (this.isEmptyValue(number)) {
    return undefined
  }
  //  Get formatted number
  return new Intl.NumberFormat(getCountryCode(), {
    style: 'percent'
  }).format(number)
}

//  Get country code from store
function getCountryCode() {
  const languageDefinition = store.getters.getCurrentLanguageDefinition
  return languageDefinition.languageISO + '-' + languageDefinition.countryCode
}

// Get Default country
function getCurrency() {
  const currencyDefinition = store.getters.getCurrency
  return currencyDefinition.iSOCode
}

// Return a format for field depending of reference for him
export function formatField(value, reference, optionalFormat) {
  if (isEmptyValue(value)) {
    return undefined
  }
  if (!reference) {
    return value
  }
  //  Format
  let formattedValue
  switch (reference) {
    case DATE.id:
      formattedValue = moment.utc(value).format(getDateFormat({
        format: optionalFormat
      }))
      break
    case DATE_PLUS_TIME.id:
      formattedValue = moment.utc(value).format(getDateFormat({
        isTime: true
      }))
      break
    case TIME.id:
      formattedValue = moment.utc(value).format(getDateFormat({
        isTime: true
      }))
      break
    case AMOUNT.id:
      formattedValue = formatPrice(value)
      break
    case COSTS_PLUS_PRICES.id:
      formattedValue = formatPrice(value)
      break
    case NUMBER.id:
      formattedValue = formatQuantity(value)
      break
    case QUANTITY.id:
      formattedValue = formatQuantity(value)
      break
    default:
      formattedValue = value
  }
  return formattedValue
}

// Get default format without format pattern
export function getDefaultFormat(isTime) {
  return getDateFormat({
    isTime
  })
}

// Get default format or optional
function getDateFormat({
  format,
  isTime
}) {
  if (format) {
    return format
  }
  //  Else
  const languageDefinition = store.getters['getCurrentLanguageDefinition']
  if (languageDefinition) {
    return isTime ? languageDefinition.timePattern : languageDefinition.datePattern
  }
}

/**
 * Removes the % of a text string, only from the beginning and end if they exist,
 * this in case you need to use a match or local search to find matches between
 * text strings.
 * @param {string} stringToParsed ej: '%qwerty asd%' | '%zxc 123'
 * @returns {string} ej: 'qwerty asd' | 'zxc 123'
 */
export function trimPercentage(stringToParsed) {
  if (!isEmptyValue(stringToParsed) && String(stringToParsed).includes('%')) {
    let parsedValue = stringToParsed
    if (parsedValue[0] === '%') {
      parsedValue = parsedValue.slice(1)
    }

    const wordSize = parsedValue.length - 1
    if (parsedValue[wordSize] === '%') {
      parsedValue = parsedValue.slice(0, wordSize)
    }
    return parsedValue
  }
  return stringToParsed
}
