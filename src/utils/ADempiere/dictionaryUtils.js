import evaluator from '@/utils/ADempiere/evaluator'
import { isEmptyValue, parsedValueComponent } from '@/utils/ADempiere/valueUtils'
import { getContext, getParentFields, getPreference, parseContext } from '@/utils/ADempiere/contextUtils'
import REFERENCES, { FIELD_NOT_SHOWED } from '@/utils/ADempiere/references'
import { FIELD_DISPLAY_SIZES, DEFAULT_SIZE } from '@/components/ADempiere/Field/fieldSize'
import language from '@/lang'

/**
 * Generate field to app
 * @param {object}  fieldToGenerate
 * @param {object}  moreAttributes, additional attributes
 * @param {boolean} typeRange, indicate if this field is a range used as _To
 */
export function generateField({
  fieldToGenerate,
  moreAttributes,
  typeRange = false,
  isSOTrxMenu
}) {
  let isShowedFromUser = false
  let isSQLValue = false
  // verify if it no overwrite value with ...moreAttributes
  if (moreAttributes.isShowedFromUser) {
    isShowedFromUser = moreAttributes.isShowedFromUser
  }

  const componentReference = evalutateTypeField(fieldToGenerate.displayType, true)
  const referenceType = componentReference.alias[0]
  let isDisplayedFromLogic = fieldToGenerate.isDisplayed
  let isMandatoryFromLogic = false
  let isReadOnlyFromLogic = false
  let parentFieldsList = []
  let parsedDefaultValue = fieldToGenerate.defaultValue
  let parsedDefaultValueTo = fieldToGenerate.defaultValueTo
  let operator = 'EQUAL'
  let isNumericField = componentReference.type === 'FieldNumber'
  let isTranslatedField = fieldToGenerate.isTranslated
  if (moreAttributes.isAdvancedQuery) {
    isNumericField = false
    isTranslatedField = false
    parsedDefaultValue = undefined
    parsedDefaultValueTo = undefined

    if (['FieldText', 'FieldTextLong'].includes(componentReference.type)) {
      operator = 'LIKE'
    }
  } else {
    if (String(parsedDefaultValue).includes('@') &&
      String(parsedDefaultValue).trim() !== '-1') {
      parsedDefaultValue = parseContext({
        ...moreAttributes,
        columnName: fieldToGenerate.columnName,
        value: parsedDefaultValue,
        isSOTrxMenu: isSOTrxMenu
      }).value
    }

    if (isEmptyValue(parsedDefaultValue) &&
      !(fieldToGenerate.isKey || fieldToGenerate.isParent) &&
      String(parsedDefaultValue).trim() !== '-1') {
      parsedDefaultValue = getPreference({
        parentUuid: fieldToGenerate.parentUuid,
        containerUuid: fieldToGenerate.containerUuid,
        columnName: fieldToGenerate.columnName
      })

      // search value preference with elementName
      if (!isEmptyValue(fieldToGenerate.elementName) &&
        isEmptyValue(parsedDefaultValue)) {
        parsedDefaultValue = getPreference({
          parentUuid: fieldToGenerate.parentUuid,
          containerUuid: fieldToGenerate.containerUuid,
          columnName: fieldToGenerate.elementName
        })
      }
    }

    parsedDefaultValue = parsedValueComponent({
      fieldType: componentReference.type,
      value: parsedDefaultValue,
      referenceType,
      isMandatory: fieldToGenerate.isMandatory,
      isIdentifier: fieldToGenerate.columnName.includes('_ID')
    })

    if (String(fieldToGenerate.defaultValue).includes('@SQL=')) {
      isShowedFromUser = true
      isSQLValue = true
    }

    // VALUE TO
    if (String(parsedDefaultValueTo).includes('@') &&
      String(parsedDefaultValueTo).trim() !== '-1') {
      parsedDefaultValueTo = parseContext({
        ...moreAttributes,
        columnName: `${fieldToGenerate.columnName}_To`,
        value: parsedDefaultValueTo
      }).value
    }

    if (isEmptyValue(parsedDefaultValueTo) &&
      !(fieldToGenerate.isKey || fieldToGenerate.isParent) &&
      String(parsedDefaultValueTo).trim() !== '-1') {
      parsedDefaultValueTo = getPreference({
        parentUuid: fieldToGenerate.parentUuid,
        containerUuid: fieldToGenerate.containerUuid,
        columnName: `${fieldToGenerate.columnName}_To`
      })

      // search value preference with elementName
      if (!isEmptyValue(fieldToGenerate.elementName) &&
        isEmptyValue(parsedDefaultValueTo)) {
        parsedDefaultValueTo = getPreference({
          parentUuid: fieldToGenerate.parentUuid,
          containerUuid: fieldToGenerate.containerUuid,
          columnName: `${fieldToGenerate.elementName}_To`
        })
      }
    }

    parsedDefaultValueTo = parsedValueComponent({
      fieldType: componentReference.type,
      value: parsedDefaultValueTo,
      referenceType,
      isMandatory: fieldToGenerate.isMandatory,
      isIdentifier: fieldToGenerate.columnName.includes('_ID')
    })

    parentFieldsList = getParentFields(fieldToGenerate)

    // evaluate logics
    const setEvaluateLogics = {
      parentUuid: moreAttributes.parentUuid,
      containerUuid: moreAttributes.containerUuid,
      context: getContext
    }
    if (!isEmptyValue(fieldToGenerate.displayLogic)) {
      isDisplayedFromLogic = evaluator.evaluateLogic({
        ...setEvaluateLogics,
        logic: fieldToGenerate.displayLogic
      })
    }
    if (!isEmptyValue(fieldToGenerate.mandatoryLogic)) {
      isMandatoryFromLogic = evaluator.evaluateLogic({
        ...setEvaluateLogics,
        logic: fieldToGenerate.mandatoryLogic
      })
    }
    if (!isEmptyValue(fieldToGenerate.readOnlyLogic)) {
      isReadOnlyFromLogic = evaluator.evaluateLogic({
        ...setEvaluateLogics,
        logic: fieldToGenerate.readOnlyLogic
      })
    }
  }

  const field = {
    ...fieldToGenerate,
    ...moreAttributes,
    isSOTrxMenu,
    // displayed attributes
    componentPath: componentReference.type,
    isSupport: componentReference.support,
    referenceType,
    displayColumn: undefined, // link to value from selects and table
    // value attributes
    value: String(parsedDefaultValue).trim() === '' ? undefined : parsedDefaultValue,
    oldValue: parsedDefaultValue,
    valueTo: parsedDefaultValueTo,
    parsedDefaultValue,
    parsedDefaultValueTo,
    // logics to app
    isDisplayedFromLogic,
    isReadOnlyFromLogic,
    isMandatoryFromLogic,
    //
    parentFieldsList,
    dependentFieldsList: [],
    // TODO: Add support on server
    // app attributes
    isShowedFromUser,
    isShowedFromUserDefault: isShowedFromUser, // set this value when reset panel
    isShowedTableFromUser: fieldToGenerate.isDisplayed,
    isFixedTableColumn: false,
    valueType: componentReference.valueType, // value type to convert with gGRPC
    isSQLValue,
    // Advanced query
    operator, // current operator
    oldOperator: undefined, // old operator
    defaultOperator: operator,
    // popover's
    isNumericField,
    isTranslatedField
  }

  // Sizes from panel and groups
  field.sizeFieldFromType = FIELD_DISPLAY_SIZES.find(item => {
    return item.type === field.componentPath
  })
  if (field.sizeFieldFromType === undefined) {
    console.warn(`Field size no found: ${field.name} type: ${field.componentPath}.`)
    field.sizeFieldFromType = {
      type: field.componentPath,
      size: DEFAULT_SIZE
    }
  }

  // Overwrite some values
  if (field.isRange) {
    field.operator = 'GREATER_EQUAL'
    if (typeRange) {
      field.uuid = `${field.uuid}_To`
      field.columnName = `${field.columnName}_To`
      field.name = `${field.name} To`
      field.value = parsedDefaultValueTo
      field.defaultValue = field.defaultValueTo
      field.parsedDefaultValue = field.parsedDefaultValueTo
      field.operator = 'LESS_EQUAL'
    }
  }

  // hidden field type button
  const notShowedField = FIELD_NOT_SHOWED.find(itemField => {
    return field.displayType === itemField.id
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
    panelType
  }

  //  Convert from gRPC
  let fieldDefinitionList
  if (processToGenerate.parametersList) {
    const fieldsRangeList = []

    fieldDefinitionList = processToGenerate.parametersList
      .map(fieldItem => {
        const field = generateField({
          fieldToGenerate: fieldItem,
          moreAttributes: additionalAttributes
        })
        // Add new field if is range number
        if (field.isRange && field.componentPath === 'FieldNumber') {
          const fieldRange = generateField({
            fieldToGenerate: fieldItem,
            moreAttributes: additionalAttributes,
            typeRange: true
          })
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
      .forEach((field, index, list) => {
        if (field.isActive && field.parentFieldsList.length) {
          field.parentFieldsList.forEach(parentColumnName => {
            const parentField = list.find(itemParentField => {
              return itemParentField.columnName === parentColumnName && parentColumnName !== field.columnName
            })
            if (parentField) {
              parentField.dependentFieldsList.push(field.columnName)
            }
          })
        }
      })
  }

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
    reportExportType: 'html'
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

  const printFormats = {
    name: language.t('views.printFormat'),
    processName: processToGenerate.name,
    type: 'summary',
    action: '',
    childs: [],
    option: 'printFormat',
    uuid: processToGenerate.uuid,
    id: processToGenerate.id,
    description: processToGenerate.description,
    isReport: processToGenerate.isReport,
    isDirectPrint: processToGenerate.isDirectPrint,
    process: processToGenerate
  }

  processToGenerate.printFormatsAvailable.forEach(actionValue => {
    //  Push values
    printFormats.childs.push({
      name: actionValue.name,
      processName: processToGenerate.name,
      type: 'action',
      action: 'startProcess',
      uuid: processToGenerate.uuid,
      id: processToGenerate.id,
      description: actionValue.description,
      isReport: processToGenerate.isReport,
      isDirectPrint: processToGenerate.isDirectPrint,
      reportExportType: undefined,
      printFormatUuid: actionValue.printFormatUuid
    })
  })
  //  Add summary Actions
  actions.push(summaryAction)
  actions.push(printFormats)

  const processDefinition = {
    ...processToGenerate,
    panelType,
    isAssociated: Boolean(containerUuidAssociated),
    containerUuidAssociated,
    fieldList: fieldDefinitionList
  }

  return {
    processDefinition,
    actions
  }
}

/**
 * Evaluate by the ID and name of the reference to call the component type
 * @param {integer} displayTypeId, received from data
 * @param {boolean} isAllInfo
 * @return string type, assigned value to folder after evaluating the parameter
 */
export function evalutateTypeField(displayTypeId, isAllInfo = false) {
  const component = REFERENCES.find(reference => displayTypeId === reference.id)
  if (isAllInfo) {
    return component
  }
  return component.type
}

// Default template for injected fields
export function getFieldTemplate(attributesOverwrite) {
  return {
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
    reference: {
      tableName: '',
      keyColumnName: '',
      displayColumnName: '',
      query: '',
      parsedQuery: '',
      directQuery: '',
      parsedDirectQuery: '',
      validationCode: '',
      windowsList: []
    },
    contextInfo: undefined,
    isShowedFromUser: false,
    isFixedTableColumn: false,
    sizeFieldFromType: {
      type: 'Button',
      size: DEFAULT_SIZE
    },
    ...attributesOverwrite
  }
}

/**
 * [assignedGroup]
 * @param  {array} fieldList Field of List with
 * @return {array} fieldList
 */
export function assignedGroup({ fieldsList, groupToAssigned, orderBy }) {
  if (fieldsList === undefined || fieldsList.length <= 0) {
    return fieldsList
  }

  fieldsList = sortFields({
    fieldsList,
    orderBy
  })

  let firstChangeGroup = false
  let currentGroup = ''
  let typeGroup = ''

  fieldsList.forEach(fieldElement => {
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

    if (groupToAssigned !== undefined) {
      fieldElement.groupAssigned = groupToAssigned
    }
  })

  return fieldsList
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
export function sortFields({
  fieldsList,
  orderBy = 'sequence',
  type = 'asc'
}) {
  if (type.toLowerCase() === 'asc') {
    fieldsList.sort((itemA, itemB) => {
      return itemA[orderBy] - itemB[orderBy]
      // return itemA[orderBy] > itemB[orderBy]
    })
  } else {
    fieldsList.sort((itemA, itemB) => {
      return itemA[orderBy] + itemB[orderBy]
      // return itemA[orderBy] > itemB[orderBy]
    })
  }
  // if (type.toLowerCase() === 'desc') {
  //   return fieldsList.reverse()
  // }
  return fieldsList
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
      actionAttributes.name = 'workbech'
      actionAttributes.icon = 'peoples'
      break
    case 'F':
      actionAttributes.name = 'workflow'
      actionAttributes.icon = 'example'
      break
    case 'P':
      actionAttributes.name = 'process'
      actionAttributes.icon = 'component'
      actionAttributes.component = () => import('@/views/ADempiere/Process')
      break
    case 'R':
      actionAttributes.name = 'report'
      actionAttributes.icon = 'skill'
      actionAttributes.component = () => import('@/views/ADempiere/Process')
      break
    case 'S':
      actionAttributes.name = 'browser'
      actionAttributes.icon = 'search'
      actionAttributes.component = () => import('@/views/ADempiere/Browser')
      break
    case 'T':
      actionAttributes.name = 'task'
      actionAttributes.icon = 'size'
      break
    case 'W':
      actionAttributes.name = 'window'
      actionAttributes.icon = 'tab'
      actionAttributes.component = () => import('@/views/ADempiere/Window')
      break
    case 'X':
      actionAttributes.name = 'form'
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
