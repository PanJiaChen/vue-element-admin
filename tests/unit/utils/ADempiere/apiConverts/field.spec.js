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

const { convertFieldGroup, convertField } = require('@/utils/ADempiere/apiConverts/field')
import fieldGroup from './objects/fromApi/fieldGroup.json'
import convertedFieldGroup from './objects/converted/fieldGroup.json'
import field from './objects/fromApi/field.json'
import convertedField from './objects/converted/field.json'

describe('field group', () => {
  it('should return a converted field group object', () => {
    const actualFieldGroup = convertFieldGroup(fieldGroup)
    expect(actualFieldGroup).toEqual(convertedFieldGroup)
  })
})

describe('field', () => {
  it('should return a converted field object', () => {
    const actualField = convertField(field)
    expect(actualField).toEqual(convertedField)
  })
})
