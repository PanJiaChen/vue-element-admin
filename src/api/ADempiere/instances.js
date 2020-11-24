import { config } from '@/utils/ADempiere/config'
/**
 * Instance for connection to API RESTful with axios
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @author elsiosanchez <elsiosanches@gmail.com>
 * @param {string} url to resource request
 * @param {string} method rest, 'get' and 'post' (as default)
 * @param {object} data body to send post request
 * @param {object} params to send get uri
 * @param {string} responseType default is 'json'
 * @returns {function}
 */
export function ApiRest({
  url,
  method = 'post',
  data = {},
  params = {},
  responseType = 'json'
}) {
  const setInterceptor = (request) => {
    request.interceptors.response.use(response => {
      return response.data
    }, error => {
      return Promise.reject(error)
    })
    return request.interceptors
  }

  const apiRestAddress = config.adempiere.api.fullPath
  const axios = require('axios')
  const request = axios.create({
    baseURL: apiRestAddress,
    // timeout: 10000, // 10s
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType
  })
  request.interceptors = setInterceptor(request)

  const { getToken } = require('@/utils/auth')
  const { getLanguage } = require('@/lang/index')
  const language = getLanguage() || 'en_US'
  params = {
    token: getToken(),
    language,
    ...params
  }

  return request({
    url,
    method,
    data,
    params
  })
}

/**
 * Evaluate the response if is a success or error
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @author elsiosanchez <elsiosanches@gmail.com>
 * @param {object} response
 * @returns {mixed}
 */
export const evaluateResponse = (response) => {
  if (response.code >= 400) {
    const error = {
      code: response.code,
      message: response.result
    }
    throw error
  }

  return response.result
}
