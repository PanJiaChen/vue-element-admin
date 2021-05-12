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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'
import { config } from '@/utils/ADempiere/config'

// Download a resource from file name
export function requestResource({ resourceUuid }, callBack = {
  onData: () => {},
  onStatus: () => {},
  onEnd: () => {}
}) {
  const stream = request({
    url: '/resource',
    method: 'get',
    params: {
      resource_uuid: resourceUuid
    }
  })

  stream.on('data', (response) => callBack.onData(response))
  stream.on('status', (status) => callBack.onStatus(status))
  stream.on('end', (end) => callBack.onEnd(end))

  return stream
}

/**
 * Get image with uri request
 * @param {string} file
 * @param {number} width
 * @param {number} height
 * @param {string} operation fit, resize
 * @returns {promise} with array buffer in response
 */
export function requestImage({
  file,
  width,
  height,
  operation = 'fit'
}) {
  const { getImagePath } = require('@/utils/ADempiere/resource.js')

  const { urn } = getImagePath({
    file,
    width,
    height,
    operation
  })
  return request({
    url: urn,
    method: 'get',
    responseType: 'arraybuffer',
    baseURL: config.adempiere.images.url
  })
}
