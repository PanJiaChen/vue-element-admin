/*
自定义组件插件化，提供对外的按需加载
处理插件的入口
*/

import Text from './text'

const components = [
  Text
]
// 定义全局变量
const rigester_component = {}
components.forEach(item => {
  rigester_component[item.name] = item
})

export {
  rigester_component
}
