import Cookies from 'js-cookie'

const roleKey = 'roleUuid'
const organizationKey = 'organizationUuid'
const warehouseKey = 'warehouseUuid'

export function setCurrentRole(currentRole) {
  return Cookies.set(roleKey, currentRole)
}

export function getCurrentRole() {
  return Cookies.get(roleKey)
}

export function setCurrentOrganization(currentOrganization) {
  return Cookies.set(organizationKey, currentOrganization)
}

export function getCurrentOrganization() {
  return Cookies.get(organizationKey)
}

export function removeCurrentOrganization() {
  return Cookies.remove(organizationKey)
}

export function setCurrentWarehouse(currentWarehouse) {
  return Cookies.set(warehouseKey, currentWarehouse)
}

export function getCurrentWarehouse() {
  return Cookies.get(warehouseKey)
}

export function removeCurrentWarehouse() {
  return Cookies.remove(warehouseKey)
}

export function removeCurrentRole() {
  return Cookies.remove(roleKey)
}
