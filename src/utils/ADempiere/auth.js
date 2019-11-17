import Cookies from 'js-cookie'

const roleKey = 'roleUuid'

export function setCurrentRole(currentRole) {
  return Cookies.set(roleKey, currentRole)
}

export function getCurrentRole() {
  return Cookies.get(roleKey)
}

export function removeCurrentRole() {
  return Cookies.remove(roleKey)
}
