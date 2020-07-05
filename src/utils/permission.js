import store from '@/store'

/**
 * @param {Array} permissionRoles
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(permissionRoles) {
  if (permissionRoles && Array.isArray(permissionRoles) && permissionRoles.length > 0) {
    const roles = store.getters && store.getters.roles

    // has permission
    return roles.some(role => permissionRoles.includes(role))
  }

  console.error(`need roles! Like v-permission="['admin','editor']"`)
  return false
}
