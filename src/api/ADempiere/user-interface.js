// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/api/ADempiere/instances.js'

/**
 * Get Attachment
 * @param {number}  recordId
 * @param {string}  recordUuid // TODO: Add suppport to record uuid on backend
 */
export function requestResourceReference({
  recordId,
  recordUuid
}) {
  return requestRest({
    url: '/ui/resource-reference',
    method: 'get',
    params: {
      image_id: recordId,
      image_uuid: recordUuid
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/ui/attachment',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(evaluateResponse)
}
