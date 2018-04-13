import drag from './drag'

const install = function(Vue) {
  Vue.directive('el-drag-dialog', drag)
}

if (window.Vue) {
  window['el-drag-dialog'] = drag
  Vue.use(install); // eslint-disable-line
}

drag.install = install
export default drag
