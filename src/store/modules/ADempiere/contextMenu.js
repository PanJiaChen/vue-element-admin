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
    getRelations: (state, getters, rootState) => (containerUuid) => {
      var menuRelations
      rootState.permission.addRoutes.forEach(route => {
        if (route.name === containerUuid) {
          menuRelations = route.children
        } else if (route.name !== containerUuid && route.children) {
          route.children.forEach(child => {
            if (child.name === containerUuid) {
              menuRelations = route.children
            }
          })
        }
      })
      return menuRelations
    },
    getActions: (state) => (containerUuid) => {
      var menu = state.contextMenu.find(
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
