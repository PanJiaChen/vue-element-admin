// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Request dictionary Window metadata
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestWindowMetadata({
  uuid,
  id
}) {
  return request({
    url: '/dictionary/window',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(windowResponse => {
      const { convertWindow } = require('@/utils/ADempiere/apiConverts/dictionary.js')

      return convertWindow(windowResponse)
    })
}

/**
 * Request dictionary Process/Report metadata
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestProcessMetadata({
  uuid,
  id
}) {
  return request({
    url: '/dictionary/process',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(processResponse => {
      const { convertProcess } = require('@/utils/ADempiere/apiConverts/dictionary.js')

      return convertProcess(processResponse)
    })
}

/**
 * Request dictionary Smart Browser metadata
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestBrowserMetadata({
  uuid,
  id
}) {
  return request({
    url: '/dictionary/browser',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(browserResponse => {
      const { convertBrowser } = require('@/utils/ADempiere/apiConverts/dictionary.js')

      return convertBrowser(browserResponse)
    })
}

/**
 * Request dictionary Form metadata
 * @param {string} uuid universally unique identifier
 * @param {number} id, integer identifier
 */
export function requestForm({
  uuid,
  id
}) {
  return request({
    url: '/dictionary/form',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(formResponse => {
      const { convertForm } = require('@/utils/ADempiere/apiConverts/dictionary.js')

      return convertForm(formResponse)
    })
}

export function requestFieldMetadata({
  uuid,
  columnUuid,
  elementUuid,
  fieldUuid,
  // TableName + ColumnName
  tableName,
  columnName,
  elementColumnName
}) {
  return request({
    url: '/dictionary/field',
    method: 'get',
    params: {
      uuid,
      column_uuid: columnUuid,
      element_uuid: elementUuid,
      field_uuid: fieldUuid,
      // TableName + ColumnName
      table_name: tableName,
      column_name: columnName,
      element_column_name: elementColumnName
    }
  })
    .then(fieldResponse => {
      const { convertField } = require('@/utils/ADempiere/apiConverts/field.js')

      return convertField(fieldResponse)
    })
}

export function requestReference({
  uuid,
  columnName
}) {
  return request({
    url: '/dictionary/reference',
    method: 'get',
    params: {
      uuid,
      column_name: columnName
    }
  })
    .then(validationResponse => {
      const { convertReference } = require('@/utils/ADempiere/apiConverts/field.js')

      return convertReference(validationResponse)
    })
}

export function requestValidationRule({
  uuid,
  id
}) {
  return request({
    url: '/dictionary/validation',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(validationResponse => {
      const { convertValidationRule } = require('@/utils/ADempiere/apiConverts/dictionary.js')

      return convertValidationRule(validationResponse)
    })
}
