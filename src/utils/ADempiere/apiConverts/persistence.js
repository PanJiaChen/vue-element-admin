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

export function convertEntityList(entityListToConvert) {
  return {
    nextPageToken: entityListToConvert.next_page_token,
    recordCount: entityListToConvert.record_count,
    recordsList: entityListToConvert.records.map(record => {
      return convertEntity(record)
    })
  }
}

export function convertEntity(entityToConvert) {
  return {
    id: entityToConvert.id,
    uuid: entityToConvert.uuid,
    tableName: entityToConvert.table_name,
    attributes: convertArrayKeyValueToObject({
      array: entityToConvert.attributes,
      keyName: 'key'
    })
  }
}

export function convertTranslation(translationToConvert) {
  return {
    language: translationToConvert.language,
    uuid: translationToConvert.uuid,
    values: translationToConvert.values
  }
}
