// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/api/ADempiere/instances.js'

/**
 * Request dictionary Window metadata
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestWindowMetadata({
  uuid,
  id
}) {
  return requestRest({
    url: '/dictionary/window',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/dictionary/process',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/dictionary/browser',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/dictionary/form',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
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
    .then(evaluateResponse)
    .then(fieldResponse => {
      const { convertField } = require('@/utils/ADempiere/apiConverts/field.js')

      return convertField(fieldResponse)
    })
}

export function requestReference({
  uuid,
  columnName
}) {
  return requestRest({
    url: '/dictionary/reference',
    method: 'get',
    params: {
      uuid,
      column_name: columnName
    }
  })
    .then(evaluateResponse)
    .then(validationResponse => {
      const { convertReference } = require('@/utils/ADempiere/apiConverts/field.js')

      return convertReference(validationResponse)
    })
}

export function requestValidationRule({
  uuid,
  id
}) {
  return requestRest({
    url: '/dictionary/validation',
    method: 'get',
    params: {
      uuid,
      id
    }
  })
    .then(evaluateResponse)
    .then(validationResponse => {
      const { convertValidationRule } = require('@/utils/ADempiere/apiConverts/dictionary.js')

      return convertValidationRule(validationResponse)
    })
}
