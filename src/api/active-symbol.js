import axios from 'axios'

const apiUrl = 'http://127.0.0.1:3000'

// export function fetchList(query) {
//   return axios.get(`${apiUrl}/fuels`, { params: query })
// }

export function fetchActiveSymbol() {
  return axios.get(`${apiUrl}/symbol/future/active/`)
}

export function createActiveSymbol(data) {
  const dto = {
    'type': data.type,
    'start_date': data.start_date,
    'symbol': data.symbol,
    'platform': 'OLFUK',
    'allow_retroactive_date': false
    // 'type': 'SETTLE',
    // 'start_date': '2019-10-20T13:53:32.216Z',
    // 'symbol': 'GAS'
  }
  if (data.allow_retroactive_data) dto.allow_retroactive_data = data.allow_retroactive_data
  if (data.platform) dto.platform = data.platform

  console.log((`${apiUrl}/symbol/future/active`))

  return axios.put(`${apiUrl}/symbol/future/active`, dto)
}

export function deleteActiveSymbol(id) {
  return axios.delete(`${apiUrl}/symbol/future/active?id=${id}`)
}
