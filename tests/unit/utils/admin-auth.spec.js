import { buildUserProfileFromToken, parseJwtPayload } from '@/utils/admin-auth'

function createJwt(payload) {
  const encode = obj => Buffer.from(JSON.stringify(obj)).toString('base64url')
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`
}

describe('admin auth utils', () => {
  it('parses jwt payload from backend admin token', () => {
    const token = createJwt({
      username: 'admin_user',
      roleCode: 'SUPER_ADMIN',
      roleName: 'Super Admin'
    })

    expect(parseJwtPayload(token)).toEqual({
      username: 'admin_user',
      roleCode: 'SUPER_ADMIN',
      roleName: 'Super Admin'
    })
  })

  it('builds user profile from backend admin token', () => {
    const token = createJwt({
      username: 'admin_user',
      roleCode: 'SUPER_ADMIN',
      roleName: 'Super Admin'
    })

    expect(buildUserProfileFromToken(token)).toMatchObject({
      name: 'admin_user',
      introduction: 'Super Admin',
      roleCode: 'SUPER_ADMIN',
      roleName: 'Super Admin',
      roles: ['SUPER_ADMIN']
    })
  })
})
