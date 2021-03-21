/**
 * Get entity with binary by identifier
 * @param {string} tableName
 * @param {string} recordUuid
 */
export function getResource({
  uuid,
  tableName
}) {
  const { requestGetEntity } = require('@/api/ADempiere/persistence.js')

  return requestGetEntity({
    recordUuid: uuid,
    tableName
  })
}

/**
 * Update an existing binary by id or uuid
 * @param {string} tableName
 * @param {string} recordUuid
 * @param {object} binaryFile
 */
export function updateResource({
  uuid,
  tableName,
  binaryFile
}) {
  const { requestUpdateEntity } = require('@/api/ADempiere/persistence.js')

  return requestUpdateEntity({
    recordUuid: uuid,
    tableName,
    attributesList: binaryFile
  })
}
