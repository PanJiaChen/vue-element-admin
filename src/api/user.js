// Instance for connection
import { request } from '@/utils/ADempiere/request'

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
  return request({
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
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Get session info
 * @param {string} token or session UUID
 */
export function requestSessionInfo(token) {
  return request({
    url: '/user/session',
    method: 'get',
    params: {
      token
    }
  })
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
  return request({
    url: '/user/menu',
    method: 'get',
    params: {
      token: sessionUuid
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Logout from server
 * @param {string} token or session UUID
 */
export function logout(token) {
  return request({
    method: 'post',
    url: '/user/logout',
    data: {
      token
    }
  })
}
