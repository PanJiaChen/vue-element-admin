import Cookies from 'js-cookie'

const TokenKey = 'sessionUuid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  Cookies.set(TokenKey, token)
}

export function removeToken() {
  Cookies.remove(TokenKey)
}

export * from '@/utils/ADempiere/auth'
