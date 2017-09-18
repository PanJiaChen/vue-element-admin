import Vue from 'vue'
import IconSvg from '@/components/Icon-svg'// svg组件
import generateIconsView from '@/views/svg-icons/generateIconsView.js'// just for views/icons , you can delete it
// register globally

Vue.component('icon-svg', IconSvg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
const iconMap = requireAll(req)

generateIconsView.generate(iconMap) // just for views/icons , you can delete it
