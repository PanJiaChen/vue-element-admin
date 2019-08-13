import axios from 'axios'

const RegionEndpointUrl = 'https://metadata.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  return axios.get(`${RegionEndpointUrl}/regions`, { params: query })
}

export function fetchRegion(id) {
  return axios.get(`${RegionEndpointUrl}/region/${id}?platform=OLFDE`)
}

export function createRegion(data) {
  const dto = {
    'name': data.name,
    'platform': data.platform || 'OLFDE'
  }

  return axios.post(`${RegionEndpointUrl}/regions`, dto)
}

export function updateRegion(data) {
  const dto = {
    'name': data.name,
    'platform': data.platform || 'OLFDE'
  }

  return axios.put(`${RegionEndpointUrl}/region/${data._id}`, dto)
}
