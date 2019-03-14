
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';

/**
 * 用法
 * <el-table height="50" ref="table" v-el-height-adaptive-table="{table: $refs.table}">...</el-table>
 * 必须设置 height,可以任意值
 */
export default{
  bind(el, binding, vnode, oldVnode) {
    el.data = {}
    el.resizeListener = () => {
      let data = el.data

      if (!data.table) {
        return
      }
      let height = window.innerHeight - el.offsetTop - data.bottomHeight - data.topHeight;

      data.table.layout.setHeight(height)
      data.table.doLayout()
    }
    addResizeListener(el, el.resizeListener)
  },
  /**
   *
   * @param {*} el
   * @param {*} binding
   * binding.value 格式为 {
   *      table: $refs.table, //  表格对象
   *      topHeight: 140      //  表格顶边 距离顶部高度，默认值为  140
   *      bottomHeight: 120   //  表格底部 距离底部高度，默认值为  120
   * }
   * @param {*} vnode
   * @param {*} oldVnode
   */
  update(el, binding, vnode, oldVnode) {
    if (el.heightInited) {
      return
    }
    let topHeight = binding.value.topHeight ? binding.value.topHeight : 140
    let bottomHeight = binding.value.bottomHeight ? binding.value.bottomHeight : 120

    let table = binding.value.table

    el.data.table = table
    el.data.topHeight = topHeight
    el.data.bottomHeight = bottomHeight

    let height = window.innerHeight - el.offsetTop - bottomHeight - topHeight

    table.layout.setHeight(height)
    table.doLayout()

    el.heightInited = true;

  },
  unbind(el) {
    removeResizeListener(el, el.resizeListener)
  }
}
