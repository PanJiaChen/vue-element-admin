import Vue from 'vue'

// 给数据添加额外的几个属性，并且扁平化数组
export default function formatData(
  data,
  { parent = null, leavel = 0, expand = false } = {}
) {
  console.log('data', data)
  let tmp = []
  data.forEach(item => {
    Vue.set(item, '__leavel', leavel)
    Vue.set(item, '__expand', expand)
    Vue.set(item, '__parent', parent)

    tmp.push(item)
    if (item.children && item.children.length > 0) {
      const children = formatData(item.children, {
        parent: item,
        leavel: leavel + 1
      })
      tmp = tmp.concat(children)
    }
  })
  return tmp
}
