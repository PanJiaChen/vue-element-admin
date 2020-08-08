// Instance for connection
import { AccessInstance as Instance } from '@/api/ADempiere/instances.js'

// Make login by UserName and password, this function can return user data for show
export function login({
  userName,
  password: userPass,
  role
}) {
  if (role && role.trim() !== '') {
    return Instance.call(this).requestLogin({
      userName,
      userPass,
      role
    })
  }
  return Instance.call(this).requestLoginDefault({
    userName,
    userPass
  })
}

// Get User Info from session Uuid or token
export function requestUserInfoFromSession(token) {
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

/**
 *
 * @param {string} attributes.sessionUuid
 * @param {string} attributes.roleUuid
 * @param {string} attributes.organizationUuid
 * @param {string} attributes.warehouseUuid
 */
// Get User menu from server
export function getMenu(sessionUuid) {
  return Instance.call(this).requestUserMenuFromSession(sessionUuid)
}
export function changeRole(attributes) {
  return Instance.call(this).requestChangeRole(attributes)
}
