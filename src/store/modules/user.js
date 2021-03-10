import {
  login,
  logout,
  requestUserInfoFromSession,
  requestSessionInfo
} from '@/api/user'
import {
  requestRolesList,
  requestChangeRole
} from '@/api/role.js'
import {
  getToken,
  setToken,
  removeToken,
  getCurrentRole,
  setCurrentRole,
  removeCurrentRole,
  getCurrentOrganization,
  setCurrentOrganization,
  getCurrentWarehouse,
  setCurrentWarehouse,
  removeCurrentWarehouse,
  removeCurrentOrganization
} from '@/utils/auth'
import {
  requestOrganizationsList,
  requestWarehousesList
} from '@/api/ADempiere/system-core'
import { resetRouter } from '@/router'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import language from '@/lang'

const state = {
  token: getToken(),
  name: '',
  userUuid: '',
  avatar: '',
  introduction: '',
  role: {}, // info current role
  rolesList: [],
  roles: [],
  organizationsList: [],
  organization: {},
  warehousesList: [],
  warehouse: {},
  isSession: false,
  sessionInfo: {},
  corporateBrandingImage: '',
  currentOrganization: 0
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
  SET_ORGANIZATIONS_LIST: (state, payload) => {
    state.organizationsList = payload
  },
  SET_CURRENT_ORGANIZATIONS: (state, payload) => {
    state.currentOrganization = payload
  },
  SET_ORGANIZATION: (state, organization) => {
    state.organization = organization
    if (organization) {
      state.corporateBrandingImage = organization.corporateBrandingImage
    }
  },
  SET_WAREHOUSES_LIST: (state, payload) => {
    state.warehousesList = payload
  },
  SET_WAREHOUSE: (state, warehouse) => {
    state.warehouse = warehouse
  },
  SET_ROLE: (state, role) => {
    state.role = role
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
  login({ commit }, {
    userName,
    password,
    roleUuid,
    organizationUuid,
    token
  }) {
    return new Promise((resolve, reject) => {
      login({
        userName,
        password,
        roleUuid,
        organizationUuid,
        token
      })
        .then(logInResponse => {
          if ([13, 500].includes(logInResponse.code)) {
            reject(logInResponse)
            return
          }
          const { result: token } = logInResponse
          commit('SET_TOKEN', token)
          setToken(token)

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
   * Get session info
   * @param {string} sessionUuid as token
   */
  getSessionInfo({ commit, dispatch }, sessionUuid = null) {
    if (isEmptyValue(sessionUuid)) {
      sessionUuid = getToken()
    }

    return new Promise((resolve, reject) => {
      requestSessionInfo(sessionUuid)
        .then(async sessionInfo => {
          commit('setIsSession', true)
          commit('setSessionInfo', {
            id: sessionInfo.id,
            uuid: sessionInfo.uuid,
            name: sessionInfo.name,
            processed: sessionInfo.processed
          })

          const { userInfo } = sessionInfo
          commit('SET_NAME', sessionInfo.name)
          commit('SET_INTRODUCTION', userInfo.description)
          commit('SET_USER_UUID', userInfo.uuid)
          const avatar = userInfo.image
          commit('SET_AVATAR', avatar)

          // TODO: Check decimals Number as String '0.123'
          // set multiple context
          dispatch('setMultiplePreference', {
            values: sessionInfo.defaultContext
          }, {
            root: true
          })

          const sessionResponse = {
            name: sessionInfo.name,
            defaultContext: sessionInfo.defaultContext
          }

          const { role } = sessionInfo
          commit('SET_ROLE', role)
          setCurrentRole(role.uuid)
          const currentOrganizationSession = sessionInfo.defaultContext.find(context => {
            if (context.key === '#AD_Org_ID') {
              return context
            }
          })
          commit('SET_CURRENT_ORGANIZATIONS', currentOrganizationSession.value)

          // wait to establish the client and organization to generate the menu
          await dispatch('getOrganizationsListFromServer', role.uuid)

          resolve(sessionResponse)

          commit('setSystemDefinition', {
            countryId: sessionInfo.countryId,
            costingPrecision: sessionInfo.costingPrecision,
            countryCode: sessionInfo.countryCode,
            countryName: sessionInfo.countryName,
            currencyIsoCode: sessionInfo.currencyIsoCode,
            currencyName: sessionInfo.currencyName,
            currencySymbol: sessionInfo.currencySymbol,
            displaySequence: sessionInfo.displaySequence,
            language: sessionInfo.language,
            standardPrecision: sessionInfo.standardPrecision
          }, {
            root: true
          })

          dispatch('getRolesListFromServer', sessionUuid)
        })
        .catch(error => {
          console.warn(`Error ${error.code} getting context session: ${error.message}.`)
          reject(error)
        })
    })
  },

  /**
   * Get user info
   * @param {string} sessionUuid as token
   */
  getUserInfoFromSession({ commit, dispatch }, sessionUuid = null) {
    if (isEmptyValue(sessionUuid)) {
      sessionUuid = getToken()
    }

    return new Promise((resolve, reject) => {
      requestUserInfoFromSession(sessionUuid).then(responseGetInfo => {
        if (isEmptyValue(responseGetInfo)) {
          reject({
            code: 0,
            message: 'Verification failed, please Login again.'
          })
        }
        // if (isEmptyValue(state.role)) {
        //   const role = responseGetInfo.rolesList.find(itemRole => {
        //     return itemRole.uuid === getCurrentRole()
        //   })
        //   if (!isEmptyValue(role)) {
        //     commit('SET_ROLE', role)
        //   }
        // }

        dispatch('getRolesListFromServer', sessionUuid)

        const avatar = responseGetInfo.image
        commit('SET_AVATAR', avatar)

        resolve({
          ...responseGetInfo,
          avatar
        })
      }).catch(error => {
        console.warn(`Error ${error.code} getting user info value: ${error.message}.`)
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    const token = state.token
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()

      commit('setIsSession', false)
      dispatch('resetStateBusinessData', null, {
        root: true
      })
      dispatch('dictionaryResetCache', null, {
        root: true
      })

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      removeCurrentRole()
      resetRouter()
      logout(token).catch(error => {
        console.warn(error)
      }).finally(() => {
        resolve()
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

  getRolesListFromServer({ commit }, sessionUuid = null) {
    if (isEmptyValue(sessionUuid)) {
      sessionUuid = getToken()
    }

    return new Promise((resolve, reject) => {
      requestRolesList(sessionUuid)
        .then(rolesList => {
          // roles must be a non-empty array
          if (isEmptyValue(rolesList)) {
            reject({
              code: 0,
              message: 'getInfo: roles must be a non-null array!'
            })
          }

          // set current role
          if (isEmptyValue(state.role)) {
            let role
            const roleSession = getCurrentRole()
            if (!isEmptyValue(roleSession)) {
              role = rolesList.find(itemRole => {
                return itemRole.uuid === roleSession
              })
            }
            if (isEmptyValue(role)) {
              role = rolesList[0]
            }

            if (!isEmptyValue(role)) {
              commit('SET_ROLE', role)
            }
          }

          commit('SET_ROLES_LIST', rolesList)

          resolve(rolesList)

          const rolesName = rolesList.map(rolItem => {
            return rolItem.name
          })
          commit('SET_ROLES', rolesName)
        })
    })
  },

  getOrganizationsListFromServer({ commit, dispatch, getters }, roleUuid) {
    if (isEmptyValue(roleUuid)) {
      roleUuid = getCurrentRole()
    }
    return requestOrganizationsList({ roleUuid })
      .then(response => {
        commit('SET_ORGANIZATIONS_LIST', response.organizationsList)
        let organization = response.organizationsList.find(item => {
          if (item.uuid === getCurrentOrganization()) {
            return item
          }
        })
        if (isEmptyValue(organization)) {
          organization = response.organizationsList[0]
        }
        if (isEmptyValue(organization)) {
          removeCurrentOrganization()
          organization = undefined
        } else {
          setCurrentOrganization(organization.uuid)
        }
        const currentOrganization = getters.getCurrentOrg
        if (!isEmptyValue(currentOrganization)) {
          organization = response.organizationsList.find(item => {
            if (item.id === currentOrganization) {
              return item
            }
          })
        }
        commit('SET_ORGANIZATION', organization)
        commit('setPreferenceContext', {
          columnName: '#AD_Org_ID',
          value: organization.id
        }, {
          root: true
        })

        dispatch('getWarehousesList', organization.uuid)
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting Organizations list: ${error.message}.`)
      })
  },

  changeOrganization({ commit, dispatch, getters }, {
    organizationUuid,
    organizationId,
    isCloseAllViews = true
  }) {
    // TODO: Check if there are no tagViews in the new routes to close them, and
    // if they exist, reload with the new route using name (uuid)
    dispatch('tagsView/setCustomTagView', {
      isCloseAllViews
    }, {
      root: true
    })

    return requestChangeRole({
      token: getToken(),
      roleUuid: getCurrentRole(),
      organizationUuid
    })
      .then(changeRoleResponse => {
        const { uuid } = changeRoleResponse

        commit('SET_TOKEN', uuid)
        setToken(uuid)

        setCurrentOrganization(organizationUuid)
        const organization = getters.getOrganizations.find(org => org.uuid === organizationUuid)
        commit('SET_ORGANIZATION', organization)

        // commit('setPreferenceContext', {
        //   columnName: '#AD_Org_ID',
        //   value: organizationId
        // }, {
        //   root: true
        // })

        // Update user info and context associated with session
        dispatch('getSessionInfo', uuid)

        dispatch('resetStateBusinessData', null, {
          root: true
        })
        dispatch('dictionaryResetCache', null, {
          root: true
        })

        dispatch('getWarehousesList', organizationUuid)

        showMessage({
          message: language.t('notifications.successChangeRole'),
          type: 'success',
          showClose: true
        })
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error',
          showClose: true
        })
        console.warn(`Error change role: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        dispatch('permission/sendRequestMenu', null, {
          root: true
        })
      })
  },

  getWarehousesList({ commit }, organizationUuid) {
    if (isEmptyValue(organizationUuid)) {
      organizationUuid = getCurrentOrganization()
    }

    return requestWarehousesList({
      organizationUuid
    })
      .then(response => {
        commit('SET_WAREHOUSES_LIST', response.warehousesList)

        let warehouse = response.warehousesList.find(item => item.uuid === getCurrentWarehouse())
        if (isEmptyValue(warehouse)) {
          warehouse = response.warehousesList[0]
        }
        if (isEmptyValue(warehouse)) {
          removeCurrentWarehouse()
          commit('SET_WAREHOUSE', undefined)
        } else {
          setCurrentWarehouse(warehouse.uuid)
          commit('SET_WAREHOUSE', warehouse)
          commit('setPreferenceContext', {
            columnName: '#M_Warehouse_ID',
            value: warehouse.id
          }, {
            root: true
          })
        }
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting Warehouses list: ${error.message}.`)
      })
  },

  changeWarehouse({ commit, state }, {
    warehouseUuid
  }) {
    setCurrentWarehouse(warehouseUuid)

    const currentWarehouse = state.warehousesList.find(warehouse => warehouse.uuid === warehouseUuid)
    commit('SET_WAREHOUSE', currentWarehouse)

    commit('setPreferenceContext', {
      columnName: '#M_Warehouse_ID',
      value: currentWarehouse.id
    }, {
      root: true
    })
  },

  // dynamically modify permissions
  changeRole({ commit, dispatch }, {
    roleUuid,
    organizationUuid,
    warehouseUuid,
    isCloseAllViews = true
  }) {
    dispatch('tagsView/setCustomTagView', {
      isCloseAllViews
    }, {
      root: true
    })

    return requestChangeRole({
      token: getToken(),
      roleUuid,
      organizationUuid,
      warehouseUuid
    })
      .then(changeRoleResponse => {
        const { role, uuid } = changeRoleResponse

        commit('SET_ROLE', role)
        setCurrentRole(role.uuid)

        commit('SET_TOKEN', uuid)
        setToken(uuid)

        // Update user info and context associated with session
        dispatch('getSessionInfo', uuid)

        dispatch('resetStateBusinessData', null, {
          root: true
        })
        dispatch('dictionaryResetCache', null, {
          root: true
        })

        showMessage({
          message: language.t('notifications.successChangeRole'),
          type: 'success',
          showClose: true
        })
        return {
          ...role,
          sessionUuid: uuid
        }
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error',
          showClose: true
        })
        console.warn(`Error change role: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        dispatch('permission/sendRequestMenu', null, {
          root: true
        })
      })
  }
}

const getters = {
  getRoles: (state) => {
    return state.rolesList
  },
  getOrganizations: (state) => {
    return state.organizationsList
  },
  getWarehouses: (state) => {
    return state.warehousesList
  },
  // current role info
  getRole: (state) => {
    return state.role
  },
  getOrganization: (state) => {
    return state.organization
  },
  getWarehouse: (state) => {
    return state.warehouse
  },
  getIsSession: (state) => {
    return state.isSession
  },
  getUserUuid: (state) => {
    return state.userUuid
  },
  getIsPersonalLock: (state) => {
    return state.role.isPersonalLock
  },
  getCurrentOrg: (state) => {
    return state.currentOrganization
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
