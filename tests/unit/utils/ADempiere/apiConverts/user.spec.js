import { convertRole, convertSession } from '@/utils/ADempiere/apiConverts/user'
import role from './objects/fromApi/role.json'
import convertedRole from './objects/converted/role.json'
import user from './objects/fromApi/user.json'
import convertedUser from './objects/converted/user.json'

describe('role', () => {
  it('should return a converted role object', () => {
    const actualRole = convertRole(role)
    expect(actualRole).toEqual(convertedRole)
  })
})

describe('user', () => {
  it('should return a converted user object', () => {
    const actualUser = convertSession(user)
    expect(actualUser).toEqual(convertedUser)
  })
})
