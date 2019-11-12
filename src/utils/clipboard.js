import Vue from 'vue'
import Clipboard from 'clipboard'

const VueClipboardConfig = {
  autoSetContainer: false,
  appendToBody: true // This fixes IE, see #50
}

function clipboardSuccess(successText) {
  Vue.prototype.$message({
    message: successText || 'Copy successfully',
    type: 'success',
    duration: 1500
  })
}

function clipboardError(errorText) {
  Vue.prototype.$message({
    message: errorText || 'Copy failed',
    type: 'error'
  })
}

export default function handleClipboard({ text, container, successText, errorText } = {}) {
  return new Promise(function(resolve, reject) {
    var fakeElement = document.createElement('button')
    var clipboard = new Clipboard(fakeElement, {
      text: function() { return text },
      action: function() { return 'copy' },
      container: typeof container === 'object' ? container : document.body
    })

    clipboard.on('success', function(e) {
      clipboard.destroy()
      clipboardSuccess(successText)
      resolve(e)
    })
    clipboard.on('error', function(e) {
      clipboard.destroy()
      clipboardError(errorText)
      reject(e)
    })
    if (VueClipboardConfig.appendToBody) document.body.appendChild(fakeElement)
    fakeElement.click()
    if (VueClipboardConfig.appendToBody) document.body.removeChild(fakeElement)
  })
}
