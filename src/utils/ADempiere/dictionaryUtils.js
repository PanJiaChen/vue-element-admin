import evaluator from '@/utils/ADempiere/evaluator'
import { isEmptyValue, parsedValueComponent } from '@/utils/ADempiere/valueUtils'
import { getParentFields, parseContext } from '@/utils/ADempiere/contextUtils'
import REFERENCES, { FIELD_NOT_SHOWED } from '@/components/ADempiere/Field/references'
import { FIELD_DISPLAY_SIZES, DEFAULT_SIZE } from '@/components/ADempiere/Field/fieldSize'
import language from '@/lang'

/**
 * Generate field to app
 * @param {object}  fieldToGenerate
 * @param {object}  moreAttributes, additional attributes
 * @param {boolean} typeRange, indicate if this field is a range used as _To
 */
export function generateField(fieldToGenerate, moreAttributes, typeRange = false) {
  let isShowedFromUser = false
  // verify if it no overwrite value with ...moreAttributes
  if (moreAttributes.isShowedFromUser) {
    isShowedFromUser = moreAttributes.isShowedFromUser
  }

  const componentReference = evalutateTypeField(fieldToGenerate.displayType, true)

  let parsedDefaultValue = fieldToGenerate.defaultValue
  if (String(parsedDefaultValue).includes('@')) {
    if (String(parsedDefaultValue).includes('@SQL=')) {
      parsedDefaultValue.replace('@SQL=', '')
    }
    parsedDefaultValue = parseContext({
      ...moreAttributes,
      columnName: fieldToGenerate.columnName,
      value: parsedDefaultValue
    })
  }
  parsedDefaultValue = parsedValueComponent({
    fieldType: componentReference.type,
    value: parsedDefaultValue,
    referenceType: componentReference.alias[0],
    isMandatory: fieldToGenerate.isMandatory
  })

  let parsedDefaultValueTo = fieldToGenerate.defaultValueTo
  if (String(parsedDefaultValueTo).includes('@')) {
    parsedDefaultValueTo = parseContext({
      ...moreAttributes,
      columnName: fieldToGenerate.columnName,
      value: fieldToGenerate.defaultValueTo
    })
  }
  parsedDefaultValueTo = parsedValueComponent({
    fieldType: componentReference.type,
    value: parsedDefaultValueTo,
    referenceType: componentReference.alias[0],
    isMandatory: fieldToGenerate.isMandatory
  })
  fieldToGenerate.reference.zoomWindowList = fieldToGenerate.reference.windowsList
  const field = {
    ...fieldToGenerate,
    ...moreAttributes,
    // displayed attributes
    componentPath: componentReference.type,
    isSupport: componentReference.support,
    referenceType: componentReference.alias[0],
    displayColumn: undefined, // link to value from selects and table
    // value attributes
    value: String(parsedDefaultValue).trim() === '' ? undefined : parsedDefaultValue,
    oldValue: parsedDefaultValue,
    valueTo: parsedDefaultValueTo,
    parsedDefaultValue: parsedDefaultValue,
    parsedDefaultValueTo: parsedDefaultValueTo,
    // logics to app
    isDisplayedFromLogic: fieldToGenerate.isDisplayed,
    isReadOnlyFromLogic: undefined,
    isMandatoryFromLogic: undefined,
    //
    parentFieldsList: getParentFields(fieldToGenerate),
    dependentFieldsList: [],
    // TODO: Add support on server
    // app attributes
    isShowedFromUser: isShowedFromUser,
    isShowedTableFromUser: fieldToGenerate.isDisplayed,
    isFixedTableColumn: false
  }

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
    console.warn(`Field size no found: ${field.name} type: ${field.componentPath}`)
    field.sizeFieldFromType = {
      type: field.componentPath,
      size: DEFAULT_SIZE
    }
  }

  // Overwrite some values
  if (typeRange) {
    field.uuid = `${field.uuid}_To`
    field.columnName = `${field.columnName}_To`
    field.name = `${field.name} To`
    field.value = parsedDefaultValueTo
    field.defaultValue = field.defaultValueTo
    field.parsedDefaultValue = field.parsedDefaultValueTo
  }

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

/**
 * Generate the actions and the associated process to store in the vuex store,
 * avoiding additional requests
 * @param {object} processToGenerate
 * @returns {object}
 */
export function generateProcess({ processToGenerate, containerUuidAssociated = undefined }) {
  const panelType = processToGenerate.isReport ? 'report' : 'process'
  const additionalAttributes = {
    processUuid: processToGenerate.uuid,
    processId: processToGenerate.id,
    processName: processToGenerate.name,
    containerUuid: processToGenerate.uuid,
    panelType: panelType
  }

  //  Convert from gRPC
  const fieldsRangeList = []
  let fieldDefinitionList = processToGenerate.parametersList
    .map(fieldItem => {
      const field = generateField(fieldItem, additionalAttributes)
      // Add new field if is range number
      if (field.isRange && field.componentPath === 'FieldNumber') {
        const fieldRange = generateField(fieldItem, additionalAttributes, true)
        if (!isEmptyValue(fieldRange.value)) {
          fieldRange.isShowedFromUser = true
        }
        fieldsRangeList.push(fieldRange)
      }

      // if field with value displayed in main panel
      if (!isEmptyValue(field.value)) {
        field.isShowedFromUser = true
      }

      return field
    })
  fieldDefinitionList = fieldDefinitionList.concat(fieldsRangeList)

  //  Get dependent fields
  fieldDefinitionList
    .filter(field => field.parentFieldsList && field.isActive)
    .forEach((field, index, list) => {
      field.parentFieldsList.forEach(parentColumnName => {
        var parentField = list.find(parentField => {
          return parentField.columnName === parentColumnName && parentColumnName !== field.columnName
        })
        if (parentField) {
          parentField.dependentFieldsList.push(field.columnName)
        }
      })
    })

  //  Default Action
  const actions = []
  actions.push({
    name: language.t('components.RunProcess'),
    processName: processToGenerate.name,
    type: 'action',
    action: 'startProcess',
    uuid: processToGenerate.uuid,
    id: processToGenerate.id,
    description: processToGenerate.description,
    isReport: processToGenerate.isReport,
    isDirectPrint: processToGenerate.isDirectPrint,
    reportExportType: undefined
  }, {
    name: language.t('components.ChangeParameters'),
    processName: processToGenerate.name,
    type: 'process',
    action: 'changeParameters',
    uuid: processToGenerate.uuid,
    id: processToGenerate.id,
    description: processToGenerate.description,
    isReport: processToGenerate.isReport,
    isDirectPrint: processToGenerate.isDirectPrint
  })

  const summaryAction = {
    name: language.t('components.RunProcessAs'),
    processName: processToGenerate.name,
    type: 'summary',
    action: '',
    childs: [],
    uuid: processToGenerate.uuid,
    id: processToGenerate.id,
    description: processToGenerate.description,
    isReport: processToGenerate.isReport,
    isDirectPrint: processToGenerate.isDirectPrint
  }
  processToGenerate.reportExportTypeList.forEach(actionValue => {
    //  Push values
    summaryAction.childs.push({
      name: `${language.t('components.ExportTo')} (${actionValue.name})`,
      processName: processToGenerate.name,
      type: 'action',
      action: 'startProcess',
      uuid: processToGenerate.uuid,
      id: processToGenerate.id,
      description: actionValue.description,
      isReport: processToGenerate.isReport,
      isDirectPrint: processToGenerate.isDirectPrint,
      reportExportType: actionValue.reportExportType
    })
  })
  //  Add summary Actions
  actions.push(summaryAction)

  const processDefinition = {
    ...processToGenerate,
    panelType: panelType,
    isAssociated: Boolean(containerUuidAssociated),
    containerUuidAssociated: containerUuidAssociated,
    fieldList: fieldDefinitionList
  }

  return {
    processDefinition: processDefinition,
    actions: actions
  }
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

// Default template for injected fields
export function getFieldTemplate(attributesOverwrite) {
  const referenceValue = {
    tableName: '',
    keyColumnName: '',
    displayColumnName: '',
    query: '',
    parsedQuery: '',
    directQuery: '',
    parsedDirectQuery: '',
    validationCode: '',
    windowsList: [],
    zoomWindowList: []
  }
  const newField = {
    id: 0,
    uuid: '',
    name: '',
    description: '',
    help: '',
    columnName: '',
    fieldGroup: {
      name: '',
      fieldGroupType: ''
    },
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
      if (!isEmptyValue(fieldElement.fieldGroup.name) &&
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
      if (!isEmptyValue(fieldElement.fieldGroup.name)) {
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

// Convert action to action name for route
export function convertAction(action) {
  const actionAttributes = {
    name: '',
    icon: '',
    hidden: false,
    isIndex: false,
    component: () => import('@/views/ADempiere/Unsupported')
  }

  switch (action) {
    case 'B':
      actionAttributes.name = 'Workbech'
      actionAttributes.icon = 'peoples'
      break
    case 'F':
      actionAttributes.name = 'Workflow'
      actionAttributes.icon = 'example'
      break
    case 'P':
      actionAttributes.name = 'Process'
      actionAttributes.icon = 'component'
      actionAttributes.component = () => import('@/views/ADempiere/Process')
      break
    case 'R':
      actionAttributes.name = 'Report'
      actionAttributes.icon = 'skill'
      actionAttributes.component = () => import('@/views/ADempiere/Process')
      break
    case 'S':
      actionAttributes.name = 'Browser'
      actionAttributes.icon = 'search'
      actionAttributes.component = () => import('@/views/ADempiere/Browser')
      break
    case 'T':
      actionAttributes.name = 'Task'
      actionAttributes.icon = 'size'
      break
    case 'W':
      actionAttributes.name = 'Window'
      actionAttributes.icon = 'tab'
      actionAttributes.component = () => import('@/views/ADempiere/Window')
      break
    case 'X':
      actionAttributes.name = 'Form'
      actionAttributes.icon = 'form'
      break
    default:
      actionAttributes.name = 'summary'
      actionAttributes.icon = 'nested'
      // actionAttributes.hidden = true
      actionAttributes.isIndex = true
      actionAttributes.component = () => import('@/views/ADempiere/Summary')
      break
  }
  return actionAttributes
}
