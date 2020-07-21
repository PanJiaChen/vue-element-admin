import editorProjectConfig from '@/views/h5/ele-config'
/*
新建/编辑页面数据

*/
const state = {
  projectData: {
    pageMode: ''
  },
  activePageUUID: '', // 正在编辑页面的uuid
  activeElementUUID: '' // 选中元素的uuid
}

const mutations = {
  /*
    画板添加元素

  */
  addElement(state, elData) {
    // 找到当前活动页
    const index = state.projectData.pages.findIndex(item => { return item.uuid === state.activePageUUID })
    state.projectData.pages[index].elements.push(elData)
  }
}

const actions = {
  /*
    添加组件元素
  */
  addElement({ commit }, elData) {
    const activePage = getters.activePage(state)
    // 每添加一个元素，获取其数据模型并修改层叠属性
    // 数据模型 是基于基础模版和元素具体类型
    const data = editorProjectConfig.getElementConfig(elData, { zIndex: activePage.elements.length + 1 })
    commit('addElement', data)
  //  commit('setActiveElementUUID', data.uuid)
  //  commit('addHistoryCache')
  }
}

const getters = {
  // 当前选中的页面
  activePage: state => {
    if (!state.projectData.pages || !state.activePageUUID) {
      return {
        commonStyle: {},
        config: {}
      }
    }
    return state.projectData.pages.find(item => { item.uuid === state.activePageUUID })
  },
  // 当前页面模式
  pageMode: state => state.projectData.pageMode
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
