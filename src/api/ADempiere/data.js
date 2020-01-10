import { getLanguage } from '@/lang/index'
import { getToken } from '@/utils/auth'
import BusinessData from '@adempiere/grpc-data-client'
import { HOST_GRPC_DATA } from '@/api/ADempiere/constants'

// Get Instance for connection
function Instance() {
  return new BusinessData(
    HOST_GRPC_DATA,
    getToken(),
    getLanguage() || 'en_US'
  )
}

/**
 * Converted the gRPC value to the value needed
 * @param {object} grpcValue Value get of gRPC
 * @returns {mixed}
 */
export function convertValueFromGRPC(grpcValue) {
  return Instance.call(this).convertValueFromGRPC(grpcValue)
}

/**
 * Create entity
 * @param {string}  parameters.tableName
 * @param {array}   parameters.attributesList
 */
export function createEntity(parameters) {
  var entityRequest = Instance.call(this).getCreateEntityRequest()
  entityRequest.setTablename(parameters.tableName)
  if (parameters.attributesList && parameters.attributesList.length) {
    parameters.attributesList.forEach(attribute => {
      const convertedAttribute = Instance.call(this).convertParameter(attribute)
      entityRequest.addAttributes(convertedAttribute)
    })
  }
  //  Create Entity
  return Instance.call(this).createEntity(entityRequest)
}

/**
 * Update entity
 * @param {string}  parameters.tableName
 * @param {integer} parameters.recordId
 * @param {string}  parameters.recordUuid
 * @param {array}   parameters.attributesList
 */
export function updateEntity(parameters) {
  var entityRequest = Instance.call(this).getUpdateEntityRequest()
  entityRequest.setTablename(parameters.tableName)
  if (parameters.recordId) {
    entityRequest.setRecordid(parameters.recordId)
  }
  entityRequest.setUuid(parameters.recordUuid)
  if (parameters.attributesList && parameters.attributesList.length) {
    parameters.attributesList.forEach(attribute => {
      const convertedAttribute = Instance.call(this).convertParameter(attribute)
      entityRequest.addAttributes(convertedAttribute)
    })
  }
  //  Update Entity
  return Instance.call(this).updateEntity(entityRequest)
}

/**
 * Delete entity
 * @param {string}  parameters.tableName
 * @param {integer} parameters.recordId
 * @param {string}  parameters.recordUuid
 * @param {array}   parameters.attributesList
 */
export function deleteEntity(parameters) {
  var entityRequest = Instance.call(this).getUpdateEntityRequest()
  entityRequest.setTablename(parameters.tableName)
  if (parameters.recordId) {
    entityRequest.setRecordid(parameters.recordId)
  }
  entityRequest.setUuid(parameters.recordUuid)

  //  Delete Entity
  return Instance.call(this).deleteEntity(entityRequest)
}

export function getCriteria(tableName) {
  return Instance.call(this).getCriteria(tableName)
}

export function getObject(table, uuid = false, id = false) {
  return Instance.call(this).getEntity(
    Instance.call(this).getEntityRequest(table, uuid, id)
  )
}

/**
 * Object List from window
 * @param {string} object.tableName
 * @param {string} object.query
 * @param {string} object.whereClause
 * @param {string} object.orderByClause
 */
export function getObjectListFromCriteria(object) {
  const criteriaForList = getCriteria(object.tableName)

  criteriaForList.setQuery(object.query)

  if (object.whereClause) {
    criteriaForList.setWhereclause(object.whereClause)
  }
  if (object.orderByClause) {
    criteriaForList.setOrderbyclause(object.orderByClause)
  }

  // add conditions
  if (object.conditions && object.conditions.length) {
    object.conditions.forEach(itemCondition => {
      const convertCondition = Instance.call(this).convertCondition(itemCondition)
      criteriaForList.addConditions(convertCondition)
    })
  }

  var nextPageToken
  if (object.nextPageToken) {
    nextPageToken = object.nextPageToken
  }
  return Instance.call(this).requestObjectListFromCriteria(criteriaForList, nextPageToken)
}

/**
 * Rollback entity (Create, Update, Delete)
 * @param {string} parametersRollback.tableName
 * @param {integer} parametersRollback.recordId
 * @param {string} parametersRollback.eventType
 */
export function rollbackEntity(parametersRollback) {
  var rollbackRequest = Instance.call(this).getRollbackEntityRequest()
  rollbackRequest.setTablename(parametersRollback.tableName)
  rollbackRequest.setRecordid(parametersRollback.recordId)

  // set event type
  var eventType = Instance.call(this).getEventType()
  eventType = eventType[parametersRollback.eventType]
  rollbackRequest.setEventtype(eventType)

  return Instance.call(this).rollbackEntityRequest(rollbackRequest)
}

/**
 * Request a Lookup list data from Reference
 * The main attributes that function hope are:
 * @param {string} reference.tableName
 * @param {string} reference.query
 */
export function getLookupList(reference) {
  return Instance.call(this).requestLookupListFromReference(reference)
}

/**
 * Request a Lookup data from Reference
 * The main attributes that function hope are:
 * @param {string} reference.tableName
 * @param {string} reference.directQuery
 * @param {string|number} value
 */
export function getLookup(reference) {
  return Instance.call(this).requestLookupFromReference({
    tableName: reference.tableName,
    directQuery: reference.directQuery
  }, reference.value)
}

/**
 * Request a process
 * This function allows follow structure:
 * @param {object}  process
 * @param {string}  process.uuid, uuid from process to run
 * @param {integer} process.tableName, table name of tab, used only window
 * @param {integer} process.recordId, record identifier, used only window
 * @param {array}   process.parameters, parameters from process
      [ { columnName, value } ]
 * @param {array}   process.selection, selection records, used only browser
      [ {
          selectionId,
          selectionValues [
            { columnName, value }
          ]
      } ]
 */
export function runProcess(process) {
  var processRequest = Instance.call(this).getProcessRequest()
  //  Fill Request process
  processRequest.setUuid(process.uuid)
  // report export type
  if (process.reportType) {
    processRequest.setReporttype(process.reportType)
  }
  // process params
  if (process.parameters && process.parameters.length) {
    process.parameters.forEach(parameter => {
      const convertedParameter = Instance.call(this).convertParameter(parameter)
      processRequest.addParameters(convertedParameter)
    })
  }

  // record in window
  if (process.tableName) {
    processRequest.setTablename(process.tableName)
    processRequest.setRecordid(process.recordId)
  }

  // browser selection list records
  if (process.selection && process.selection.length) {
    process.selection.forEach(record => {
      // selection format = { selectionId: integer, selectionValues: array }
      const convertedRecord = Instance.call(this).convertSelection(record)
      processRequest.addSelections(convertedRecord)
    })
  }

  //  Run Process
  return Instance.call(this).requestProcess(processRequest)
}

/**
 * Request a browser search
 * This function allows follow structure:
 * @param {string} browser.uuid
 * @param {string} browser.query
 * @param {string} browser.whereClause
 * @param {string} browser.orderByClause
 * @param {array}  browser.parameters
 * [{
 *     columnName,
 *     value
 * }]
 */
export function getBrowserSearch(browser) {
  var browserRequest = Instance.call(this).getBrowserRequest()
  var criteria = Instance.call(this).getCriteria('')
  //  Fill Request browser
  browserRequest.setUuid(browser.uuid)
  criteria.setQuery(browser.query)
  criteria.setWhereclause(browser.whereClause)
  criteria.setOrderbyclause(browser.orderByClause)

  if (browser.nextPageToken) {
    browserRequest.setPageToken(browser.nextPageToken)
  }
  browserRequest.setCriteria(criteria)
  /* isQueryCriteria fields parameters */
  if (browser.parameters !== undefined) {
    browser.parameters.forEach(parameter => {
      const convertedParameter = Instance.call(this).convertParameter(parameter)
      browserRequest.addParameters(convertedParameter)
    })
  }
  //  Run browser
  return Instance.call(this).requestBrowser(browserRequest)
}

// Request a Process Activity list
export function requestProcessActivity() {
  //  Get Process Activity
  return Instance.call(this).requestProcessActivity()
}

export function getRecentItems() {
  return Instance.call(this).requestRecentItems()
}
/**
 * forget password
 * @param {string} parameters.forgetPassword
 */
export function getForgetPassword(parameters) {
  return Instance.call(this).requestForgetPassword(parameters)
}

/**
 * Reference List from Window
 * @param {string}  parameters.tableName
 * @param {string}  parameters.windowUuid
 * @param {string}  parameters.recordUuid
 * @param {integer} parameters.recordId
 */
export function getReferencesList(parameters) {
  var requestReference = Instance.call(this).getReferencesRequest()
  requestReference.setWindowuuid(parameters.windowUuid)
  requestReference.setTablename(parameters.tableName)
  requestReference.setUuid(parameters.recordUuid)
  if (parameters.recordId) {
    requestReference.setRecordid(parameters.recordId)
  }

  return Instance.call(this).listReferencesRequest(requestReference)
}

/**
 * Run callout request
 * @param {string}  parametersCallout.windowUuid
 * @param {integer} parametersCallout.windowNo
 * @param {string}  parametersCallout.tabUuid
 * @param {string}  parametersCallout.tableName
 * @param {string}  parametersCallout.columnName
 * @param {mixed}   parametersCallout.value
 * @param {mixed}   parametersCallout.oldValue
 * @param {string}  parametersCallout.callout
 * @param {array}   parametersCallout.attributesList
 * @returns {Map} Entity
 */
export function runCallOutRequest(parametersCallout) {
  return Instance.call(this).runCalloutRequest(parametersCallout)
}

export function getDefaultValueFromServer(query) {
  return Instance.call(this).getDefaultValue(query)
}

export function getContextInfoValueFromServer({ uuid, query }) {
  return Instance.call(this).getContextInfoValue({ uuid: uuid, query: query })
}

export function getPrivateAccessFromServer({ tableName: tableName, recordId: recordId, userUuid: userUuid }) {
  return Instance.call(this).getPrivateAccess({ tableName: tableName, recordId: recordId, userUuid: userUuid })
}

export function lockPrivateAccessFromServer({ tableName: tableName, recordId: recordId, userUuid: userUuid }) {
  return Instance.call(this).lockPrivateAccess({ tableName: tableName, recordId: recordId, userUuid: userUuid })
}

export function unlockPrivateAccessFromServer({ tableName: tableName, recordId: recordId, userUuid: userUuid }) {
  return Instance.call(this).unlockPrivateAccess({ tableName: tableName, recordId: recordId, userUuid: userUuid })
}

export function getFavoritesFromServer(userUuid) {
  return Instance.call(this).requestFavorites(userUuid)
}

export function getPendingDocumentsFromServer(userUuid, roleUuid) {
  return Instance.call(this).requestPendingDocuments(userUuid, roleUuid)
}

export function requestReportViews({ tableName, processUuid }) {
  return Instance.call(this).requestReportViews({ tableName: tableName, processUuid: processUuid })
}

export function requestPrintFormats({ tableName, reportViewUuid, processUuid }) {
  return Instance.call(this).requestPrintFormats({ tableName: tableName, reportViewUuid: reportViewUuid, processUuid: processUuid })
}

export function requestDrillTables(tableName) {
  return Instance.call(this).requestDrillTables(tableName)
}

export function getReportOutput({
  criteria: criteria,
  printFormatUuid: printFormatUuid,
  reportViewUuid: reportViewUuid,
  isSummary: isSummary,
  reportName: reportName,
  reportType: reportType,
  tableName: tableName
}) {
  const criteriaForReport = getCriteria(tableName)
  if (criteria && criteria.length) {
    criteria.forEach(parameter => {
      var isAddCodition = true
      if (parameter.isRange && criteria.some(param => param.columnName === `${parameter.columnName}_To`)) {
        parameter.valueTo = criteria.find(param => param.columnName === `${parameter.columnName}_To`).value
      }
      const convertedParameter = Instance.call(this).convertCondition(parameter)
      if (parameter.isRange && !parameter.hasOwnProperty('valueTo')) {
        isAddCodition = false
      }
      if (isAddCodition) {
        criteriaForReport.addConditions(convertedParameter)
      }
    })
  }
  return Instance.call(this).getReportOutput({ criteria: criteriaForReport, printFormatUuid: printFormatUuid, reportViewUuid: reportViewUuid, isSummary: isSummary, reportName: reportName, reportType: reportType })
}
