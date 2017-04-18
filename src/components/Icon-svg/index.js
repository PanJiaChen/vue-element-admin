import Vue from 'vue'

function registerAllComponents(requireContext) {
  return requireContext.keys().forEach(comp => {
    const vueComp = requireContext(comp)
    const compName = vueComp.name ? vueComp.name.toLowerCase() : /\/([\w-]+)\.vue$/.exec(comp)[1]
    Vue.component(compName, vueComp)
  })
}

registerAllComponents(require.context('./', false, /\.vue$/))
