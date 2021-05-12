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
// This file is for get all information for dashboard of ADempiere client,
// please if you want to implement a custom dashboard create a new fielwith api definition
// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

// Get Recent Items based on selection option
export function requestListRecentItems({
  userUuid,
  roleUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/dashboard/addons/user/recent-items',
    method: 'get',
    params: {
      user_uuid: userUuid,
      role_uuid: roleUuid,
      current_session: true,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(recentItmesReponse => {
      const { convertRecentItemsList } = require('@/utils/ADempiere/apiConverts/dashboard.js')

      return convertRecentItemsList(recentItmesReponse)
    })
}

/**
 * Request Favorites List
 * @param {string} userUuid
 */
export function getFavoritesFromServer({
  userId,
  userUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/dashboard/addons/user/favorites',
    method: 'get',
    params: {
      user_id: userId,
      user_uuid: userUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(favoritesListReponse => {
      const { convertFavorite } = require('@/utils/ADempiere/apiConverts/dashboard.js')

      return {
        recordCount: favoritesListReponse.record_count,
        favoritesList: favoritesListReponse.records.map(favorite => {
          return convertFavorite(favorite)
        }),
        nextPageToken: favoritesListReponse.next_page_token
      }
    })
}
