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

import { convertRecentItemsList, convertFavorite, convertDashboard, convertPendingDocument } from '../../../../../src/utils/ADempiere/apiConverts/dashboard'
import recentListItems from './objects/fromApi/recentListItems.json'
import convertedRecentListItems from './objects/converted/recentListItems.json'
import favorite from './objects/fromApi/favorite.json'
import convertedFavorite from './objects/converted/favorite.json'
import dashboard from './objects/fromApi/dashboard.json'
import convertedDashboard from './objects/converted/dashboard.json'
import pendingDocument from './objects/fromApi/pendingDocument.json'
import convertedPendingDocument from './objects/converted/pendingDocument.json'

it('should convert the recent item list', () => {
  const actualConvertedList = convertRecentItemsList(recentListItems)
  expect(actualConvertedList).toEqual(convertedRecentListItems)
})

it('should convert the favorite', () => {
  const actualFavorite = convertFavorite(favorite)
  expect(actualFavorite).toEqual(convertedFavorite)
})

it('should convert dashboard', () => {
  const actualDashbaord = convertDashboard(dashboard)
  expect(actualDashbaord).toEqual(convertedDashboard)
})

it('should convert a pending document', () => {
  const actualPendingDocument = convertPendingDocument(pendingDocument)
  expect(actualPendingDocument).toEqual(convertedPendingDocument)
})
