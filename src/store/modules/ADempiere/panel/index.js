// Vuex file for store all related to panel and fields
// Use it for handle events for changes and put context, also can be
// used for hadle isDisplayed logic, read only logic and mandatory logic
// The scope is use panel as storage of:
// - Window: Just need storage tab and fields
// - Process & Report: Always save a panel and parameters
// - Smart Browser: Can have a search panel, table panel and process panel
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import actions from './actions.js'
import getters from './getters.js'

const panel = {
  state: {
    panel: []
  },
  mutations: {
    addPanel(state, payload) {
      state.panel.push(payload)
    },
    changePanelAttribute(state, payload) {
      payload.panel[payload.attributeName] = payload.attributeValue
    },
    changeFieldAttribure(state, payload) {
      payload.field[payload.attributeName] = payload.attributeValue
    },
    changeFieldLogic(state, payload) {
      if (!isEmptyValue(payload.isDisplayedFromLogic)) {
        payload.field.isDisplayedFromLogic = Boolean(payload.isDisplayedFromLogic)
      }
      payload.field.isMandatoryFromLogic = Boolean(payload.isMandatoryFromLogic)
      payload.field.isReadOnlyFromLogic = Boolean(payload.isReadOnlyFromLogic)
      payload.field.parsedDefaultValue = payload.parsedDefaultValue
    },
    dictionaryResetCache(state) {
      state.panel = []
    }
  },
  actions,
  getters
}

export default panel
