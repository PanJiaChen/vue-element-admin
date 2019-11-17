import Cookies from 'js-cookie'

const TokenKey = 'sessionuuid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export * from '@/utils/ADempiere/auth'
