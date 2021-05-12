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

import { camelizeObjectKeys, renameObjectKey } from '../transformObject.js'

export function convertRecentItemsList(recentItemsList) {
  const convertedList = camelizeObjectKeys(recentItemsList)
  convertedList.recentItemsList = recentItemsList.records.map(item => camelizeObjectKeys(item))
  delete convertedList['records']
  return convertedList
}

export function convertFavorite(favorite) {
  return camelizeObjectKeys(favorite)
}

export function convertDashboard(dashboard) {
  return camelizeObjectKeys(dashboard)
}

export function convertPendingDocument(pendingDocument) {
  const convertedDocument = camelizeObjectKeys(pendingDocument)
  convertedDocument.criteria = camelizeObjectKeys(pendingDocument.criteria)
  renameObjectKey(convertedDocument.criteria, 'values', 'valuesList')
  renameObjectKey(convertedDocument.criteria, 'orderByColumns', 'orderByColumnList')
  return convertedDocument
}
