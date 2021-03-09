// Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/api/ADempiere/instances.js'

/**
 * Make login by UserName and password, this function can return user data for show
 * @param {string} userName
 * @param {string} password
 */
export function login({
  userName,
  password,
  roleUuid,
  organizationUuid,
  token
}) {
  return requestRest({
    url: '/user/login',
    method: 'post',
    data: {
      username: userName,
      password,
      role_uuid: roleUuid,
      organization_uuid: organizationUuid,
      token
    }
  })
}

/**
 * Get User Info
 * @param {string} token or session UUID
 */
export function requestUserInfoFromSession(token) {
  return requestRest({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
    .then(evaluateResponse)
}

/**
 * Get session info
 * @param {string} token or session UUID
 */
export function requestSessionInfo(token) {
  return requestRest({
    url: '/user/session',
    method: 'get',
    params: {
      token
    }
  })
    .then(evaluateResponse)
    .then(responseSession => {
      const { convertSession } = require('@/utils/ADempiere/apiConverts/user.js')

      return convertSession(responseSession)
    })
}

/**
 * Get User menu from server
 * @param {string} sessionUuid
 */
export function requestMenu({
  sessionUuid
}) {
  return requestRest({
    url: '/user/menu',
    method: 'get',
    params: {
      token: sessionUuid
    }
  })
    .then(evaluateResponse)
}

/**
 * Logout from server
 * @param {string} token or session UUID
 */
export function logout(token) {
  return requestRest({
    url: '/user/logout',
    data: {
      token
    }
  })
}
