import axios from 'axios'
import request from '@/utils/request'
import store from '../store/modules/settings.js'

const apiUrl = 'https://users.service.development.therig.onlinefuelslabs.io'

export function login(data) {
  const payload = {
    code: 20000,
    data: { token: 'admin-token' }
  }

  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(payload)
    }, 250)
  })
}

export function getInfo(token) {
  const payload = {
    code: 20000,
    data: {
      roles: ['admin'],
      introduction: 'Super Administrator',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    }
  }

  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(payload)
    }, 250)
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function fetchSubstringList(substring, query) {
  return axios.get(`${apiUrl}/user/search/${substring}/`, { params: query })
}
export function fetchList(query) {
  query.platform = store.state.platform
  return axios.get(`${apiUrl}/user/search`, { params: query })
}

export function fetchUser(id) {
  return axios.get(`${apiUrl}/user/${id}`)
}

export function createUser(data) {
  const dto = __dataToDTO(data)

  return axios.post(`${apiUrl}/user`, dto)
}

export function updateUser(data) {
  const dto = __dataToDTO(data)
  return axios.put(`${apiUrl}/user/${data.id}`, dto)
}

export function sendPasswordReset(email, type) {
  const dto = {
    email,
    type,
    platform: 'OLFDE'
  }

  return axios.post(`${apiUrl}/user/password/send-reset-link`, dto)
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
