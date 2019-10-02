import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    baseURL: 'http://localhost:8010',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    authorization: token,
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function sendAnalyzeRequest(token) {
  return request({
    url: '/testpredict',
    method: 'get',
    baseURL: 'http://localhost:8010',
    // authorization: token,
    // params: { token }
  })
}

export function sendAnalyzeOnDateRequest(token, fromDate, toDate) {
  return request({
    url: '/predictOnDate',
    method: 'get',
    baseURL: 'http://localhost:8010',
    authorization: token,
    params: { token, fromDate, toDate }
  })
}
