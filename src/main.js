import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'// normalize.css 样式格式化
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '@/assets/iconfont/iconfont' // iconfont 具体图标见https://github.com/PanJiaChen/vue-element-admin/wiki
import IconSvg from '@/components/Icon-svg'// svg组件
import * as filters from '@/filters' // 全局filter
import '@/errorLog'// error log
import '@/permission' // 权限
import '@/mock/index.js'  // 该项目所有请求使用mockjs模拟

// register globally
Vue.component('icon-svg', IconSvg)
Vue.use(ElementUI)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


