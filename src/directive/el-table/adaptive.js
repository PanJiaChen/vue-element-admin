
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

/**
 * How to use
 * <el-table height="100px" v-el-height-adaptive-table="{bottomOffset: 30}">...</el-table>
 * el-table height is must be set
 *  bottomOffset: 30(default)   // The height of the table from the bottom of the page.
 */
export default {
  bind(el, binding, vnode) {
    const { componentInstance: $table } = vnode
    const { value } = binding

    if (!$table.height) {
      throw new Error(`el-$table must set the height. Such as height='100px'`)
    }

    const bottomOffset = (value && value.bottomOffset) || 30

    el.resizeListener = () => {
      if (!$table) return

      const height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset
      $table.layout.setHeight(height)
      $table.doLayout()
    }

    addResizeListener(el, el.resizeListener)
  },
  unbind(el) {
    el.data = null
    removeResizeListener(el, el.resizeListener)
  }
}
