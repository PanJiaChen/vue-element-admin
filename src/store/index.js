import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#require-context
const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((acc, cur) => {
  // set './app.js' => 'app'
  const key = cur.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(cur)
  acc[key] = value.default
  return acc
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
