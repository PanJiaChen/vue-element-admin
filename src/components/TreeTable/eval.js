import Vue from 'vue'

// Flattened array
export default function treeToArray(data, children = 'children') {
  let tmp = []
  data.forEach((item, idx) => {
    Vue.set(item, '_index', idx)
    tmp.push(item)
    if (item[children] && item[children].length > 0) {
      const res = treeToArray(item[children], children)
      tmp = tmp.concat(res)
    }
  })
  return tmp
}

export function addAttrs(data, { parent = null, level = 0, expand = false, children = 'children', show = true, select = false } = {}) {
  data.forEach(item => {
    Vue.set(item, '_level', level)
    Vue.set(item, '_expand', expand)
    Vue.set(item, '_parent', parent)
    Vue.set(item, '_show', show)
    Vue.set(item, '_select', select)
    if (item[children] && item[children].length > 0) {
      addAttrs(item[children], {
        parent: item,
        level: level + 1,
        expand,
        children,
        status,
        select
      })
    }
  })
}

export function cleanAttrs(data, children = 'children') {
  data.forEach(item => {
    item._parent = null
    if (item[children] && item[children].length > 0) {
      addAttrs(item[children], children)
    }
  })
  return data
}
