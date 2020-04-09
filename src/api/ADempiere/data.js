import { getLanguage } from '@/lang/index'
import { getToken } from '@/utils/auth'
import BusinessData from '@adempiere/grpc-data-client'
import { BUSINESS_DATA_ADDRESS } from '@/api/ADempiere/constants'

// Get Instance for connection
function Instance() {
  return new BusinessData(
    BUSINESS_DATA_ADDRESS,
    getToken(),
    getLanguage() || 'en_US'
  )
}

/**
 * Create entity
 * @param {string}  parameters.tableName
 * @param {array}   parameters.attributesList
 */
export function createEntity({ tableName, attributesList }) {
  return Instance.call(this).requestCreateEntity({
    tableName,
    attributesList
  })
}

/**
 * Update entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}   attributesList
 */
export function updateEntity({ tableName, recordId, recordUuid, attributesList }) {
  return Instance.call(this).requestUpdateEntity({
    tableName,
    recordId,
    recordUuid,
    attributesList
  })
}

/**
 * Delete entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function deleteEntity({ tableName, recordId, recordUuid }) {
  return Instance.call(this).requestDeleteEntity({
    tableName,
    recordId,
    recordUuid
  })
}

export function getEntity({ tableName, recordId, recordUuid }) {
  return Instance.call(this).requestGetEntity({
    tableName,
    recordId,
    recordUuid
  })
}

/**
 * Object List from window
 * @param {string} tableName
 * @param {string} query
 * @param {string} whereClause
 * @param {array}  conditionsList
 * @param {string} orderByClause
 * @param {string} pageToken
 */
export function getEntitiesList({
  tableName,
  query,
  whereClause,
  conditionsList = [],
  orderByClause,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListEntities({
    tableName,
    query,
    whereClause,
    conditionsList,
    orderByClause,
    pageToken,
    pageSize
  })
}

/**
 * Get all operator or get key value type from value
 * @param {number} keyToFind
		EQUAL = 0;
		NOT_EQUAL = 1;
		LIKE = 2;
		NOT_LIKE = 3;
		GREATER = 4;
		GREATER_EQUAL = 5;
		LESS = 6;
		LESS_EQUAL = 7;
		BETWEEN = 8;
		NOT_NULL = 9;
		NULL = 10;
		IN = 11;
		NOT_IN = 12;
 */
export function getConditionOperators(keyToFind) {
  return Instance.call(this).getConditionOperators(keyToFind)
}

/**
 * Rollback entity (Create, Update, Delete)
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} eventType
 */
export function rollbackEntity({
  tableName,
  recordId,
  eventType
}) {
  return Instance.call(this).requestRollbackEntity({
    tableName,
    recordId,
    eventTypeExecuted: eventType
  })
}

/**
 * Request a Lookup data from Reference
 * The main attributes that function hope are:
 * @param {string} tableName
 * @param {string} directQuery
 * @param {string|number} value
 */
export function getLookup({
  tableName,
  directQuery,
  value
}) {
  return Instance.call(this).requestLookupFromReference({
    tableName,
    directQuery,
    value
  })
}

/**
 * Request a Lookup list data from Reference
 * The main attributes that function hope are:
 * @param {string} tableName
 * @param {string} query
 */
export function getLookupList({
  tableName,
  query,
  valuesList,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListLookupFromReference({
    tableName,
    query,
    valuesList,
    pageToken,
    pageSize
  })
}

/**
 * Request a process
 * This function allows follow structure:
 * @param {string}  uuid, uuid from process to run
 * @param {number}  reportType
 * @param {number}  tableName, table name of tab, used only window
 * @param {number}  recordId, record identifier, used only window
 * @param {array}   parametersList, parameters from process [{ columnName, value }]
 * @param {array}   selectionsList, selection records, used only browser
      [{
          selectionId,
          selectionValues: [{ columnName, value }]
      }]
 * @param {string}  printFormatUuid
 */
export function runProcess({ uuid, reportType, tableName, recordId, parametersList = [], selectionsList = [], printFormatUuid }) {
  //  Run Process
  return Instance.call(this).requestRunProcess({
    uuid,
    reportType,
    tableName,
    recordId,
    parametersList,
    selectionsList,
    printFormatUuid
  })
}

/**
 * Request a browser search
 * @param {string} uuid
 * @param {string} query
 * @param {string} whereClause
 * @param {string} orderByClause
 * @param {string} nextPageToken
 * @param {array}  parametersList, This allows follow structure:
 * [{
 *     columnName,
 *     value
 * }]
 */
export function getBrowserSearch({ uuid, parametersList = [], query, whereClause, orderByClause, nextPageToken: pageToken, pageSize }) {
  //  Run browser
  return Instance.call(this).requestListBrowserSearch({
    uuid,
    parametersList,
    query,
    whereClause,
    orderByClause,
    pageToken,
    pageSize
  })
}

// Request a Process Activity list
export function requestListProcessesLogs({ pageToken, pageSize }) {
  //  Get Process Activity
  return Instance.call(this).requestListProcessesLogs({ pageToken, pageSize })
}

export function getRecentItems({ pageToken, pageSize }) {
  return Instance.call(this).requestListRecentItems({ pageToken, pageSize })
}

/**
 * Reference List from Window
 * @param {string}  tableName
 * @param {string}  windowUuid
 * @param {string}  recordUuid
 * @param {number}  recordId
 */
export function getReferencesList({ windowUuid, tableName, recordId, recordUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListReferences({
    windowUuid,
    tableName,
    recordId,
    recordUuid,
    pageToken,
    pageSize
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
export function runCallOutRequest({ windowUuid, windowNo, tabUuid, tableName, columnName, value, oldValue, valueType, callout, attributesList = [] }) {
  return Instance.call(this).requestRunCallout({
    windowUuid,
    windowNo,
    tabUuid,
    tableName,
    columnName,
    value,
    oldValue,
    valueType,
    callout,
    attributesList
  })
}

export function getDefaultValueFromServer(query) {
  return Instance.call(this).requestGetDefaultValue(query)
}

export function getContextInfoValueFromServer({ uuid, query }) {
  return Instance.call(this).requestGetContextInfoValue({ uuid, query })
}

export function getPrivateAccessFromServer({ tableName, recordId, userUuid }) {
  return Instance.call(this).requestGetPrivateAccess({
    tableName,
    recordId,
    userUuid
  })
}

export function lockPrivateAccessFromServer({ tableName, recordId, userUuid }) {
  return Instance.call(this).requestLockPrivateAccess({
    tableName,
    recordId,
    userUuid
  })
}

export function unlockPrivateAccessFromServer({ tableName, recordId, userUuid }) {
  return Instance.call(this).requestUnlockPrivateAccess({
    tableName,
    recordId,
    userUuid
  })
}

/**
 * Request Favorites List
 * @param {string} userUuid
 */
export function getFavoritesFromServer({ userUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListFavorites({ userUuid, pageToken, pageSize })
}

export function getPendingDocumentsFromServer({ userUuid, roleUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListPendingDocuments({
    userUuid,
    roleUuid,
    pageToken,
    pageSize
  })
}

/**
 * Request Pending Documents List
 * @param {string} tableName
 * @param {string} processUuid
 */
export function requestReportViews({ tableName, processUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListReportViews({
    tableName,
    processUuid,
    pageToken,
    pageSize
  })
}

export function requestPrintFormats({ tableName, reportViewUuid, processUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListPrintFormats({
    tableName,
    reportViewUuid,
    processUuid,
    pageToken,
    pageSize
  })
}

export function requestLisDashboards({ roleUuid, pageToken, pageSize }) {
  return Instance.call(this).requestListDashboards({
    roleUuid,
    pageToken,
    pageSize
  })
}

export function requestLanguages({ pageToken, pageSize }) {
  return Instance.call(this).requestListLanguages({ pageToken, pageSize })
}

/**
 * Request translations
 * @param {string} tableName
 * @param {string} language
 * @param {string} recordUuid
 * @param {integer} recordId
 */
export function requestTranslations({ tableName, language, recordUuid, recordId, pageToken, pageSize }) {
  return Instance.call(this).requestListTranslations({
    tableName,
    recordUuid,
    recordId,
    language,
    pageToken,
    pageSize
  })
}

export function requestDrillTables({ tableName, pageToken, pageSize }) {
  return Instance.call(this).requestListDrillTables({
    tableName,
    pageToken,
    pageSize
  })
}

export function getReportOutput({
  parametersList,
  tableName,
  printFormatUuid,
  reportViewUuid,
  isSummary,
  reportName,
  reportType
}) {
  return Instance.call(this).requestGetReportOutput({
    parametersList,
    tableName,
    printFormatUuid,
    reportViewUuid,
    isSummary,
    reportName,
    reportType
  })
}

export function requestListRecordsLogs({
  tableName,
  recordId,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListRecordsLogs({
    tableName,
    recordId,
    pageToken,
    pageSize
  })
}

export function requestListWorkflowsLogs({
  tableName,
  recordId,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListWorkflowsLogs({
    tableName,
    recordId,
    pageToken,
    pageSize
  })
}

export function requestListWorkflows({
  tableName,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListWorkflows({
    tableName,
    pageToken,
    pageSize
  })
}

/**
 * @param {string}  tableName
 * @param {integer} recordId
 * @param {string}  pageToken
 * @param {string}  pageSize
 */
export function requestListRecordChats({ tableName, recordId, pageToken, pageSize }) {
  return Instance.call(this).requestListRecordChats({
    tableName,
    recordId,
    pageToken,
    pageSize
  })
}

/**
 * @param {string} uuid
 * @param {string} pageToken
 * @param {string} pageSize
 */
export function requestListChatEntries({ uuid, pageToken, pageSize }) {
  return Instance.call(this).requestListChatEntries({
    uuid,
    pageToken,
    pageSize
  })
}

/**
 * @param {string} tableName
 * @param {string} recordId
 * @param {string} comment
 */
export function requestCreateChatEntry({ tableName, recordId, comment }) {
  return Instance.call(this).requestCreateChatEntry({
    tableName,
    recordId,
    comment
  })
}

/**
 * Request Document Actions List
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} recordUuid
 * @param {string} documentStatus
 * @param {string} documentAction
 * @param {number} pageSize
 * @param {string} pageToken
 */
export function requestListDocumentActions({ tableName, recordId, recordUuid, documentStatus, documentAction, pageSize, pageToken }) {
  return Instance.call(this).requestListDocumentActions({
    tableName,
    recordId,
    recordUuid,
    documentStatus,
    documentAction,
    pageSize,
    pageToken
  })
}
/**
 * Request Document Status List
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} recordUuid
 * @param {string} documentStatus
 * @param {string} documentAction
 * @param {number} pageSize
 * @param {string} pageToken
 */
export function requestListDocumentStatuses({ tableName, recordId, recordUuid, documentStatus, documentAction, pageSize, pageToken }) {
  return Instance.call(this).requestListDocumentStatuses({
    tableName,
    recordId,
    recordUuid,
    documentStatus,
    documentAction,
    pageSize,
    pageToken
  })
}
