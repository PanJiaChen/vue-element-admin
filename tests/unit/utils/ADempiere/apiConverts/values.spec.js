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

import {
  convertReference,
  convertReferencesList
} from '@/utils/ADempiere/apiConverts/values'
import reference from './objects/fromApi/reference.json'
import convertedReference from './objects/converted/reference.json'
import referenceList from './objects/fromApi/referenceList.json'
import convertedReferenceList from './objects/converted/referenceList.json'

describe('reference', () => {
  it('should return a converted reference object', () => {
    const actualReference = convertReference(reference)
    expect(actualReference).toEqual(convertedReference)
  })
})

describe('referenceList', () => {
  it('should return a converted referenceList object', () => {
    const actualReferenceList = convertReferencesList(referenceList)
    expect(actualReferenceList).toEqual(convertedReferenceList)
  })
})
