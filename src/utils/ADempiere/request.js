// Default request connection for ADempiere with default url
import requestAPI from '@/utils/request'
import { config } from '@/utils/ADempiere/config'
import { getToken } from '@/utils/auth'
import { getLanguage } from '@/lang/index'

// Request with default parameters
export function request(requestValues) {
  if (!requestValues) {
    requestValues = {}
  }
  if (!requestValues.params) {
    requestValues.params = {}
  }
  requestValues.baseURL = config.adempiere.api.url
  requestValues.params.token = getToken()
  requestValues.params.language = getLanguage() || 'en_US'
  return new Promise(resolve => {
    requestAPI(requestValues).then(response => {
      resolve(response.result)
    })
  })
}
