import Vue from 'vue'

const initStateUtils = {
  width: 0,
  height: 0,
  splitHeight: 50,
  splitHeightTop: 0,
  widthLayout: 0,
  tempShareLink: '',
  oldAction: undefined,
  reportType: '',
  isShowedTable: false,
  recordUuidTable: 0,
  isShowedTabChildren: false,
  recordTable: 0,
  selectionProcess: [],
  isContainerInfo: false,
  documentAction: [],
  chatText: '',
  markDown: false,
  openRoute: {
    path: '',
    name: '',
    route: {},
    params: {},
    definedParameters: {},
    query: {},
    isReaded: false,
    isLoaded: false
  },
  panelRight: ''
}

const utils = {
  state: initStateUtils,
  mutations: {
    setWidth(state, width) {
      state.width = width
    },
    setWidthLayout(state, width) {
      state.widthLayout = width
    },
    setHeigth(state, height) {
      state.height = height
    },
    setSplitHeight(state, splitHeight) {
      state.splitHeight = splitHeight
    },
    showMenuTable(state, isShowedTable) {
      state.isShowedTable = isShowedTable
    },
    showContainerInfo(state, isContainerInfo) {
      state.isContainerInfo = isContainerInfo
    },
    showMenuTabChildren(state, isShowedTabChildren) {
      state.isShowedTabChildren = isShowedTabChildren
    },
    setSplitHeightTop(state, splitHeightTop) {
      state.splitHeightTop = splitHeightTop
    },
    setProcessTable(state, recordTable) {
      state.recordTable = recordTable
    },
    setOrder(state, payload) {
      state.documentAction = payload
    },
    setChatText(state, payload) {
      state.chatText = payload
    },
    setMarkDown(state, payload) {
      state.markDown = payload
    },
    setProcessSelecetion(state, selectionProcess) {
      state.selectionProcess = selectionProcess
    },
    setTempShareLink(state, payload) {
      state.tempShareLink = payload
    },
    setOldAction(state, payload) {
      state.oldAction = payload
    },
    setReportTypeToShareLink(state, payload) {
      state.reportType = payload
    },
    setOpenRoute(state, payload) {
      state.openRoute = {
        ...state.openRoute,
        ...payload
      }
    },
    setReadRoute(state, payload) {
      Vue.set(state.openRoute, 'definedParameters', payload.parameters)
      Vue.set(state.openRoute, 'isLoaded', true)
    },
    setPanelRight(state, payload) {
      state.panelRight = payload
    },
    resetStateUtils(state) {
      state = initStateUtils
    }
  },
  actions: {
    setWidth({ commit }, width) {
      commit('setWidth', width)
    },
    setWidthLayout({ commit }, width) {
      commit('setWidthLayout', width)
    },
    setHeight({ commit }, height) {
      commit('setHeigth', height)
    },
    showMenuTable({ commit }, isShowedTable) {
      commit('showMenuTable', isShowedTable)
    },
    showContainerInfo({ commit, state }, isContainerInfo) {
      commit('showContainerInfo', isContainerInfo)
    },
    showMenuTabChildren({ commit }, isShowedTabChildren) {
      commit('showMenuTabChildren', isShowedTabChildren)
    },
    setSplitHeight({ commit }, splitHeight) {
      commit('setSplitHeight', splitHeight)
    },
    setSplitHeightTop({ commit }, splitHeightTop) {
      commit('setSplitHeightTop', splitHeightTop)
    },
    setProcessTable({ commit }, recordTable) {
      commit('setProcessTable', recordTable)
    },
    setProcessSelect({ commit }, params) {
      commit('setProcessSelecetion', params)
    },
    setchatText({ commit }, params) {
      commit('setChatText', params)
    },
    setMarkDown({ commit }, send) {
      commit('setMarkDown', send)
    },
    setOpenRoute({ commit }, routeParameters) {
      commit('setOpenRoute', {
        ...routeParameters
      })
    },
    setReadRoute({ commit }, parameters) {
      commit('setReadRoute', parameters)
    },
    setTempShareLink({ commit }, parameters) {
      if (!parameters.href.includes(String(parameters.processId))) {
        commit('setTempShareLink', parameters.href)
      }
    },
    setOldAction({ commit }, value) {
      commit('setOldAction', value)
    },
    setReportTypeToShareLink({ commit }, value) {
      commit('setReportTypeToShareLink', value)
    },
    setOrder({ commit }, params) {
      commit('setOrder', params)
    },
    setPanelRight({ commit }, panelRight) {
      commit('setPanelRight', panelRight)
    }
  },
  getters: {
    getWidth: (state) => {
      return state.width
    },
    getProcessSelect: (state) => {
      return state.selectionProcess
    },
    getWidthLayout: (state, rootGetters) => {
      if (rootGetters.toggleSideBar) {
        return state.width - 250
      }
      return state.width - 54
    },
    getHeigth: (state) => {
      return state.height
    },
    getSplitHeightTop: (state) => {
      return state.getSplitHeightTop
    },
    getRecordUuidMenu: (state) => {
      return state.recordTable
    },
    getShowContextMenuTable: (state) => {
      const menu = state.isShowedTable.isShowedTable
      return menu
    },
    getShowContainerInfo: (state) => {
      const showInfo = state.isContainerInfo
      return showInfo
    },
    getShowContextMenuTabChildren: (state) => {
      const menu = state.isShowedTabChildren.isShowedTabChildren
      return menu
    },
    getSplitHeight: (state) => {
      const split = state.splitHeight
      var panelHeight = 0
      if (split !== 50) {
        panelHeight = split.splitHeight
      } else {
        panelHeight = 50
      }
      return panelHeight
    },
    getTempShareLink: (state) => {
      return state.tempShareLink
    },
    getOldAction: (state) => {
      return state.oldAction
    },
    getReportType: (state) => {
      return state.reportType
    },
    getIsLoadedOpenRoute: (state) => {
      return state.openRoute.isLoaded
    },
    getIsReadedOpenRoute: (state) => {
      return state.openRoute.isReaded
    },
    getOrders: (state) => {
      return state.documentAction
    },
    getChatTextLong: (state) => {
      return state.chatText
    },
    getMarkDown: (state) => {
      return state.markDown
    },
    getPanelRight: (state) => {
      return state.panelRight
    }
  }
}
export default utils
