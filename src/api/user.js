import { getLanguage } from '@/lang/index'
import Access from '@adempiere/grpc-access-client'
import { HOST_GRPC_AUTHENTICATION } from '@/api/ADempiere/constants'

// Instance for connection
function Instance() {
  return new Access(
    HOST_GRPC_AUTHENTICATION,
    'Version Epale',
    getLanguage() || 'en_US'
  )
}

// Make login by UserName and password, this function can return user data for show
export function login(loginValues) {
  if (loginValues.role && loginValues.role.trim() !== '') {
    return Instance.call(this).requestLogin({
      userName: loginValues.userName,
      userPass: loginValues.password,
      role: loginValues.role,
      language: getLanguage() || 'en_US'
    })
  } else {
    return Instance.call(this).requestLoginDefault({
      userName: loginValues.userName,
      userPass: loginValues.password,
      language: getLanguage() || 'en_US'
    })
  }
}

// Get User Info from session Uuid or token
export function getInfo(token) {
  return Instance.call(this).requestUserInfoFromSession(token)
}

/**
 * Get session info
 * @param {string} sessionUuid
 */
export function getSessionInfo(sessionUuid) {
  return Instance.call(this).getSession(sessionUuid)
}

// Logout from server
export function logout(sessionUuid) {
  return Instance.call(this).requestLogOut(sessionUuid)
}

// Get User menu from server
export function getMenu(sessionUuid) {
  return Instance.call(this).requestUserMenuFromSession(sessionUuid)
}

/**
 *
 * @param {string} attributes.sessionUuid
 * @param {string} attributes.roleUuid
 * @param {string} attributes.organizationUuid
 * @param {string} attributes.warehouseUuid
 */
export function changeRole(attributes) {
  return Instance.call(this).requestChangeRole(attributes)
}
