export default {
  bind(el, binding, vnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function() {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    const handleDialogMouseMove = (e, sty = { left: 0, top: 0 }, dis = { x: 0, y: 0 }, dragDomBoundary = { minDragDomTop: 0, maxDragDomTop: 0, minDragDomLeft: 0, maxDragDomLeft: 0 }) => {
      // 通过事件委托，计算移动的距离
      let left = e.clientX - dis.x
      let top = e.clientY - dis.y

      // 边界处理
      if (-(left) > dragDomBoundary.minDragDomLeft) {
        left = -dragDomBoundary.minDragDomLeft
      } else if (left > dragDomBoundary.maxDragDomLeft) {
        left = dragDomBoundary.maxDragDomLeft
      }

      if (-(top) > dragDomBoundary.minDragDomTop) {
        top = -dragDomBoundary.minDragDomTop
      } else if (top > dragDomBoundary.maxDragDomTop) {
        top = dragDomBoundary.maxDragDomTop
      }

      // 移动当前元素
      dragDom.style.cssText += `;left:${left + sty.left}px;top:${top + sty.top}px;`

      // emit onDrag event
      vnode.child.$emit('dragDialog')
    }

    dialogHeaderEl.addEventListener('mousedown', (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const dis = {
        x: e.clientX - dialogHeaderEl.offsetLeft,
        y: e.clientY - dialogHeaderEl.offsetTop
      }

      const dragDomWidth = dragDom.offsetWidth
      const dragDomHeight = dragDom.offsetHeight

      const screenWidth = document.body.clientWidth
      const screenHeight = document.body.clientHeight

      const dragDomBoundary = {
        minDragDomTop: dragDom.offsetTop,
        maxDragDomTop: screenHeight - dragDom.offsetTop - dragDomHeight,
        minDragDomLeft: dragDom.offsetLeft,
        maxDragDomLeft: screenWidth - dragDom.offsetLeft - dragDomWidth
      }

      // 获取到的值带px 正则匹配替换
      const sty = {
        left: getStyle(dragDom, 'left'),
        top: getStyle(dragDom, 'top')
      }

      if (sty.left.includes('%')) {
        sty.left = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        sty.top = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        sty.left = +sty.left.replace(/\px/g, '')
        sty.top = +sty.top.replace(/\px/g, '')
      }

      // 事件委托
      const mouseMoveEventListenerSignal = new AbortController()
      document.addEventListener('mousemove', (e) => {
        handleDialogMouseMove(e, sty, dis, dragDomBoundary)
      }, { signal: mouseMoveEventListenerSignal.signal })

      const mouseUpEventListenerSignal = new AbortController()
      document.addEventListener('mouseup', () => {
        mouseMoveEventListenerSignal.abort()
        mouseUpEventListenerSignal.abort()
      }, { signal: mouseUpEventListenerSignal.signal })
    })
  }
}
