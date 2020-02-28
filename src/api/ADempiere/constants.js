
const proxyAddress = process.env.VUE_APP_PROXY_ADDRESS || 'localhost'
const proxyPort = process.env.VUE_APP_PROXY_PORT || '8989'

export const API_ADDRESS = `http://${proxyAddress}:${proxyPort}`

export const ACCESS_ADDRESS = `${API_ADDRESS}/access`

export const DICTIONARY_ADDRESS = `${API_ADDRESS}/dictionary`

export const BUSINESS_DATA_ADDRESS = `${API_ADDRESS}/businessdata`

export const ENROLLMENT_ADDRESS = `${API_ADDRESS}/enrollment`
