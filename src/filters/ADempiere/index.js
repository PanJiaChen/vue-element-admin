import moment from 'moment'

/**
 *
 * @param {number} value
 * @param {string} type, Date, DateTime, Time
 */
export function formatDate(value, referenceType = 'DateTime') {
  if (typeof value === 'number') {
    var dateTime = moment.utc(value)
    var format = 'YYYY-MM-DD HH:mm'
    if (referenceType === 'Time') {
      format = 'HH:mm'
    } else if (referenceType === 'Date') {
      format = 'YYYY-MM-DD'
    }
    return dateTime.format(format)
  }
  return null
}
