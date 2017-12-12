import Vue from 'vue'
import errLog from '@/store/errorLog'

// you can set only in production env show the error-log
// if (process.env.NODE_ENV === 'production') {
Vue.config.errorHandler = function(err, vm, info) {
  errLog.pushLog({
    err,
    vm,
    info,
    url: window.location.href
  })
  console.error(err, info)
}
// }
