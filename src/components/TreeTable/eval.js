import Vue from 'vue'

// Flattened array
export default function treeToArray(data, children = 'children') {
  let tmp = []
  data.forEach((item, index) => {
    Vue.set(item, '_index', index)
    tmp.push(item)
    if (item[children] && item[children].length > 0) {
      const res = treeToArray(item[children], children)
      tmp = tmp.concat(res)
    }
  })
  return tmp
}

export function addAttrs(data, { parent = null, preIndex = false, level = 0, expand = false, children = 'children', show = true, select = false } = {}) {
  data.forEach((item, index) => {
    const _id = (preIndex ? `${preIndex}-${index}` : index) + ''
    Vue.set(item, '_id', _id)
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
        preIndex: _id,
        children,
        status,
        select
      })
    }
  })
}

export function cleanParentAttr(data, children = 'children') {
  data.forEach(item => {
    item._parent = null
    if (item[children] && item[children].length > 0) {
      addAttrs(item[children], children)
    }
  })
  return data
}
