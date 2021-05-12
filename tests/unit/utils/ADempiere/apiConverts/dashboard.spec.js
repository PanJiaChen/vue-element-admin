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
