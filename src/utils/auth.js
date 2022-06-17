import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { SameSite: 'Lax' })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
