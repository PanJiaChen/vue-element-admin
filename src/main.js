import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import VueSplit from 'vue-split-panel'
import 'vue-resize/dist/vue-resize.css'
import VueResize from 'vue-resize'
/**
 * TODO: Waiting for PR to:
 * https://github.com/vue-extend/v-markdown/pull/4
 * To change:
 * import VMarkdown from 'v-markdown'
 */
import VMarkdown from 'v-markdown/src'

import VueShortkey from 'vue-shortkey'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import * as globalMethods from '@/utils/ADempiere/globalMethods' // global methods

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.use(VueCompositionApi)
Vue.use(VMarkdown)
Vue.use(VueShortkey)
Vue.use(VueSplit)
Vue.use(VueResize)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value),
  locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// register global utility methods
Object.keys(globalMethods).forEach(key => {
  Vue.prototype[key] = globalMethods[key]
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
