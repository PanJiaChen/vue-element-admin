import axios from 'axios'

const TerminalEndpointUrl = 'https://metadata.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  return axios.get(`${TerminalEndpointUrl}/terminals`, { params: query })
}

export function fetchTerminal(id) {
  return axios.get(`${TerminalEndpointUrl}/terminal/${id}?platform=OLFDE`)
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
    'platform': data.platform || 'OLFDE',
    'addressLine1': data.address.addressLine1,
    'addressLine2': data.address.addressLine2,
    'county': data.address.county,
    'country': data.address.country,
    'postCode': data.address.postCode,
    'identifier': data.identifier,
    'contactNumber': data.contactNumber,
    'fullName': data.fullName,
    'meta': data.meta,
    'regionId': data.region_id
  }
}
