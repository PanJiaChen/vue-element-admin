import Vue from 'vue'

// 给数据添加额外的几个属性，并且扁平化数组
export default function treeToTable(
  data,
  { parent = null, leavel = 0, expand = false, children = 'children', show = true, select = false } = {}
) {
  let tmp = []
  data.forEach(item => {
    Vue.set(item, '__leavel', leavel)
    Vue.set(item, '__expand', expand)
    Vue.set(item, '__parent', parent)
    Vue.set(item, '__show', show)
    Vue.set(item, '__select', select)

    tmp.push(item)
    if (item[children] && item[children].length > 0) {
      const res = treeToTable(item[children], {
        parent: item,
        leavel: leavel + 1,
        expand,
        children,
        status,
        select
      })
      tmp = tmp.concat(res)
    }
  })
  return tmp
}
