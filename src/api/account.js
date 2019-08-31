import axios from 'axios'

const apiUrl = 'https://users.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  return axios.get(`${apiUrl}/account/search`, { params: query })
}

export function fetchAccount(id) {
  return axios.get(`${apiUrl}/account/${id}`)
}

export function createAccount(data) {
  const dto = {
    'name': data.name,
    'type': data.type,
    'email': data.email,
    'platform': data.platform || 'OLFDE',
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