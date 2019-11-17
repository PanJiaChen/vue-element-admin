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
 * @param {object} parameters
 * @param {object} parameters.type, required
 * @param {object} parameters.title, required
 * @param {object} parameters.message, required
 * @param {object} parameters.summary, required
 * @param {object} parameters.name, required
 */
export function showNotification(parameters) {
  var title = hasTranslation(parameters.title)
  var message = ''
  if (parameters.message) {
    message = hasTranslation(parameters.message)
  }
  //  For summary
  if (parameters.summary) {
    if (message) {
      message = message + '<br>' + parameters.summary
    } else {
      message = parameters.summary
    }
  }
  //  For logs
  if (parameters.logs) {
    parameters.logs.forEach(logResult => {
      if (logResult) {
        message = message + '<br>' + logResult.log
      }
    })
  }
  if (parameters.name) {
    message = parameters.name + message
  }
  Notification({
    title: title,
    message: `<div style="max-height: 100px; overflow-y: auto;">` + message + `</div>`,
    type: parameters.type,
    position: 'bottom-right',
    dangerouslyUseHTMLString: true,
    onClick() {
      router.push({ name: 'ProcessActivity' })
    }
  })
}

export function showMessage(parameters) {
  var delay = 3000
  if (parameters.type === 'info') {
    delay = 2000
  }
  if (parameters.duration) {
    delay = parameters.duration
  }
  Message({
    message: parameters.message,
    type: parameters.type,
    showClose: true,
    duration: delay
  })
}
