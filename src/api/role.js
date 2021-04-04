import { request } from '@/utils/ADempiere/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function requestRolesList(token) {
  return request({
    url: 'user/roles',
    method: 'get',
    params: {
      token
    }
  })
    .then(responseRoles => {
      const { convertRole } = require('@/utils/ADempiere/apiConverts/user.js')
      const rolesList = responseRoles.map(itemRol => {
        return convertRole(itemRol)
      })

      return rolesList
    })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}

/**
 * Change role of access
 * @param {string} roleUuid
 * @param {string} organizationUuid
 * @param {string} warehouseUuid
 */
export function requestChangeRole({
  roleUuid,
  organizationUuid,
  warehouseUuid
}) {
  return request({
    url: 'user/change-role',
    method: 'post',
    data: {
      role: roleUuid,
      organization: organizationUuid,
      warehouse: warehouseUuid
    }
  })
    .then(responseChangeRole => {
      const { convertSession } = require('@/utils/ADempiere/apiConverts/user.js')

      return convertSession(responseChangeRole)
    })
}
