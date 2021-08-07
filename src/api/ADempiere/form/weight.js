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

import { request } from '@/utils/ADempiere/request'
import { config } from '@/utils/ADempiere/config'

// Get Weight
export function getWeight({
  idScale
}) {
  return request({
    url: `${config.Weight.endpoint}/weight`,
    method: 'get',
    params: {
      id_scale: idScale
    }
  })
    .then(weightResponse => {
      return weightResponse
    })
}
// List Scale
export function getListScale() {
  return request({
    url: `${config.Weight.endpoint}/scale`,
    method: 'get'
  })
    .then(scaleResponse => {
      return scaleResponse
    })
}
