import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)
const modulesFiles = require.context('./modules', false, /\.js$/)
const modules = {}
modulesFiles.keys().forEach(item => {
  const key = item.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(item)
  modules[key] = value.default
})
const store = new Vuex.Store({
  modules,
  getters
})

export default store
