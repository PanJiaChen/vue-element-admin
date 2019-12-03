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
  if (loginValues.role !== undefined && loginValues.role.trim() !== '') {
    return Instance.call(this).requestLogin(
      loginValues.userName,
      loginValues.password,
      loginValues.role,
      null,
      loginValues.language
    )
  } else {
    return Instance.call(this).requestLoginDefault(
      loginValues.userName,
      loginValues.password,
      loginValues.language
    )
  }
}

// Get User Info from session Uuid or token
export function getInfo(token) {
  return Instance.call(this).requestUserInfoFromSession(token)
    .then(session => {
      var roles = []
      var rolesList = session.getRolesList().map(itemRol => {
        roles.push(itemRol.getName())
        return {
          id: itemRol.getId(),
          uuid: itemRol.getUuid(),
          name: itemRol.getName(),
          description: itemRol.getDescription(),
          clientId: itemRol.getClientid(),
          clientName: itemRol.getClientname(),
          organizationList: itemRol.getOrganizationsList()
        }
      })
      // TODO: Add user.id, user.level in request
      const user = session.getUserinfo()

      const response = {
        id: user.getId(),
        uuid: user.getUuid(),
        name: user.getName(),
        comments: user.getComments(),
        description: user.getDescription(),
        // TODO: Add from ADempiere
        avatar: 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4',
        roles: roles, // rol list names, used from app (src/permission.js, src/utils/permission.js)
        rolesList: rolesList,
        responseGrpc: session
      }
      return response
    }).catch(error => {
      console.log(error)
    })
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
  return Instance.call(this).requestLogout(sessionUuid)
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
