
const apiRestAddress = process.env.VUE_APP_API_REST_ADDRESS || 'http://localhost'
const apiRestPort = process.env.VUE_APP_API_REST_PORT || '8085'

export const API_REST_ADDRESS = `${apiRestAddress}:${apiRestPort}/adempiere-api`
