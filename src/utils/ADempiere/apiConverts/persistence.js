// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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

import { convertArrayKeyValueToObject } from '@/utils/ADempiere/valueFormat.js'
import { camelizeObjectKeys } from '../transformObject'

export function convertEntityList(entityList) {
  const convertedEntityList = camelizeObjectKeys(entityList)
  convertedEntityList.recordsList = entityList.records.map(record => convertEntity(record))
  delete convertedEntityList['records']
  return convertedEntityList
}

export function convertEntity(entity) {
  const convertedEntity = camelizeObjectKeys(entity)
  convertedEntity.attributes = convertArrayKeyValueToObject({
    array: entity.attributes,
    keyName: 'key'
  })
  return convertedEntity
}

export function convertTranslation(translation) {
  return camelizeObjectKeys(translation)
}
