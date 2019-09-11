import axios from 'axios'

const LiftingPeriodEndpointUrl = 'https://metadata.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  return axios.get(`${LiftingPeriodEndpointUrl}/lifting-periods`, { params: query })
}

export function fetchLiftingPeriod(id) {
  return axios.get(`${LiftingPeriodEndpointUrl}/lifting-periods/${id}?platform=OLFDE`)
}

export function createLiftingPeriod(data) {
  const dto = {
    'name': data.name,
    'days': Number(data.days),
    'platform': data.platform || 'OLFDE'
  }

  return axios.post(`${LiftingPeriodEndpointUrl}/lifting-periods`, dto)
}

export function updateLiftingPeriod(data) {
  const dto = {
    'name': data.name,
    'days': Number(data.days),
    'platform': data.platform || 'OLFDE'
  }

  return axios.put(`${LiftingPeriodEndpointUrl}/lifting-periods/${data._id}`, dto)
}
