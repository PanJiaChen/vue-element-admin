
/**
 * Order Mutations
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 */
export default {
  setOrder(state, order) {
    state.order = order
  },
  setListOrder(state, listOrder) {
    state.listOrder = {
      ...state.listOrder,
      ...listOrder
    }
  },
  setOrdersListPageNumber(state, pageNumber) {
    state.listOrder.pageNumber = pageNumber
  },
  showListOrders(state, isShow) {
    state.listOrder.isShowPopover = isShow
  },
  setIsReloadListOrders(state) {
    state.listOrder.isReload = true
  },
  currentOrder(state, currentOrder) {
    state.currentOrder = currentOrder
  },
  findOrder(state, findOrder) {
    state.findOrder = findOrder
  }
}
