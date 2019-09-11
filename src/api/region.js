import axios from 'axios'
import store from '../store/modules/settings.js'

const RegionEndpointUrl = 'https://metadata.service.development.therig.onlinefuelslabs.io'

export function fetchList() {
  return axios.get(`${RegionEndpointUrl}/regions?platform=${store.state.platform}`)
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
