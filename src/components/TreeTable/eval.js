import Vue from 'vue'

// 扁平化数组
export default function treeToArray(data, children = 'children') {
  let tmp = []
  data.forEach((item, idx) => {
    Vue.set(item, '__index', idx)
    tmp.push(item)
    if (item[children] && item[children].length > 0) {
      const res = treeToArray(item[children], children)
      tmp = tmp.concat(res)
    }
  })
  return tmp
}

// 给数据添加额外的几个属性
// 清除__parent属性，因数据循环引用，使用JSON.stringify()报错
export function addAttrs(data, { parent = null, level = 0, expand = false, children = 'children', show = true, select = false } = {}) {
  data.forEach((item, idx) => {
    Vue.set(item, '__level', level)
    Vue.set(item, '__expand', expand)
    Vue.set(item, '__parent', parent)
    Vue.set(item, '__show', show)
    Vue.set(item, '__select', select)
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

// 清除__parent属性
export function cleanAttrs(data, children = 'children') {
  data.forEach(item => {
    item.__parent = null
    if (item[children] && item[children].length > 0) {
      addAttrs(item[children], children)
    }
  })
  return data
}

