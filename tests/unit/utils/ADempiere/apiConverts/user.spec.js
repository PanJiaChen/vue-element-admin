// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Sofia Calderon sofia.ester.calderon@gmail.com www.westfalia-it.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
