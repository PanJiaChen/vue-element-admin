import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/producer-helloworld/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/producer-helloworld/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/producer-helloworld/user/logout',
    method: 'post'
  })
}
