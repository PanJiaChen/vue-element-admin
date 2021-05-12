// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

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
    url: '/user-interface/window/lookup-item',
    method: 'get',
    params: {
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
    url: '/user-interface/window/lookup-items',
    method: 'get',
    params: {
      table_name: tableName,
      query,
      where_clause: whereClause,
      filters,
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
    url: '/user-interface/window/references',
    method: 'get',
    params: {
      id: recordId,
      uuid: recordUuid,
      window_uuid: windowUuid,
      table_name: tableName,
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
    url: '/user-interface/window/default-value',
    method: 'get',
    params: {
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
    url: '/user-interface/window/context-info-value',
    method: 'get',
    params: {
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

/**
 * Run callout request
 * @param {string}  windowUuid
 * @param {number}  windowNo
 * @param {string}  tabUuid
 * @param {string}  tableName
 * @param {string}  columnName
 * @param {mixed}   value
 * @param {mixed}   oldValue
 * @param {string}  callout
 * @param {array}   attributesList
 * @returns {Map} Entity
 */
export function runCallOutRequest({
  windowUuid,
  windowNo,
  tabUuid,
  tableName,
  columnName,
  value,
  oldValue,
  callout,
  attributesList = []
}) {
  return request({
    url: '/user-interface/window/run-callout',
    method: 'post',
    data: {
      table_name: tableName,
      window_uuid: windowUuid,
      tab_uuid: tabUuid,
      callout,
      column_name: columnName,
      old_value: oldValue,
      value,
      window_no: windowNo,
      attributes: attributesList
    }
  })
    .then(response => {
      return response
    })
}

// Get list of log for a records
export function requestListEntityLogs({
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/entity-logs',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(entityLogsListResponse => {
      const { convertEntityLog } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: entityLogsListResponse.next_page_token,
        recordCount: entityLogsListResponse.record_count,
        entityLogsList: entityLogsListResponse.records.map(entityLog => {
          return convertEntityLog(entityLog)
        })
      }
    })
}

// Get workflow log for a record
export function requestListWorkflowsLogs({
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/workflow-logs',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(workflowLogsListResponse => {
      const { convertWorkflowProcess } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: workflowLogsListResponse.next_page_token,
        recordCount: workflowLogsListResponse.record_count,
        workflowLogsList: workflowLogsListResponse.records.map(workflowLog => {
          return convertWorkflowProcess(workflowLog)
        })
      }
    })
}

// Get workflow list for a document
export function requestListWorkflows({
  tableName,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/workflow-logs',
    method: 'get',
    params: {
      table_name: tableName,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(workflowListResponse => {
      const { convertWorkflowDefinition } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: workflowListResponse.next_page_token,
        recordCount: workflowListResponse.record_count,
        workflowsList: workflowListResponse.records.map(workflowDefinition => {
          return convertWorkflowDefinition(workflowDefinition)
        })
      }
    })
}

/**
 * @param {string}  tableName
 * @param {integer} recordId
 * @param {string}  pageToken
 * @param {string}  pageSize
 */
export function requestListEntityChats({
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/entity-chats',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(entityChatListResponse => {
      const { convertEntityChat } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: entityChatListResponse.next_page_token,
        recordCount: entityChatListResponse.record_count,
        entityChatsList: entityChatListResponse.records.map(entityChat => {
          return convertEntityChat(entityChat)
        })
      }
    })
}

/**
 * @param {string} uuid
 * @param {string} pageToken
 * @param {string} pageSize
 */
export function requestListChatsEntries({
  id,
  uuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/chat-entries',
    method: 'get',
    params: {
      id,
      uuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(chatEntriesListResponse => {
      const { convertChatEntry } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: chatEntriesListResponse.next_page_token,
        recordCount: chatEntriesListResponse.record_count,
        chatEntriesList: chatEntriesListResponse.records.map(chatEntry => {
          return convertChatEntry(chatEntry)
        })
      }
    })
}

/**
 * @param {string} tableName
 * @param {string} recordId
 * @param {string} recordUuid
 * @param {string} comment
 */
export function requestCreateChatEntry({
  tableName,
  recordId,
  recordUuid,
  comment
}) {
  return request({
    url: '/user-interface/component/notes/create-chat-entry',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      comment: comment
    }
  })
    .then(chatEntryResponse => {
      const { convertChatEntry } = require('@/utils/ADempiere/apiConverts/window.js')

      return convertChatEntry(chatEntryResponse)
    })
}
