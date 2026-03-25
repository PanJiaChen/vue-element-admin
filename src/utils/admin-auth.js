const DEFAULT_AVATAR = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'

export function parseJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const parts = token.split('.')
  if (parts.length < 2) {
    return null
  }

  try {
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(parts[1].length / 4) * 4, '=')

    return JSON.parse(window.atob(payload))
  } catch (error) {
    return null
  }
}

export function buildUserProfileFromToken(token) {
  const payload = parseJwtPayload(token) || {}
  const roleCode = payload.roleCode || ''

  return {
    name: payload.username || '',
    avatar: DEFAULT_AVATAR,
    introduction: payload.roleName || '',
    roles: roleCode ? [roleCode] : [],
    roleCode,
    roleName: payload.roleName || ''
  }
}
