import request from '@/utils/request'

export function fetchAsyncRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}
