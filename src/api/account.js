import axios from 'axios'
import store from '../store/modules/settings.js'

const apiUrl = 'https://users.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  const dto = {
    'page': query.page,
    'limit': query.limit,
    'platform': query.platform || store.state.platform
  }
  return axios.get(`${apiUrl}/account/search`, { params: dto })
}

export function fetchAccount(id) {
  return axios.get(`${apiUrl}/account/${id}`)
}

export function createAccount(data) {
  const dto = {
    'name': data.name,
    'type': data.type,
    'email': data.email,
    'platform': store.state.platform,
    'phone': data.phone,
    'status': parseInt(data.status),
    'orderConfirmationEmail': data.orderConfirmationEmail,
    'addressLine1': data.address.addressLine1,
    'addressLine2': data.address.addressLine2,
    'county': data.address.county,
    'country': data.address.country,
    'postCode': data.address.postCode
  }

  return axios.post(`${apiUrl}/account/create`, dto)
}

export function updateAccount(data) {
  const dto = {
    'name': data.name,
    'type': data.type,
    'email': data.email,
    'platform': data.platform,
    'phone': data.phone,
    'status': parseInt(data.status),
    'orderConfirmationEmail': data.orderConfirmationEmail,
    'addressLine1': data.address.addressLine1,
    'addressLine2': data.address.addressLine2,
    'county': data.address.county,
    'country': data.address.country,
    'postCode': data.address.postCode
  }

  return axios.put(`${apiUrl}/account/${data.id}`, dto)
}
