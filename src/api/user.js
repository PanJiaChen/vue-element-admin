import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/auth/login',
    method: 'post',
    data
  })
}

export function getMenu() {
  return request({
    url: '/admin/auth/menu',
    method: 'get'
  })
}
