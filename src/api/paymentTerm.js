import axios from 'axios'

const PaymentTermsEndpointUrl = 'https://metadata.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  return axios.get(`${PaymentTermsEndpointUrl}/payment-terms`, { params: query })
}

export function fetchPaymentTerm(id) {
  return axios.get(`${PaymentTermsEndpointUrl}/payment-terms/${id}?platform=OLFDE`)
}

export function createPaymentTerm(data) {
  const dto = {
    'name': data.name,
    'days': Number(data.days),
    'platform': data.platform || 'OLFDE'
  }

  return axios.post(`${PaymentTermsEndpointUrl}/payment-terms`, dto)
}

export function updatePaymentTerm(data) {
  const dto = {
    'name': data.name,
    'days': Number(data.days),
    'platform': data.platform || 'OLFDE'
  }

  return axios.put(`${PaymentTermsEndpointUrl}/payment-terms/${data._id}`, dto)
}
