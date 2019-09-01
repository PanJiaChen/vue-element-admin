import axios from 'axios'

const apiUrl = 'https://orders.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  query.platform = 'OLFDE'
  query.accountId = '5caf6ca5bca1f9001212b6ec'
  return axios.get(`${apiUrl}/orders`, { params: query })
}

export function fetchOrder(id) {
  return axios.get(`${apiUrl}/orders/${id}`)
}
