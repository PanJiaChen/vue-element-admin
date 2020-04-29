// This store is used for catch all fieldEvents related to fieldEvents, note that the unique search based
// on columnName and containerUuid. All fieldEvents for fieldEvents (when apply for dispatch fieldEvents) are logged here
// and the used can implenment a suscription for get values from field.
// Please use it for add custom behavios for fieldEvents on forms and other components customized from user

// Note that it need a structure with mandatory values:
// {
//   containerUuid: Container UUID used as container of fields to listen,
//   columnName: Column Name or unique value, it is a index with container,
//   value: new value for event,
//   keyCode: optional for key events
// }
//  Generic Action
export const ACTION_PERFORMED = 1
export const FOCUS_GAINED = 2
export const FOCUS_LOST = 3
// Input actions
export const KEY_PRESSED = 4
export const KEY_RELEASED = 5
const event = {
  state: {
    fieldEvents: [],
    actionEvents: []
  },
  mutations: {
    addChange(state, change) {
      state.fieldEvents.push(change)
    },
    addAction(state, action) {
      state.actionEvents.push(action)
    },
    resetStateLookup(state) {
      state = {
        fieldEvents: [],
        actionEvents: []
      }
    }
  },
  actions: {
    notifyActionPerformed({ commit }, event) {
      commit('addChange', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value,
        eventType: ACTION_PERFORMED
      })
    },
    notifyKeyPressed({ commit }, event) {
      commit('addChange', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value,
        keyCode: event.keyCode,
        eventType: KEY_PRESSED
      })
    },
    notifyKeyReleased({ commit }, event) {
      commit('addChange', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value,
        keyCode: event.keyCode,
        eventType: KEY_RELEASED
      })
    },
    notifyFocusGained({ commit }, event) {
      commit('addChange', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value,
        eventType: FOCUS_GAINED
      })
    },
    notifyFocusLost({ commit }, event) {
      commit('addChange', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value,
        eventType: FOCUS_LOST
      })
    },
    notifyRunAction({ commit }, action) {
      commit('addAction', {
        containerUuid: action.containerUuid,
        action: action.action,
        paremeters: action.parameters
      })
    }
  },
  getters: {
    getFieldEventList: (state) => (containerUuid) => {
      return state.fieldEvents.find(event => {
        return event.containerUuid === containerUuid
      })
    },
    getActionEventList: (state) => (containerUuid) => {
      return state.actionEvents.find(action => {
        return action.containerUuid === containerUuid
      })
    }
  }
}
export default event
