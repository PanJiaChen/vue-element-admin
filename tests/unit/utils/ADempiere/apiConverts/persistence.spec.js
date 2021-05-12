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

import { convertEntity, convertEntityList, convertTranslation } from '@/utils/ADempiere/apiConverts/persistence'
import entityList from './objects/fromApi/entityList.json'
import convertedEntityList from './objects/converted/entityList.json'
import entity from './objects/fromApi/entity.json'
import convertedEntity from './objects/converted/entity.json'
import translation from './objects/fromApi/translation.json'
import convertedTranslation from './objects/converted/translation.json'

describe('entity list', () => {
  it('should return a converted entity list object', () => {
    const actualEntityList = convertEntityList(entityList)
    expect(actualEntityList).toEqual(convertedEntityList)
  })
})

describe('entity', () => {
  it('should return a converted entity object', () => {
    const actualEntity = convertEntity(entity)
    expect(actualEntity).toEqual(convertedEntity)
  })
})

describe('translation', () => {
  it('should return a converted translation object', () => {
    const actualTranslation = convertTranslation(translation)
    expect(actualTranslation).toEqual(convertedTranslation)
  })
})
