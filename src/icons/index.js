import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component
import ElIcon from '@/components/ElIcon'

// register globally
Vue.component('svg-icon', SvgIcon)
Vue.component('el-icon', ElIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
