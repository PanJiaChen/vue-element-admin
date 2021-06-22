import Vue from 'vue'
import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userName: '',
  userId: '',
  deptName: '',
  deptId: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  USER_NAME: (state, userName) => {
    state.userName = userName
  },
  USER_ID: (state, userId) => {
    state.userId = userId
  },
  DEPT_NAME: (state, deptName) => {
    state.deptName = deptName
  },
  DEPT_ID: (state, deptId) => {
    state.deptId = deptId
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login(`funid=login&eventcode=login&pagetype=login&user_code=${username.trim()}&user_pass=${password}`).then(async res => {
        if (res.data.success) {
          commit('SET_ROLES', res.data.data.role_id)
          // const { data } = res.data
          commit('SET_TOKEN', 'bwhse')
          commit('USER_NAME', res.data.data.user_name)
          commit('USER_ID', res.data.data.user_id)
          commit('DEPT_NAME', res.data.data.dept_name)
          commit('DEPT_ID', res.data.data.dept_id)
          setToken('bwhse')
          sessionStorage.setItem('ROLES', res.data.data.role_id)
          sessionStorage.setItem('USER_NAME', res.data.data.user_name)
          sessionStorage.setItem('USER_ID', res.data.data.user_id)
          sessionStorage.setItem('DEPT_NAME', res.data.data.dept_name)
          sessionStorage.setItem('DEPT_ID', res.data.data.dept_id)
          // generate accessible routes map based on roles
          const accessRoutes = await dispatch('permission/generateRoutes', res.data.data.role_id, { root: true })
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          resolve()
        } else {
          Vue.prototype.$message.error(res.data.message)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('USER_NAME', '')
      commit('USER_ID', '')
      commit('DEPT_NAME', '')
      commit('DEPT_ID', '')
      sessionStorage.clear
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  getRoles({ commit }, roles) {
    return new Promise(resolve => {
      commit('SET_ROLES', roles)
      commit('USER_NAME', sessionStorage.getItem('USER_NAME'))
      commit('USER_ID', sessionStorage.getItem('USER_ID'))
      commit('DEPT_NAME', sessionStorage.getItem('DEPT_NAME'))
      commit('DEPT_ID', sessionStorage.getItem('DEPT_ID'))
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
