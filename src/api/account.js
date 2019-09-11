import axios from 'axios'
import store from '../store/modules/settings.js'

const apiUrl = 'https://users.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  return axios.get(`${apiUrl}/account/search`, { params: query })
}

export function fetchRelationships(query) {
  return axios.get(`${apiUrl}/account/relationship`, { params: query })
}

export function fetchAccount(id) {
  return axios.get(`${apiUrl}/account/${id}`)
}

export function createAccount(data) {
  const dto = {
    'name': data.name,
    'fullName': data.fullName || data.name,
    'type': data.type,
    'email': data.email,
    'platform': store.state.platform,
    'phone': data.phone,
    'status': parseInt(data.status),
    'addressLine1': data.address.addressLine1,
    'addressLine2': data.address.addressLine2,
    'county': data.address.county,
    'country': data.address.country,
    'postCode': data.address.postCode,
    'fuelRestrictions': data.restrictions.fuels,
    'terminalRestrictions': data.restrictions.terminals,
    'paymentTermsRestrictions': data.restrictions.paymentTerms,
    'liftingPeriodRestrictions': data.restrictions.liftingPeriods,
    'sendOrderCompleteAlert': data.sendOrderCompleteAlert,
    'orderCompleteAlertText': data.orderCompleteAlertText
  }

  return axios.post(`${apiUrl}/account/create`, dto)
}

export function updateAccount(data) {
  const dto = {
    'name': data.name,
    'fullName': data.fullName || data.name,
    'type': data.type,
    'email': data.email,
    'platform': data.platform,
    'phone': data.phone,
    'status': parseInt(data.status),
    'addressLine1': data.address.addressLine1,
    'addressLine2': data.address.addressLine2,
    'county': data.address.county,
    'country': data.address.country,
    'postCode': data.address.postCode,
    'fuelRestrictions': data.restrictions.fuels,
    'terminalRestrictions': data.restrictions.terminals,
    'paymentTermsRestrictions': data.restrictions.paymentTerms,
    'liftingPeriodRestrictions': data.restrictions.liftingPeriods,
    'sendOrderCompleteAlert': data.sendOrderCompleteAlert,
    'orderCompleteAlertText': data.orderCompleteAlertText
  }

  return axios.put(`${apiUrl}/account/${data.id}`, dto)
}
