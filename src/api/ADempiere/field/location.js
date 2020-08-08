const tableName = 'C_Location'

/**
 * Create a location and return the created entity
 * @param {array} attributes
 */
export function requestCreateLocationAddress({
  attributes
}) {
  const { createEntity } = require('@/api/ADempiere/persistence.js')

  return createEntity({
    tableName,
    attributes,
    formatReturn: 'object'
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
  const { getEntity } = require('@/api/ADempiere/persistence.js')

  return getEntity({
    tableName,
    recordId: id,
    recordUuid: uuid
  })
}

/**
 * Update an existing location by id or uuid
 * @param {number} id as C_Location_ID
 * @param {string} uuid
 * @param {array} attributes, all attributes (including empty values)
 */
export function requestUpdateLocationAddress({
  id,
  uuid,
  attributes
}) {
  const { updateEntity } = require('@/api/ADempiere/persistence.js')

  return updateEntity({
    tableName,
    recordId: id,
    recordUuid: uuid,
    attributes,
    formatReturn: 'object'
  })
}
