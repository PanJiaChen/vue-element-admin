// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Get Attachment
 * @param {number}  recordId
 * @param {string}  recordUuid // TODO: Add suppport to record uuid on backend
 */
export function requestResourceReference({
  recordId,
  recordUuid
}) {
  return request({
    url: '/ui/resource-reference',
    method: 'get',
    params: {
      image_id: recordId,
      image_uuid: recordUuid
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Get Attachment
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function requestAttachment({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/ui/attachment',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(respose => {
      return respose
    })
}
