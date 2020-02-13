import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'
import { requestListDocumentActions } from '@/api/ADempiere/data'

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
    contextMenu: [],
    listDocumentAction: []
  },
  mutations: {
    setContextMenu(state, payload) {
      state.contextMenu.push(payload)
    },
    dictionaryResetCacheContextMenu(state) {
      state.contextMenu = []
    },
    listDocumentAction(state, payload) {
      state.listDocumentAction = payload
    }
  },
  actions: {
    setContextMenu({ commit }, payload) {
      commit('setContextMenu', payload)
    },
    listDocumentActionStatus({ commit }, params) {
      const tableName = params.tableName
      const recordId = params.recordId
      const recordUuid = params.recordUuid
      const documentStatus = params.DocStatus
      const documentAction = params.DocAction
      const pageSize = 0
      const pageToken = ''
      requestListDocumentActions({ tableName, recordId, recordUuid, documentStatus, documentAction, pageSize, pageToken })
        .then(response => {
          var documentAction = {
            defaultDocumentAction: response.defaultDocumentAction,
            documentActionsList: response.documentActionsList
          }
          commit('listDocumentAction', documentAction)
        })
        .catch(error => {
          console.warn(error)
        })
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
    },
    getListDocumentActions: (state) => {
      return state.listDocumentAction
    }
  }
}

export default contextMenu
