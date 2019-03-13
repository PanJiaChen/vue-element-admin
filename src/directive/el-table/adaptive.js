
export default{
  /**
   * 仅当 el-table :data属性为动态加载（不包括computed）才会触发此事件
   * @param {*} el
   * @param {*} binding
   * binding.value 格式为 {
   *      table: $refs.table, //  表格对象
   *      topHeight: 10      //  表格顶边 距离顶部高度，默认值为  10
   *      footerHeight: 10   //  表格底部 距离底部高度，默认值为  10
   * }
   * @param {*} vnode
   * @param {*} oldVnode
   */
  update(el, binding, vnode, oldVnode) {
    let topHeight = binding.value.topHeight ? binding.value.topHeight : 10
    let footerHeight = binding.value.footerHeight ? binding.value.footerHeight : 10

    let table = binding.value.table

    let tableHeight = window.innerHeight - el.offsetTop - footerHeight - topHeight;
    table.layout.setHeight(tableHeight)
    table.doLayout()

    // 监听窗口大小变化
    window.addEventListener("resize", () => {
      tableHeight = window.innerHeight - el.offsetTop - footerHeight - topHeight
      table.layout.setHeight(tableHeight)
      table.doLayout()
    })
  }
}
