import axios from 'axios'
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function fetchList(query) {
  query.platform = 'OLFDE'
  return axios.get('https://users.service.development.therig.onlinefuelslabs.io/user/search', { params: query })
}

export function fetchUser(id) {
  return axios.get(`https://users.service.development.therig.onlinefuelslabs.io/user/${id}`)
}

export function createUser(data) {
  const dto = __dataToDTO(data)

  return axios.post(`https://users.service.development.therig.onlinefuelslabs.io/user`, dto)
}

export function updateUser(data) {
  const dto = __dataToDTO(data)
  return axios.put(`https://users.service.development.therig.onlinefuelslabs.io/user/${data.id}`, dto)
}

function __dataToDTO(data) {
  return {
    'firstName': data.firstName,
    'lastName': data.lastName,
    'type': data.type,
    'email': data.email,
    'username': data.username,
    'phone': data.phone,
    'statusId': parseInt(data.status_id),
    'accountId': data.accountId,
    'typeId': data.type_id
  }
}
