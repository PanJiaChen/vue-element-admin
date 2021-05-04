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

// Service for get ADempiere Vue releases from repo.
// Add here any service related with it
import request from '@/utils/request'
import { config } from '@/utils/ADempiere/config'
const baseURL = config.documentation.api.url
// Fetch releases from repository
export function fetchReleasesList({
  repository
}) {
  return request({
    baseURL,
    url: repository + '/releases',
    method: 'get',
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
}
// Fetch readme from repository
export function fetchReadme({
  repository
}) {
  return request({
    baseURL,
    url: repository,
    method: 'get',
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
}
