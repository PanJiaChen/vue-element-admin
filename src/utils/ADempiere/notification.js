import { Message, Notification } from 'element-ui'
import language from '@/lang'
import router from '@/router'

export function hasTranslation(text) {
  const hasKey = language.te('notifications.' + text)
  if (hasKey) {
    const translatedText = language.t('notifications.' + text)
    return translatedText
  }
  return text
}

/**
 *
 * @param {string} type, required
 * @param {string} title, required
 * @param {object} message
 * @param {string} summary
 * @param {string} name
 * @param {array} logs
 */
export function showNotification({ type = 'success', title, message, summary, name, logs = [], isRedirect = true }) {
  title = hasTranslation(title)
  if (message) {
    message = hasTranslation(message)
  }
  // For summary
  if (summary) {
    if (message) {
      message = `${message} <br> ${summary}`
    } else {
      message = summary
    }
  }
  // For logs
  if (logs && logs.length) {
    logs.forEach(logResult => {
      if (logResult) {
        message = `${message} <br> ${logResult.log}`
      }
    })
  }
  if (name) {
    message = `${name} ${message}`
  }

  return Notification({
    title,
    message: `
      <div style="max-height: 100px; overflow-y: auto;">
        ${message}
      </div>
    `,
    type,
    position: 'bottom-right',
    dangerouslyUseHTMLString: true,
    onClick() {
      if (isRedirect) {
        router.push({
          name: 'ProcessActivity'
        }, () => {})
      }
    }
  })
}

/**
 *
 * @param {string} type
 * @param {string} message
 * @param {number} duration
 */
export function showMessage({ type = 'success', message, duration = 0 }) {
  let delay = 3000
  if (type === 'info') {
    delay = 2000
  }
  if (duration) {
    delay = duration
  }

  return Message({
    message,
    type,
    showClose: true,
    duration: delay
  })
}
