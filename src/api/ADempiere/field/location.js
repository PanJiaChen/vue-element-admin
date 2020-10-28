const tableName = 'C_Location'

/**
 * Create a location and return the created entity
 * @param {array} attributesList
 */
export function requestCreateLocationAddress({
  attributesList
}) {
  const { requestCreateEntity } = require('@/api/ADempiere/persistence.js')

  return requestCreateEntity({
    tableName,
    attributesList
  })
}

/**
 * Get location entity by identifier
 * @param {number} id as C_Location_ID
 * @param {string} uuid
 */
export function requestGetLocationAddress({
  id,
  uuid
}) {
  const { requestGetEntity } = require('@/api/ADempiere/persistence.js')

  return requestGetEntity({
    tableName,
    recordId: id,
    recordUuid: uuid
  })
}

/**
 * Update an existing location by id or uuid
 * @param {number} id as C_Location_ID
 * @param {string} uuid
 * @param {array} attributesList, all attributes (including empty values)
 */
export function requestUpdateLocationAddress({
  id,
  uuid,
  attributesList
}) {
  const { requestUpdateEntity } = require('@/api/ADempiere/persistence.js')

  return requestUpdateEntity({
    tableName,
    recordId: id,
    recordUuid: uuid,
    attributesList
  })
}
