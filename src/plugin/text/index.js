// 注册install 方法可以实现插件引用

import Component from './src/index'
Component.install = Vue => {
  Vue.component(Component.name, Component)
}

export default Component
