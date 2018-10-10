import Cookies from 'js-cookie'
import settings from '@/settings'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    language: Cookies.get('language') || settings.language,
    size: Cookies.get('size') || settings.size,
    viewsTransition: Cookies.get('viewsTransition') || settings.viewsTransition,
    needTagsView: Cookies.get('needTagsView') || settings.tagsView,
    sidebarUniqueOpened: Cookies.get('sidebarUniqueOpened') || settings.sidebarUniqueOpened
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    },
    SET_VIEWS_TRANSITION: (state, viewsTransition) => {
      state.viewsTransition = viewsTransition
      Cookies.set('viewsTransition', viewsTransition)
    },
    SET_TAGS_VIEW: (state, needTagsView) => {
      state.needTagsView = needTagsView
      Cookies.set('needTagsView', needTagsView)
    },
    SET_SIDEBAR_UNIQUE_OPENED: (state, sidebarUniqueOpened) => {
      state.sidebarUniqueOpened = sidebarUniqueOpened
      Cookies.set('sidebarUniqueOpened', sidebarUniqueOpened)
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    },
    setViewsTransition({ commit }, viewsTransition) {
      commit('SET_VIEWS_TRANSITION', viewsTransition)
    },
    setTagsView({ commit }, needTagsView) {
      commit('SET_TAGS_VIEW', needTagsView)
    },
    setSidebarUniqueOpened({ commit }, sidebarUniqueOpened) {
      commit('SET_SIDEBAR_UNIQUE_OPENED', sidebarUniqueOpened)
    }
  }
}

export default app
