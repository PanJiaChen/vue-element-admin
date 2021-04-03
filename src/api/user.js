import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/commonAction.do',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/commonAction.do',
    method: 'post',
    data: 'funid=login&pagetype=login&eventcode=logout&user_id=administrator&dataType=json'
  }).then(response => response.data)
}
