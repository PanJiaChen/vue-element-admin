import { getLanguage } from '@/lang/index'
import { getToken } from '@/utils/auth'
import Dictionary from '@adempiere/grpc-dictionary-client'
import { DICTIONARY_ADDRESS } from '@/api/ADempiere/constants'

// Get Instance for connection
function Instance() {
  return new Dictionary(
    DICTIONARY_ADDRESS,
    getToken(),
    getLanguage() || 'en_US'
  )
}

export function getWindow(uuid, isWithTabs = true) {
  return Instance.call(this).requestWindow({
    uuid,
    isWithTabs,
    isConvertedMetadata: true
  })
}

export function getProcess(uuid, isConvertedMetadata = true) {
  return Instance.call(this).requestProcess({
    uuid: uuid,
    isConvertedMetadata,
    isConvertedFields: true
  })
}

export function getBrowser(uuid, isConvertedMetadata = true) {
  return Instance.call(this).requestBrowser({
    uuid,
    isConvertedMetadata,
    isConvertedFields: true
  })
}

export function getTab(uuid, isWithFields = true, isConvertedMetadata = true) {
  return Instance.call(this).requestTab({
    uuid,
    isWithFields,
    isConvertedMetadata,
    isConvertedFields: true
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
