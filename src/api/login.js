import request from '@/utils/request'

export function loginByUsername(username, password, fid) {
  const data = {
    username,
    password,
    fid
  }
  return request({
    url: '/user/login',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

