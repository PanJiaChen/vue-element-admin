
const apiRestAddress = process.env.VUE_APP_API_REST_ADDRESS || '0.0.0.0'
const apiRestPort = process.env.VUE_APP_API_REST_PORT || '8085'

export const API_REST_ADDRESS = `http://${apiRestAddress}:${apiRestPort}/adempiere-api`
