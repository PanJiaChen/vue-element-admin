import axios from 'axios'
import store from '../store/modules/settings.js'

const TerminalEndpointUrl = 'https://metadata.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  query.platform = store.state.platform
  return axios.get(`${TerminalEndpointUrl}/terminals`, { params: query })
}

export function fetchTerminal(id) {
  return axios.get(`${TerminalEndpointUrl}/terminal/${id}?platform=${store.state.platform}`)
}

export function createTerminal(data) {
  const dto = __dataToDTO(data)
  return axios.post(`${TerminalEndpointUrl}/terminals`, dto)
}

export function updateTerminal(data) {
  const dto = __dataToDTO(data)
  return axios.put(`${TerminalEndpointUrl}/terminal/${data._id}`, dto)
}

function __dataToDTO(data) {
  return {
    'name': data.name,
    'platform': store.state.platform,
    'addressLine1': data.address.line1,
    'addressLine2': data.address.line2,
    'county': data.address.county,
    'country': data.address.country,
    'postCode': data.address.postCode,
    'identifier': data.identifier
  }
}
