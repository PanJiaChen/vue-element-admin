import axios from 'axios'

const ProductEndpointUrl = 'https://metadata.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  return axios.get(`${ProductEndpointUrl}/fuels`, { params: query })
}

export function fetchProduct(id) {
  return axios.get(`${ProductEndpointUrl}/fuels/${id}?platform=OLFDE`)
}

export function createProduct(data) {
  const dto = __dataToDTO(data)
  return axios.post(`${ProductEndpointUrl}/fuels`, dto)
}

export function updateProduct(data) {
  const dto = __dataToDTO(data)
  return axios.put(`${ProductEndpointUrl}/fuels/${data._id}`, dto)
}

function __dataToDTO(data) {
  return {
    'name': data.name,
    'description': data.description,
    'lpt': Number(data.lpt),
    'duty': Number(data.duty),
    'type': 'SPOT',
    'platform': data.platform || 'OLFDE',
    'meta': data.meta,
    'status': data.status
  }
}
