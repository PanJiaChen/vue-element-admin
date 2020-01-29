import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'
// Store used for set all related to context menu
// for Window, Process, Smart Browser andother customized component
// See structure:
// menu: [
//   {
//     containerUuid: '',
//     relations: [],
//     actions: [],
//     references: []
//     defaultAction: {},
//     lastAction: {}
//   }
// ]
const contextMenu = {
  state: {
    contextMenu: []
  },
  mutations: {
    setContextMenu(state, payload) {
      state.contextMenu.push(payload)
    },
    dictionaryResetCacheContextMenu(state) {
      state.contextMenu = []
    }
  },
  actions: {
    setContextMenu({ commit }, payload) {
      commit('setContextMenu', payload)
    }
  },
  getters: {
    getContextMenu: (state) => (containerUuid) => {
      return state.contextMenu.find(item => item.containerUuid === containerUuid)
    },
    getRelations: (state, getters, rootState, rootGetters) => (containerUuid) => {
      const dataTree = rootGetters.permission_routes
      return recursiveTreeSearch({
        treeData: dataTree,
        attributeName: 'name',
        attributeValue: containerUuid,
        attributeChilds: 'children'
      })
    },
    getActions: (state) => (containerUuid) => {
      const menu = state.contextMenu.find(
        item => item.containerUuid === containerUuid
      )
      if (menu === undefined) {
        return menu
      }
      return menu.actions
    }
  }
}

export default contextMenu
