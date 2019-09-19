import axios from 'axios'

const apiUrl = 'https://localhost:3000'

export function fetchActiveSymbol() {
  return axios.get(`${apiUrl}/symbol/future/active/`)
}

export function createActiveSymbol(data) {
  const dto = {
    'type': data.type,
    'start_date': data.start_date,
    'symbol': data.symbol
  }
  if (data.allow_retroactive_data) dto.allow_retroactive_data = data.allow_retroactive_data
  if (data.platform) dto.platform = data.platform

  axios.put(`${apiUrl}/symbol/future/active`, dto)
}

export function deleteActiveSymbol(id) {
  axios.delete(`${apiUrl}/symbol/future/active?id=${id}`)
}
