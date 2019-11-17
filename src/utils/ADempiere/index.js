import REFERENCES, { FIELD_NOT_SHOWED } from '@/components/ADempiere/Field/references'
import { FIELD_DISPLAY_SIZES, DEFAULT_SIZE } from '@/components/ADempiere/Field/fieldSize'
import evaluator from '@/utils/ADempiere/evaluator.js'
import * as valueUtil from '@/utils/ADempiere/valueUtil.js'

/**
 * Determinate if field is displayed
 * @param {boolean} field.isActive
 * @param {boolean} field.isDisplayed
 * @param {boolean} field.isDisplayedFromLogic
 * @param {boolean} field.isQueryCriteria
 * @param {string}  field.panelType
 * @returns {boolean}
 */
export function fieldIsDisplayed(field) {
  // if is Advanced Query
  if (field.panelType === 'table') {
    return field.isDisplayed && field.isDisplayedFromLogic
  }
  const isBrowserDisplayed = field.isQueryCriteria // browser query criteria
  const isWindowDisplayed = field.isDisplayed && field.isDisplayedFromLogic // window, process and report, browser result
  const isDisplayedView = (field.panelType === 'browser' && isBrowserDisplayed) || (field.panelType !== 'browser' && isWindowDisplayed)

  //  Verify for displayed and is active
  return field.isActive && isDisplayedView
}

/**
 * Converted gRPC attributes to object
 * @param {object}  fieldGRPC
 * @param {object}  moreAttributes, additional attributes
 * @param {boolean} typeRange, indicate if this field is a range used as _To
 */
export function convertField(fieldGRPC, moreAttributes = {}, typeRange = false) {
  var group = {}
  var isShowedFromUser = false
  // verify if it no overwrite value with ...moreAttributes
  if (moreAttributes.isShowedFromUser) {
    isShowedFromUser = moreAttributes.isShowedFromUser
  }

  try {
    group = {
      name: fieldGRPC.getFieldgroup().getName(),
      fieldGroupType: fieldGRPC.getFieldgroup().getFieldgrouptype()
    }
  } catch (e) {
    group = {
      name: '',
      fieldGroupType: ''
    }
  }

  var reference = fieldGRPC.getReference()
  var zoomWindowList = []
  var referenceValue = {
    tableName: '',
    keyColumnName: '',
    displayColumnName: '',
    query: '',
    parsedQuery: '',
    directQuery: '',
    parsedDirectQuery: '',
    validationCode: '',
    zoomWindowList: zoomWindowList
  }
  if (reference) {
    if (reference.getWindowsList()) {
      zoomWindowList = reference.getWindowsList().map(zoomWindow => {
        return {
          id: zoomWindow.getId(),
          uuid: zoomWindow.getUuid(),
          name: zoomWindow.getName(),
          description: zoomWindow.getDescription(),
          isSOTrx: zoomWindow.getIssotrx(),
          isActive: zoomWindow.getIsactive()
        }
      })
    }
    referenceValue = {
      tableName: reference.getTablename(),
      keyColumnName: reference.getKeycolumnname(),
      displayColumnName: reference.getDisplaycolumnname(),
      query: reference.getQuery(),
      parsedQuery: reference.getQuery(),
      directQuery: reference.getDirectquery(),
      parsedDirectQuery: reference.getDirectquery(),
      validationCode: reference.getValidationcode(),
      zoomWindowList: zoomWindowList
    }
  }

  var componentReference = evalutateTypeField(fieldGRPC.getDisplaytype(), true)

  var parsedDefaultValue = fieldGRPC.getDefaultvalue()
  if (String(parsedDefaultValue).includes('@')) {
    if (String(parsedDefaultValue).includes('@SQL=')) {
      parsedDefaultValue.replace('@SQL=', '')
    }
    parsedDefaultValue = parseContext({
      ...moreAttributes,
      columnName: fieldGRPC.getColumnname(),
      value: parsedDefaultValue
    })
  }
  parsedDefaultValue = parsedValueComponent({
    fieldType: componentReference.type,
    value: parsedDefaultValue,
    referenceType: componentReference.alias[0],
    isMandatory: fieldGRPC.getIsmandatory()
  })

  var parsedDefaultValueTo = fieldGRPC.getDefaultvalueto()
  if (String(parsedDefaultValueTo).includes('@')) {
    parsedDefaultValueTo = parseContext({
      ...moreAttributes,
      columnName: fieldGRPC.getColumnname(),
      value: fieldGRPC.getDefaultvalueto()
    })
  }
  parsedDefaultValueTo = parsedValueComponent({
    fieldType: componentReference.type,
    value: parsedDefaultValueTo,
    referenceType: componentReference.alias[0],
    isMandatory: fieldGRPC.getIsmandatory()
  })

  var field = {
    ...moreAttributes,
    // base attributes
    id: fieldGRPC.getId(),
    uuid: fieldGRPC.getUuid(),
    name: fieldGRPC.getName(),
    description: fieldGRPC.getDescription(),
    help: fieldGRPC.getHelp(),
    columnName: fieldGRPC.getColumnname(),
    isActive: fieldGRPC.getIsactive(),
    // displayed attributes
    fieldGroup: group,
    displayType: fieldGRPC.getDisplaytype(),
    componentPath: componentReference.type,
    isSupport: componentReference.support,
    referenceType: componentReference.alias[0],
    isFieldOnly: fieldGRPC.getIsfieldonly(),
    isRange: fieldGRPC.getIsrange(),
    isSameLine: fieldGRPC.getIssameline(),
    isEncrypted: fieldGRPC.getIsencrypted(), // passswords fields
    sequence: fieldGRPC.getSequence(),
    seqNoGrid: fieldGRPC.getSeqnogrid(),
    displayColumn: undefined, // link to value from selects and table
    // value attributes
    formatPattern: fieldGRPC.getFormatpattern(),
    VFormat: fieldGRPC.getVformat(),
    value: String(parsedDefaultValue).trim() === '' ? undefined : parsedDefaultValue,
    defaultValue: fieldGRPC.getDefaultvalue(),
    oldValue: parsedDefaultValue,
    valueTo: parsedDefaultValueTo,
    parsedDefaultValue: parsedDefaultValue,
    defaultValueTo: fieldGRPC.getDefaultvalueto(),
    parsedDefaultValueTo: parsedDefaultValueTo,
    fieldLength: fieldGRPC.getFieldlength(),
    valueMin: fieldGRPC.getValuemin(),
    valueMax: fieldGRPC.getValuemax(),
    //
    isIdentifier: fieldGRPC.getIsidentifier(),
    isParent: fieldGRPC.getIsparent(),
    isKey: fieldGRPC.getIskey(),
    isSelectionColumn: fieldGRPC.getIsselectioncolumn(),
    isUpdateable: fieldGRPC.getIsupdateable(),
    isAlwaysUpdateable: fieldGRPC.getIsalwaysupdateable(),
    //
    isDisplayed: fieldGRPC.getIsdisplayed(),
    isMandatory: fieldGRPC.getIsmandatory(),
    isReadOnly: fieldGRPC.getIsreadonly(),
    isDisplayedFromLogic: fieldGRPC.getIsdisplayed(),
    isReadOnlyFromLogic: undefined,
    isMandatoryFromLogic: undefined,
    // browser attributes
    isQueryCriteria: fieldGRPC.getIsquerycriteria(),
    isInfoOnly: fieldGRPC.getIsinfoonly(),
    //
    callout: fieldGRPC.getCallout(),
    displayLogic: fieldGRPC.getDisplaylogic(),
    mandatoryLogic: fieldGRPC.getMandatorylogic(),
    readOnlyLogic: fieldGRPC.getReadonlylogic(),
    parentFieldsList: getParentFields(fieldGRPC),
    dependentFieldsList: [],
    reference: referenceValue,
    contextInfo: convertContextInfoFromGRPC(
      fieldGRPC.getContextinfo()
    ),
    // TODO: Add support on server
    // app attributes
    isShowedFromUser: isShowedFromUser,
    isFixedTableColumn: false
  }
  field.isShowedTableFromUser = field.isDisplayed && field.isDisplayedFromLogic

  // evaluate simple logics without context
  if (field.displayLogic.trim() !== '' && !field.displayLogic.includes('@')) {
    field.isDisplayedFromLogic = evaluator.evaluateLogic({
      type: 'displayed',
      logic: field.displayLogic
    })
  }
  if (field.mandatoryLogic.trim() !== '' && !field.mandatoryLogic.includes('@')) {
    field.isMandatoryFromLogic = evaluator.evaluateLogic({
      logic: field.mandatoryLogic
    })
  }
  if (field.readOnlyLogic.trim() !== '' && !field.readOnlyLogic.includes('@')) {
    field.isReadOnlyFromLogic = evaluator.evaluateLogic({
      logic: field.readOnlyLogic
    })
  }

  // Sizes from panel and groups
  field.sizeFieldFromType = FIELD_DISPLAY_SIZES.find(item => {
    return item.type === field.componentPath
  })
  if (field.sizeFieldFromType === undefined) {
    console.warn('Field size no found:', field.name, 'type:', field.componentPath)
    field.sizeFieldFromType = {
      type: field.componentPath,
      size: DEFAULT_SIZE
    }
  }

  // Overwrite some values
  if (typeRange) {
    field.uuid = field.uuid + '_To'
    field.columnName = field.columnName + '_To'
    field.name = field.name + ' To'
    field.value = parsedDefaultValueTo
    field.defaultValue = field.defaultValueTo
    field.parsedDefaultValue = field.parsedDefaultValueTo
  }
  // field.value = field.value === undefined ? null : field.value

  // hidden field type button
  const notShowedField = FIELD_NOT_SHOWED.find(itemField => {
    if (field.displayType === itemField.id) {
      return true
    }
  })
  if (notShowedField) {
    field.isDisplayedFromLogic = false
    field.isDisplayed = false
  }

  return field
}

// Default template for injected fields
export function getFieldTemplate(attributesOverwrite) {
  var group = {
    name: '',
    fieldGroupType: ''
  }
  var zoomWindowList = []
  var referenceValue = {
    tableName: '',
    keyColumnName: '',
    displayColumnName: '',
    query: '',
    parsedQuery: '',
    directQuery: '',
    parsedDirectQuery: '',
    validationCode: '',
    zoomWindowList: zoomWindowList
  }
  var newField = {
    id: 0,
    uuid: '',
    name: '',
    description: '',
    help: '',
    columnName: '',
    fieldGroup: group,
    displayType: 10,
    componentPath: 'FieldButton',
    referenceType: 'Button',
    isFieldOnly: false,
    isRange: false,
    isSameLine: false,
    sequence: 0,
    seqNoGrid: 0,
    isIdentifier: 0,
    isKey: false,
    isSelectionColumn: false,
    isUpdateable: true,
    formatPattern: undefined,
    VFormat: undefined,
    value: undefined,
    valueTo: undefined,
    defaultValue: undefined,
    parsedDefaultValue: undefined,
    defaultValueTo: undefined,
    parsedDefaultValueTo: undefined,
    valueMin: undefined,
    valueMax: undefined,
    //
    isDisplayed: false,
    isActive: true,
    isMandatory: false,
    isReadOnly: false,
    isDisplayedFromLogic: false,
    isReadOnlyFromLogic: false,
    isMandatoryFromLogic: false,
    // browser attributes
    callout: undefined,
    isQueryCriteria: false,
    displayLogic: undefined,
    mandatoryLogic: undefined,
    readOnlyLogic: undefined,
    parentFieldsList: undefined,
    dependentFieldsList: [],
    reference: referenceValue,
    contextInfo: undefined,
    isShowedFromUser: false,
    isFixedTableColumn: false,
    sizeFieldFromType: {
      type: 'Button',
      size: DEFAULT_SIZE
    }
  }
  return Object.assign(newField, attributesOverwrite)
}

/**
 * Evaluate by the ID and name of the reference to call the component type
 * @param {integer} displayTypeId, received from data
 * @param {boolean} isAllInfo
 * @return string type, assigned value to folder after evaluating the parameter
 */
export function evalutateTypeField(displayTypeId, isAllInfo = false) {
  var component = REFERENCES.find(reference => displayTypeId === reference.id)
  if (isAllInfo) {
    return component
  }
  return component.type
}

export function getParentFields(fieldGRPC) {
  var parentFields = []
  //  For Display logic
  if (fieldGRPC.getDisplaylogic()) {
    parentFields = Array.from(new Set([
      ...parentFields,
      ...evaluator.parseDepends(fieldGRPC.getDisplaylogic())
    ]))
  }
  //  For Mandatory Logic
  if (fieldGRPC.getMandatorylogic()) {
    parentFields = Array.from(new Set([
      ...parentFields,
      ...evaluator.parseDepends(fieldGRPC.getMandatorylogic())
    ]))
  }
  //  For Read Only Logic
  if (fieldGRPC.getReadonlylogic()) {
    parentFields = Array.from(new Set([
      ...parentFields,
      ...evaluator.parseDepends(fieldGRPC.getReadonlylogic())
    ]))
  }
  //  For Default Value
  if (fieldGRPC.getDefaultvalue()) {
    parentFields = Array.from(new Set([
      ...parentFields,
      ...evaluator.parseDepends(fieldGRPC.getDefaultvalue())
    ]))
  }
  return parentFields
}

/**
 * Parse Context String
 * @param {object} context
 *  - value: (REQUIRED) String to parsing
 *  - parentUuid: (REQUIRED from Window) UUID Window
 *  - containerUuid: (REQUIRED) UUID Tab, Process, SmartBrowser, Report and Form
 *  - columnName: (Optional if exists in value) Column name to search in context
 * @param {boolean} isBoolToString, convert boolean values to string
 */
export function parseContext(context, isBoolToString = false) {
  const store = require('@/store')
  var value = String(context.value)
  var valueSQL = {}
  if (valueUtil.isEmptyValue(value)) { return '' }
  if (value.includes('@SQL=')) {
    value = value.replace('@SQL=', '')
  }
  // var instances = value.length - value.replace('@', '').length
  // if ((instances > 0) && (instances % 2) !== 0) { // could be an email address
  //   return value
  // }

  var token
  var inStr = value
  var outStr = ''

  var i = inStr.indexOf('@')

  while (i !== -1) {
    outStr = outStr + inStr.substring(0, i) // up to @
    inStr = inStr.substring(i + 1, inStr.length)	// from first @
    var j = inStr.indexOf('@') // next @
    if (j < 0) {
      console.log('No second tag: ' + inStr)
      return ''	//	no second tag
    }

    token = inStr.substring(0, j)
    context.columnName = token

    var ctxInfo = store.default.getters.getContext(context)	// get context
    if (isBoolToString && typeof ctxInfo === 'boolean') {
      if (ctxInfo) {
        ctxInfo = 'Y'
      } else {
        ctxInfo = 'N'
      }
    }

    if ((ctxInfo === undefined || ctxInfo.length === 0) && (token.startsWith('#') || token.startsWith('$'))) {
      context.parentUuid = undefined
      context.containerUuid = undefined
      ctxInfo = store.default.getters.getContext(context)	// get global context
    }
    if (ctxInfo === undefined || ctxInfo.length === 0) {
      console.info('No Context for: ' + token)
    } else {
      if (typeof ctxInfo === 'object') {
        outStr = ctxInfo
      } else {
        outStr = outStr + ctxInfo // replace context with Context
      }
    }

    inStr = inStr.substring(j + 1, inStr.length)	// from second @
    i = inStr.indexOf('@')
  }
  if (typeof ctxInfo !== 'object') {
    outStr = outStr + inStr	// add the rest of the string
  }
  if (context.isSQL) {
    valueSQL['query'] = outStr
    valueSQL['value'] = ctxInfo
    return valueSQL
  }
  return outStr
}	//	parseContext

export function convertRoleFromGRPC(roleGRPC) {
  return {
    id: roleGRPC.getId(),
    uuid: roleGRPC.getUuid(),
    name: roleGRPC.getName(),
    desctiption: roleGRPC.getDescription(),
    clientId: roleGRPC.getClientid(),
    clientName: roleGRPC.getClientname(),
    organizationsList: roleGRPC.getOrganizationsList()
  }
}

export function convertContextInfoFromGRPC(contextInfoGRPC) {
  var contextInfo = {
    id: '',
    uuid: '',
    name: '',
    description: '',
    sqlStatement: '',
    isActive: false,
    messageText: convertMessageTextFromGRPC(undefined)
  }
  if (contextInfoGRPC !== undefined) {
    contextInfo = {
      id: contextInfoGRPC.getId(),
      uuid: contextInfoGRPC.getUuid(),
      name: contextInfoGRPC.getName(),
      description: contextInfoGRPC.getDescription(),
      sqlStatement: contextInfoGRPC.getSqlstatement(),
      isActive: contextInfoGRPC.getIsactive(),
      messageText: convertMessageTextFromGRPC(
        contextInfoGRPC.getMessagetext()
      )
    }
  }
  return contextInfo
}

export function convertMessageTextFromGRPC(messageTextGRPC) {
  var messageText = {
    id: '',
    uuid: '',
    value: '',
    msgType: '',
    msgText: '',
    msgTip: '',
    isActive: false
  }
  if (messageTextGRPC !== undefined) {
    messageText = {
      id: messageTextGRPC.getId(),
      // uuid: messageText.getUuid(),
      value: messageTextGRPC.getValue(),
      msgType: messageTextGRPC.getMsgtype(),
      msgText: messageTextGRPC.getMsgtext(),
      msgTip: messageTextGRPC.getMsgtip(),
      isActive: messageTextGRPC.getIsactive()
    }
  }
  return messageText
}

/**
 * [assignedGroup]
 * @param  {array} fieldList Field of List with
 * @return {array} fieldList
 */
export function assignedGroup(fieldList, assignedGroup) {
  if (fieldList === undefined || fieldList.length <= 0) {
    return fieldList
  }
  fieldList = sortFields(fieldList, 'sequence', 'asc', fieldList[0].panelType)

  let firstChangeGroup = false
  let currentGroup = ''
  let typeGroup = ''

  fieldList.forEach(fieldElement => {
    if (fieldElement.panelType !== 'window') {
      fieldElement.groupAssigned = ''
      fieldElement.typeGroupAssigned = ''
      return
    }

    // change the first field group, change the band
    if (!firstChangeGroup) {
      if (!valueUtil.isEmptyValue(fieldElement.fieldGroup.name) &&
        currentGroup !== fieldElement.fieldGroup.name &&
        fieldElement.isDisplayed) {
        firstChangeGroup = true
      }
    }
    //  if you change the field group for the first time and it is different
    //  from 0, updates the field group, since it is another field group and
    //  assigns the following field items to the current field group whose
    //  field group is '' or null
    if (firstChangeGroup) {
      if (!valueUtil.isEmptyValue(fieldElement.fieldGroup.name)) {
        currentGroup = fieldElement.fieldGroup.name
        typeGroup = fieldElement.fieldGroup.fieldGroupType
      }
    }

    fieldElement.groupAssigned = currentGroup
    fieldElement.typeGroupAssigned = typeGroup

    if (assignedGroup !== undefined) {
      fieldElement.groupAssigned = assignedGroup
    }
  })

  return fieldList
}

/**
 * Order the fields, then assign the groups to each field, and finally group
 * in an array according to each field group to show in panel (or table).
 * @param {array} arr
 * @param {string} orderBy
 * @param {string} type
 * @param {string} panelType
 * @returns {array}
 */
export function sortFields(arr, orderBy = 'sequence', type = 'asc', panelType = 'window') {
  if (panelType === 'browser') {
    orderBy = 'seqNoGrid'
  }
  arr.sort((itemA, itemB) => {
    return itemA[orderBy] - itemB[orderBy]
    // return itemA[orderBy] > itemB[orderBy]
  })
  if (type.toLowerCase() === 'desc') {
    return arr.reverse()
  }
  return arr
}

export function parsedValueComponent({ fieldType, value, referenceType, isMandatory = false }) {
  if (value === undefined || value === null) {
    return undefined
  }
  var returnValue

  switch (fieldType) {
    // data type Number
    case 'FieldNumber':
      if (String(value).trim() === '') {
        returnValue = undefined
        if (isMandatory) {
          returnValue = 0
        }
      } else if (typeof value === 'object' && value.hasOwnProperty('query')) {
        returnValue = value
      } else {
        returnValue = Number(value)
      }
      break

    // data type Boolean
    case 'FieldYesNo':
      if (value === 'false' || value === 'N') {
        value = false
      } else if (typeof value === 'object' && value.hasOwnProperty('query')) {
        returnValue = value
      }
      returnValue = Boolean(value)
      break

    // data type String
    case 'FieldText':
    case 'FieldTextArea':
      if (typeof value === 'object' && value.hasOwnProperty('query')) {
        returnValue = value
      }
      returnValue = String(value)
      break

    // data type Date
    case 'FieldDate':
    case 'FieldTime ':
      if (String(value).trim() === '') {
        value = undefined
      }
      if (!isNaN(value)) {
        value = Number(value)
      }
      if (typeof value === 'number') {
        value = new Date(value)
      }
      if (typeof value === 'object' && value.hasOwnProperty('query')) {
        returnValue = value
      }
      returnValue = value
      break

    case 'FieldSelect':
      if (String(value).trim() === '') {
        value = undefined
      }
      if (referenceType === 'TableDirect') {
        if (value !== '' && value !== null && value !== undefined) {
          value = Number(value)
        }
      } // Search or List
      returnValue = value
      break

    default:
      returnValue = value
      break
  }
  return returnValue
}
export function convertAction(action) {
  var actionAttributes = {
    name: '',
    icon: '',
    hidden: false,
    isIndex: false
  }
  switch (action) {
    case 'B':
      actionAttributes.name = 'Workbench'
      actionAttributes.icon = 'peoples'
      break
    case 'F':
      actionAttributes.name = 'Workflow'
      actionAttributes.icon = 'example'
      break
    case 'P':
      actionAttributes.name = 'Process'
      actionAttributes.icon = 'component'
      break
    case 'R':
      actionAttributes.name = 'Report'
      actionAttributes.icon = 'skill'
      break
    case 'S':
      actionAttributes.name = 'SmartBrowser'
      actionAttributes.icon = 'search'
      break
    case 'T':
      actionAttributes.name = 'Task'
      actionAttributes.icon = 'size'
      break
    case 'W':
      actionAttributes.name = 'Window'
      actionAttributes.icon = 'tab'
      break
    case 'X':
      actionAttributes.name = 'Form'
      actionAttributes.icon = 'form'

      break
    default:
      actionAttributes.name = 'summary'
      actionAttributes.icon = 'nested'
      actionAttributes.isIndex = true
      break
  }
  return actionAttributes
}
export default evaluator // from '@/utils/ADempiere/evaluator.js'
export * from '@/utils/ADempiere/auth.js'
export * from '@/utils/ADempiere/notification.js'
export * from '@/utils/ADempiere/valueUtil.js'
