// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
  getKeyLayout
} from '@/api/ADempiere/form/point-of-sales.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

/**
 * keyLayout Actions
 */
export default {
  getKeyLayoutFromServer({ commit, rootGetters }, keyLayoutUuid) {
    if (isEmptyValue(keyLayoutUuid)) {
      keyLayoutUuid = rootGetters.posAttributes.currentPointOfSales.keyLayoutUuid
    }

    if (isEmptyValue(keyLayoutUuid)) {
      console.info('not load key layout')
      commit('setKeyLayout', {
        isLoaded: false,
        isReload: true
      })
      return
    }
    getKeyLayout({
      keyLayoutUuid
    })
      .then(responseKeyLayout => {
        commit('setKeyLayout', {
          ...responseKeyLayout,
          isLoaded: true,
          isReload: false
        })
      })
      .catch(error => {
        console.warn(`getKeyLayoutFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  }
}
