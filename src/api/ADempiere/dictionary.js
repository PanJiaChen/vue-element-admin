// Get Instance for connection
import { DictionaryInstance as Instance } from '@/api/ADempiere/instances.js'

export function getWindow({ uuid, id, isWithTabs = true }) {
  return Instance.call(this).requestWindow({
    uuid,
    id,
    isWithTabs
  })
}

export function getProcess({ uuid, id }) {
  return Instance.call(this).requestProcess({
    uuid,
    id,
    isWithFields: true
  })
}

export function getBrowser({ uuid, id }) {
  return Instance.call(this).requestBrowser({
    uuid,
    id
  })
}

export function getTab({ uuid, id, isWithFields = true }) {
  return Instance.call(this).requestTab({
    uuid,
    id,
    isWithFields
  })
}

export function getField({
  fieldUuid,
  columnUuid,
  elementUuid,
  // TableName + ColumnName
  tableName,
  columnName,
  elementColumnName
}) {
  return Instance.call(this).requestField({
    fieldUuid,
    columnUuid,
    elementUuid,
    // TableName + ColumnName
    tableName,
    columnName,
    elementColumnName
  })
}

/**
 * Request Form
 * @param {string} uuid
 * @param {number} id, integer identifier
 */
export function requestForm({ uuid, id }) {
  return Instance.call(this).requestForm({
    uuid,
    id
  })
}

export function requestReference({ referenceUuid, columnName }) {
  return Instance.call(this).requestReference({
    referenceUuid,
    columnName
  })
}

export function requestValidationRule({ validationRuleUuid }) {
  return Instance.call(this).requestValidationRule({
    validationRuleUuid
  })
}
