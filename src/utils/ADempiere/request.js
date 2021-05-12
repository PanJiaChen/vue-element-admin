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

// Default request connection for ADempiere with default url
import requestAPI from '@/utils/request'
import { config } from '@/utils/ADempiere/config'
import { getToken } from '@/utils/auth'
import { getLanguage } from '@/lang/index'

// Request with default parameters
export function request(requestValues) {
  if (!requestValues) {
    requestValues = {}
  }
  if (!requestValues.params) {
    requestValues.params = {}
  }
  if (!requestValues.baseURL) {
    requestValues.baseURL = config.adempiere.api.url
  }
  //  Timeout
  if (config.adempiere.api.timeout && config.adempiere.api.timeout > 0) {
    requestValues.timeout = config.adempiere.api.timeout
  }
  requestValues.params.token = getToken()
  requestValues.params.language = getLanguage() || 'en_US'
  return new Promise(resolve => {
    requestAPI(requestValues).then(response => {
      resolve(response.result)
    })
  })
}
