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
    url: '/ui/set-preference',
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
    url: '/ui/delete-preference',
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
