import { isEmptyValue, recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'
import { requestListDocumentActions, requestListDocumentStatuses } from '@/api/ADempiere/workflow'

// Store used for set all related to context menu
// for Window, Process, Smart Browser andother customized component
// See structure:
// contextMenu: [
//   {
//     containerUuid: '',
//     relations: [],
//     actions: [],
//     references: []
//   }
// ]
const initStateContextMenu = {
  isShowRightPanel: false,
  isShowPopoverField: false,
  optionField: {},
  contextMenu: [],
  listDocumentStatus: {
    defaultDocumentAction: undefined,
    documentActionsList: [],
    recordId: undefined,
    recordUuid: undefined
  },
  listDocumentAction: {
    defaultDocumentAction: undefined,
    documentActionsList: [],
    recordId: undefined,
    recordUuid: undefined
  },
  recordAccess: false,
  embedded: {
    name: ''
  }
}

const contextMenu = {
  state: initStateContextMenu,
  mutations: {
    setContextMenu(state, payload) {
      state.contextMenu.push(payload)
    },
    dictionaryResetCacheContextMenu(state) {
      state.contextMenu = []
    },
    listDocumentAction(state, payload) {
      state.listDocumentAction = payload
    },
    addlistDocumentStatus(state, payload) {
      state.listDocumentStatus = payload
    },
    changeShowRigthPanel(state, params) {
      if (isEmptyValue(params)) {
        state.isShowRightPanel = !state.isShowRightPanel
      }
      state.isShowRightPanel = params
    },
    changeShowPopoverField(state) {
      state.isShowPopoverField = !state.isShowPopoverField
    },
    resetContextMenu(state) {
      state = initStateContextMenu
    },
    fieldContextMenu(state, payload) {
      state.optionField = payload
    },
    setRecordAccess(state, params) {
      state.recordAccess = params
    },
    attributeEmbedded(state, params) {
      state.embedded = params
    }
  },
  actions: {
    /**
     * Sub menu associated with panel
     * @param {string} containerUuid
     * @param {array}  relations
     * @param {array}  actions
     * @param {array}  references
     */
    setContextMenu({ commit }, {
      containerUuid,
      relations = [],
      actions = [],
      references = []
    }) {
      commit('setContextMenu', {
        containerUuid,
        relations,
        actions,
        references
      })
    },
    addAction({ state }, newAction) {
      newAction.push(state.contextMenu.actions)
    },
    /**
     * TODO: Verify tableName params to change in constant
     * @param {number} recordId
     * @param {string} recordUuid
     */
    listDocumentActionStatus({ commit }, {
      tableName,
      recordId,
      recordUuid,
      documentAction,
      documentStatus
    }) {
      return new Promise(resolve => {
        requestListDocumentActions({
          tableName,
          recordId,
          recordUuid,
          documentAction,
          documentStatus,
          pageSize: 0,
          pageToken: ''
        })
          .then(responseDocumentActios => {
            const documentAction = {
              defaultDocumentAction: responseDocumentActios.defaultDocumentAction,
              documentActionsList: responseDocumentActios.documentActionsList,
              recordId,
              recordUuid
            }

            commit('listDocumentAction', documentAction)
            resolve(documentAction)
          })
          .catch(error => {
            console.warn(`Error getting document action list. Code ${error.code}: ${error.message}.`)
          })
      })
    },
    listDocumentStatus({ commit }, {
      tableName,
      recordId,
      recordUuid,
      documentAction,
      documentStatus
    }) {
      return new Promise(resolve => {
        requestListDocumentStatuses({
          tableName,
          recordId,
          recordUuid,
          documentAction,
          documentStatus,
          pageSize: 0,
          pageToken: ''
        })
          .then(responseDocumentStatus => {
            const documentStatus = {
              documentActionsList: responseDocumentStatus.documentStatusesList,
              recordId,
              recordUuid
            }
            commit('addlistDocumentStatus', documentStatus)
            resolve(documentStatus)
          })
          .catch(error => {
            console.warn(`Error getting document statuses list. Code ${error.code}: ${error.message}.`)
          })
      })
    },
    setOptionField({ commit }, params) {
      commit('fieldContextMenu', params)
    }
  },
  getters: {
    getContextMenu: (state) => (containerUuid) => {
      return state.contextMenu.find(item => item.containerUuid === containerUuid)
    },
    getRelations: (state, getters, rootState, rootGetters) => (containerOrMenuUuid) => {
      const dataTree = rootGetters.permission_routes
      return recursiveTreeSearch({
        treeData: dataTree,
        attributeName: 'name',
        attributeValue: containerOrMenuUuid,
        attributeChilds: 'children'
      })
    },
    getActions: (state) => (containerUuid) => {
      const menu = state.contextMenu.find(
        item => item.containerUuid === containerUuid
      )
      if (menu) {
        return menu.actions
      }
      return menu
    },
    getListDocumentActions: (state) => {
      return state.listDocumentAction
    },
    getListDocumentStatus: (state) => {
      return state.listDocumentStatus
    },
    getListDocumentActionByUuid: (state) => (recordUuid) => {
      return state.listDocumentAction.find(itemDocumentAction => itemDocumentAction.recordUuid === recordUuid)
    },
    getFieldContextMenu: (state) => {
      return state.optionField
    },
    getShowRecordAccess: (state) => {
      return state.recordAccess
    },
    getAttributeEmbedded: (state) => {
      return state.embedded
    }
  }
}

export default contextMenu
