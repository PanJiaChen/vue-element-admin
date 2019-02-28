import Mock from 'mockjs'

// admin 角色可以访问所有菜单
const roles = []

export default {
  getRoles() {
    return roles
  },
  addRole() {
    const res = {
      data: Mock.mock('id')
    }
    return res
  },
  updateRole() {
    const res = {
      data: 'success'
    }
    return res
  },
  deleteRole() {
    const res = {
      data: 'success'
    }
    return res
  }
}
