import axios from 'axios'

export function fetchList(query) {
  return axios.get('https://users.service.development.therig.onlinefuelslabs.io/account/search', { params: query })
}

export function fetchAccount(id) {
  return axios.get(`https://users.service.development.therig.onlinefuelslabs.io/account/${id}`)
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

  return axios.post(`https://users.service.development.therig.onlinefuelslabs.io/account/create`, dto)
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

  return axios.put(`https://users.service.development.therig.onlinefuelslabs.io/account/${data.id}`, dto)
}
