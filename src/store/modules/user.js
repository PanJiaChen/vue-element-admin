import { login, logout, getInfo, getSessionInfo, changeRole } from '@/api/user'
import { getToken, setToken, removeToken, getCurrentRole, setCurrentRole, removeCurrentRole } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { showMessage } from '@/utils/ADempiere/notification'

const state = {
  token: getToken(),
  name: '',
  userUuid: '',
  avatar: '',
  introduction: '',
  rol: {}, // info current rol
  rolesList: [],
  roles: [],
  isSession: false,
  sessionInfo: {}
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
  SET_ROLES_LIST: (state, payload) => {
    state.rolesList = payload
  },
  SET_ROL: (state, rol) => {
    state.rol = rol
  },
  SET_USER_UUID: (state, payload) => {
    state.userUuid = payload
  },
  setIsSession(state, payload) {
    state.isSession = payload
  },
  setSessionInfo(state, payload) {
    state.sessionInfo = payload
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), password: password })
        .then(logInResponse => {
          const { uuid: token } = logInResponse

          logInResponse.avatar = 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4'
          logInResponse.name = logInResponse.userInfo.name

          commit('SET_TOKEN', token)
          commit('SET_ROL', logInResponse.role)

          setToken(token)
          setCurrentRole(logInResponse.role.uuid)
          resolve(logInResponse)
        }).catch(error => {
          reject(error)
        })
    })
  },
  // session info
  getInfo({ commit, dispatch }, sessionUuid = null) {
    if (!sessionUuid) {
      sessionUuid = getToken()
    }
    return getSessionInfo(sessionUuid)
      .then(responseGetInfo => {
        commit('setIsSession', true)
        commit('setSessionInfo', {
          id: responseGetInfo.id,
          uuid: responseGetInfo.uuid,
          name: responseGetInfo.name,
          processed: responseGetInfo.processed
        })

        const userInfo = responseGetInfo.userInfo
        commit('SET_NAME', responseGetInfo.name)
        commit('SET_INTRODUCTION', userInfo.description)
        commit('SET_USER_UUID', userInfo.uuid)

        // TODO: return 'Y' or 'N' string values as data type Booelan (4)
        // TODO: return #Date as long data type Date (5)
        responseGetInfo.defaultContextMap.set('#Date', new Date())
        // set multiple context
        dispatch('setMultipleContextMap', responseGetInfo.defaultContextMap, {
          root: true
        })

        const sessionResponse = {
          name: responseGetInfo.name,
          defaultContext: responseGetInfo.defaultContextMap
        }
        return sessionResponse
      })
      .catch(error => {
        console.warn(`Error getting context session ${error.message}`)
      })
      .finally(() => {
        dispatch('getUserInfoValue', sessionUuid)
      })
  },
  // get user info
  getUserInfoValue({ commit }, sessionUuid = null) {
    if (!sessionUuid) {
      sessionUuid = getToken()
    }
    return new Promise((resolve, reject) => {
      getInfo(sessionUuid).then(responseGetInfo => {
        if (!responseGetInfo) {
          reject('Verification failed, please Login again.')
        }
        // roles must be a non-empty array
        if (!responseGetInfo.rolesList || responseGetInfo.rolesList.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        const rol = responseGetInfo.rolesList.find(itemRol => {
          return itemRol.uuid === getCurrentRole()
        })
        const rolesName = responseGetInfo.rolesList.map(rolItem => {
          return rolItem.name
        })

        commit('SET_ROLES_LIST', responseGetInfo.rolesList)
        commit('SET_ROLES', rolesName)
        commit('SET_ROL', rol)

        // TODO: Add support from ADempiere
        const avatar = 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4'
        commit('SET_AVATAR', avatar)

        resolve({
          ...responseGetInfo,
          avatar: avatar,
          roles: rolesName
        })
      }).catch(error => {
        console.warn(`Error getting user info value ${error.message}`)
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('setIsSession', false)
        dispatch('clearProcessControl', null, {
          root: true
        })
        dispatch('dictionaryResetCache', null, {
          root: true
        })

        // dispatch('tagsView/delAllViews', null, { root:true })
        removeToken()
        removeCurrentRole()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
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
  changeRoles({ commit, dispatch }, roleUuid) {
    return changeRole({
      sessionUuid: getToken(),
      roleUuid: roleUuid,
      organizationUuid: null,
      warehouseUuid: null
    })
      .then(changeRoleResponse => {
        const { role } = changeRoleResponse
        commit('SET_ROL', role)
        setCurrentRole(role.uuid)
        commit('SET_TOKEN', changeRoleResponse.uuid)
        setToken(changeRoleResponse.uuid)

        // Update user info and context associated with session
        dispatch('getInfo', changeRoleResponse.uuid)
          .then(() => {
            const route = router.app._route
            const selectedTag = {
              fullPath: route.fullPath,
              hash: route.hash,
              matched: route.matched,
              meta: route.meta,
              name: route.name,
              params: route.params,
              path: route.path,
              query: route.query,
              title: route.meta.title
            }
            dispatch('tagsView/delOthersViews', selectedTag, { root: true })
          })
        dispatch('clearProcessControl', null, {
          root: true
        })
        dispatch('dictionaryResetCache', null, {
          root: true
        })

        return {
          ...role,
          sessionUuid: changeRoleResponse.uuid
        }
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error'
        })
        console.warn(`Error change role: ${error.message}. Code: ${error.code}`)
      })
    //  return new Promise(async resolve => {
    //  const token = role
    //  commit('SET_TOKEN', token)
    //  commit('SET_CURRENTROLE',)
    //  setToken(token)
    //  const { roles } = await dispatch('getInfo')

    //  generate accessible routes map based on   roles
    //  const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

    //  dynamically add accessible routes
    //  router.addRoutes(accessRoutes)
    // })
  }
}

const getters = {
  getRoles: (state) => {
    return state.rolesList
  },
  // current rol info
  getRol: (state) => {
    return state.rol
  },
  getIsSession: (state) => {
    return state.isSession
  },
  getUserUuid: (state) => {
    return state.userUuid
  },
  getIsPersonalLock: (state) => {
    return state.rol.isPersonalLock
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
