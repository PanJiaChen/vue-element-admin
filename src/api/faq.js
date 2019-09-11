import axios from 'axios'

const FAQEndpointUrl = 'https://metadata.service.development.therig.onlinefuelslabs.io'

export function fetchList(query) {
  return axios.get(`${FAQEndpointUrl}/faqs`, { params: query })
}

export function fetchFaq(id) {
  return axios.get(`${FAQEndpointUrl}/faqs/${id}?platform=OLFDE`)
}

export function createFaq(data) {
  const dto = __dataToDTO(data)
  return axios.post(`${FAQEndpointUrl}/faqs`, dto)
}

export function updateFaq(data) {
  const dto = __dataToDTO(data)
  return axios.put(`${FAQEndpointUrl}/faqs/${data._id}`, dto)
}

function __dataToDTO(data) {
  return {
    'question': data.question,
    'answer': data.answer,
    'order': parseInt(data.order),
    'status': data.status,
    'platform': 'OLFDE'
  }
}
