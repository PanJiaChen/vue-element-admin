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

// Service for backend based on API
// use this service for consume all related to preference of field
import { request } from '@/utils/ADempiere/request'

// Update preference from API using criteria
export function setPreference({
  parentUuid,
  panelType,
  attribute,
  value,
  isForCurrentUser,
  isForCurrentClient,
  isForCurrentOrganization,
  isForCurrentContainer
}) {
  return request({
    url: '/user-interface/component/preference/set-preference',
    method: 'post',
    data: {
      container_uuid: parentUuid,
      column_name: attribute,
      value: value,
      is_for_current_user: isForCurrentUser,
      is_for_current_client: isForCurrentClient,
      is_for_current_organization: isForCurrentOrganization,
      is_for_current_container: isForCurrentContainer
    }
  })
}

// Delete preference based on match
export function deletePreference({
  parentUuid,
  panelType,
  attribute,
  isForCurrentUser,
  isForCurrentClient,
  isForCurrentOrganization,
  isForCurrentContainer
}) {
  return request({
    url: '/user-interface/component/preference/delete-preference',
    method: 'post',
    data: {
      container_uuid: parentUuid,
      column_name: attribute,
      is_for_current_user: isForCurrentUser,
      is_for_current_client: isForCurrentClient,
      is_for_current_organization: isForCurrentOrganization,
      is_for_current_container: isForCurrentContainer
    }
  })
}
