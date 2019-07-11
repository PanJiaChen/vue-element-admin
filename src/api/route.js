import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function importRoutes(data) {
  return request({
    url: '/routes',
    method: 'put',
    data
  })
}
