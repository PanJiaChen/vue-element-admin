import defaultSettings from '@/settings'
const { showSettings, tagsView } = defaultSettings

const settings = {
  state: {
    showSettings: showSettings,
    tagsView: tagsView
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      if (state.hasOwnProperty(key)) {
        state[key] = value
      }
    }
  },
  actions: {
    changeSetting({ commit }, data) {
      commit('CHANGE_SETTING', data)
    }
  }
}

export default settings
