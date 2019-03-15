import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

export function addRole(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export function updateRole(key, data) {
  return request({
    url: `/roles/${key}`,
    method: 'put',
    data
  })
}
