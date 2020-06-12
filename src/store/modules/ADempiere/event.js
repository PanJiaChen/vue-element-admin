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
// How subsribe for it?
// Just create a method and call it
// subscribeChanges() {
//   this.$store.subscribe((mutation, state) => {
//     if (mutation.type === 'addActionPerformed' && mutation.payload.columnName === 'ProductValue') {
//       // here is your code
//     }
//   }
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
    addActionPerformed(state, change) {
      state.fieldEvents.push({
        ...change,
        eventType: ACTION_PERFORMED
      })
    },
    addKeyPressed(state, change) {
      state.fieldEvents.push({
        ...change,
        eventType: KEY_PRESSED
      })
    },
    addKeyReleased(state, change) {
      state.fieldEvents.push({
        ...change,
        eventType: KEY_RELEASED
      })
    },
    addActionKeyPerformed(state, change) {
      state.fieldEvents.push(change)
    },
    addFocusGained(state, change) {
      state.fieldEvents.push({
        ...change,
        eventType: FOCUS_GAINED
      })
    },
    addFocusLost(state, change) {
      state.fieldEvents.push({
        ...change,
        eventType: FOCUS_LOST
      })
    },
    addRunAction(state, action) {
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
      commit('addActionPerformed', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value
      })
    },
    notifyKeyPressed({ commit }, event) {
      commit('addKeyPressed', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value,
        keyCode: event.keyCode
      })
    },
    notifyKeyReleased({ commit }, event) {
      commit('addKeyReleased', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value,
        keyCode: event.keyCode
      })
    },
    notifyActionKeyPerformed({ commit }, event) {
      commit('addActionKeyPerformed', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value,
        keyCode: event.keyCode
      })
    },
    notifyFocusGained({ commit }, event) {
      commit('addFocusGained', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value
      })
    },
    notifyFocusLost({ commit }, event) {
      commit('addFocusLost', {
        containerUuid: event.containerUuid,
        columnName: event.columnName,
        value: event.value
      })
    },
    runAction({ commit }, action) {
      commit('addRunAction', {
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
