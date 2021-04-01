// Get Instance for connection
import request from '@/utils/request'
import { config } from '@/utils/ADempiere/config'

import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * Request a Lookup data from Reference
 * The main attributes that function hope are:
 * @param {string} tableName
 * @param {string} directQuery
 * @param {string|number} value
 */
export function requestLookup({
  tableName,
  directQuery,
  value
}) {
  let filters = []
  if (!isEmptyValue(value)) {
    filters = [{
      value
    }]
  }
  return request({
    baseURL: config.adempiere.api.url,
    url: '/ui/get-lookup-item',
    method: 'post',
    data: {
      table_name: tableName,
      query: directQuery,
      filters
    }
  })
    .then(respose => {
      return respose
    })
}

/**
 * Request a Lookup list data from Reference
 * The main attributes that function hope are:
 * @param {string} tableName
 * @param {string} query
 * @param {string} whereClause
 * @param {array}  valuesList // TODO: Add support
 * @param {string} pageToken
 * @param {number} pageSize
 */
export function requestLookupList({
  tableName,
  query,
  whereClause,
  columnName,
  valuesList = [],
  pageToken,
  pageSize
}) {
  let filters = []
  if (!isEmptyValue(valuesList)) {
    filters = [{
      column_name: columnName,
      values: valuesList
    }]
  }

  return request({
    baseURL: config.adempiere.api.url,
    url: '/ui/list-lookup-items',
    method: 'post',
    data: {
      table_name: tableName,
      query,
      where_clause: whereClause,
      filters
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(lookupListResponse => {
      return {
        nextPageToken: lookupListResponse.next_page_token,
        recordCount: lookupListResponse.record_count,
        recordsList: lookupListResponse.records
      }
    })
}

/**
 * Reference List from Window
 * @param {string}  tableName
 * @param {string}  windowUuid
 * @param {string}  recordUuid
 * @param {number}  recordId
 */
export function requestReferencesList({
  windowUuid,
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    baseURL: config.adempiere.api.url,
    url: '/ui/list-references',
    method: 'post',
    data: {
      id: recordId,
      uuid: recordUuid,
      window_uuid: windowUuid,
      table_name: tableName
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(referencesListResposnse => {
      const { convertReferencesList } = require('@/utils/ADempiere/apiConverts/values.js')

      return convertReferencesList(referencesListResposnse)
    })
}

// Get default value for a field
export function requestDefaultValue(query) {
  return request({
    baseURL: config.adempiere.api.url,
    url: '/ui/get-default-value',
    method: 'post',
    data: {
      query
    }
  })
    .then(respose => {
      return respose
    })
}

/**
 * Get context information for a window, tab or field
 * @param {string} query
 * @param {string} uuid
 * @param {number} id
 */
export function requestGetContextInfoValue({
  uuid,
  id,
  query
}) {
  return request({
    baseURL: config.adempiere.api.url,
    url: '/ui/get-context-info-value',
    method: 'post',
    data: {
      query,
      uuid,
      id
    }
  })
    .then(contextInfoValueResponse => {
      return {
        messageText: contextInfoValueResponse.message_text,
        messageTip: contextInfoValueResponse.message_tip
      }
    })
}
