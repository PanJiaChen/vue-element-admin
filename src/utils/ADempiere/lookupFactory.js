// A simple class for make easy lookup for dynamic forms from ADempiere Meta-Data
// note that it can be used for create meta-data for lookups
// Field component: this component is created dinamically from meta-data and can be used for
// many form incluyed Window/Tab/Fields, Process and Smart Browsers
// The aproach for this file is allows define field type manual and allows get metadata from server
// Exists many attributes fro handle behavior of field, the follow is a example:
// General:
// - columnName:
// - name:
// - help
// - inTable:
// - isAdvancedQuery:
// - isMandatory:
// - isMandatoryFromLogic
// - isReadOnly:
// - isDisplayed:
// - isShowedFromUser
// - isActive:
// - isSelectCreated:
// - isAlwaysUpdateable:
// - parentUuid:
// - containerUuid:
// - value:
// Lookup:
// - query:
// - directQuery:
// - tableName:
// Date and Time:
// - isRange
// - vFormat
// - valueTo
// - valueMax
// - valueMin
// Number:
// - isRange
// - valueTo
// - valueMax
// - valueMin
// Text:
// - isEncrypted
// - fieldLength
// Select:
// - isSelectCreated (created from ui for multi-selection)
// - query
// - directQuery
// - tableName
// - displayColumn
// - defaultValue

import { CHAR, DEFAULT_SIZE, TEXT, TABLE_DIRECT } from '@/utils/ADempiere/references'
import { evalutateTypeField } from '@/utils/ADempiere/dictionaryUtils'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import evaluator, { getContext, getParentFields } from '@/utils/ADempiere/contextUtils'
import store from '@/store'

// Create a Field from UUID based on server meta-data
export function createFieldFromDictionary({
  containerUuid,
  fieldUuid,
  columnUuid,
  elementUuid,
  elementColumnName,
  tableName,
  columnName,
  overwriteDefinition
}) {
  let field
  if (fieldUuid) {
    field = store.getters.getFieldFromUuid(fieldUuid)
  } else if (columnUuid) {
    field = store.getters.getFieldFromColumnUuid(columnUuid)
  } else if (elementUuid) {
    field = store.getters.getFieldFromElementUuid(elementUuid)
  } if (elementColumnName) {
    field = store.getters.getFieldFromElementColumnName(elementColumnName)
  } else if (tableName && columnName) {
    field = store.getters.getFieldFromElementColumnName({
      tableName,
      columnName
    })
  }
  if (!isEmptyValue(field)) {
    return getFactoryFromField({ containerUuid, field })
  }
  return new Promise(resolve => {
    store.dispatch('getFieldFromServer', {
      fieldUuid,
      columnUuid,
      elementUuid,
      elementColumnName,
      tableName,
      columnName
    })
      .then(response => {
        resolve(getFactoryFromField({
          containerUuid,
          field: response,
          overwriteDefinition
        }))
      }).catch(error => {
        console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
      })
  })
}

// Convert field getted from server to factory
function getFactoryFromField({
  containerUuid,
  field,
  overwriteDefinition = {}
}) {
  const fieldDefinition = {
    displayType: field.displayType,
    tableName: field.reference.tableName,
    directQuery: field.directQuery,
    query: field.reference.query,
    keyColumnName: field.reference.keyColumnName,
    validationCode: field.reference.validationCode,
    windowsList: field.reference.windowsList,
    id: field.id,
    uuid: field.uuid,
    name: field.name,
    description: field.description,
    help: field.help,
    fieldGroup: field.fieldGroup,
    isFieldOnly: field.isFieldOnly,
    isRange: field.isRange,
    isSameLine: field.isSameLine,
    sequence: field.sequence,
    seqNoGrid: field.seqNoGrid,
    isIdentifier: field.isIdentifier,
    isKey: field.isKey,
    isSelectionColumn: field.isSelectionColumn,
    isUpdateable: field.isUpdateable,
    formatPattern: field.formatPattern,
    vFormat: field.vFormat,
    defaultValue: field.defaultValue,
    defaultValueTo: field.defaultValueTo,
    valueMin: field.valueMin,
    valueMax: field.valueMax,
    isActive: field.isActive,
    isMandatory: field.isMandatory,
    isReadOnly: field.isReadOnly,
    isDisplayedFromLogic: field.isDisplayedFromLogic,
    isReadOnlyFromLogic: field.isReadOnlyFromLogic,
    isMandatoryFromLogic: field.isMandatoryFromLogic,
    callout: field.callout,
    isQueryCriteria: field.isQueryCriteria,
    displayLogic: field.displayLogic,
    mandatoryLogic: field.mandatoryLogic,
    readOnlyLogic: field.readOnlyLogic,
    parentFieldsList: field.parentFieldsList,
    dependentFieldsList: field.dependentFieldsList,
    contextInfo: field.contextInfo,
    // Overwrite definition
    ...overwriteDefinition
  }

  //  Convert it
  return createFieldFromDefinition({
    containerUuid,
    columnName: field.columnName,
    definition: fieldDefinition
  })
}

// Create a field, it assumed that you define all behavior from source code
export function createFieldFromDefinition({
  parentUuid,
  containerUuid,
  columnName,
  panelType = 'form',
  definition = {}
}) {
  if (!isEmptyValue(definition)) {
    if (isEmptyValue(definition.displayType)) {
      definition.displayType = TEXT.id
    } else if (definition.displayType === TABLE_DIRECT.id &&
      isEmptyValue(definition.tableName) &&
      columnName.indexOf('_ID') > 0) {
      definition.tableName = columnName.replace('_ID', '')
    }
    if (isEmptyValue(definition.isActive)) {
      definition.isActive = true
    }
    if (isEmptyValue(definition.isDisplayed)) {
      definition.isDisplayed = true
    }
    if (isEmptyValue(definition.isDisplayedFromLogic)) {
      definition.isDisplayedFromLogic = true
    }
    if (isEmptyValue(definition.isReadOnly)) {
      definition.isReadOnly = false
    }

    if (isEmptyValue(definition.isMandatory)) {
      definition.isMandatory = false
    }
    if (isEmptyValue(definition.sequence)) {
      definition.sequence = 0
      if (definition.isDisplayed) {
        definition.sequence = 10
      }
    }

    let reference = {}
    if (!isEmptyValue(definition.directQuery) || !isEmptyValue(definition.query)) {
      reference = {
        directQuery: definition.directQuery,
        query: definition.query,
        tableName: definition.tableName || undefined,
        keyColumnName: definition.keyColumnName || undefined,
        validationCode: definition.validationCode || undefined,
        windowsList: definition.windowsList || []
      }
      delete definition.directQuery
      delete definition.query
      delete definition.tableName
      delete definition.validationCode
      delete definition.windowsList
    }
    definition.reference = reference
  }
  return getFieldTemplate({
    panelType,
    ...definition,
    isShowedFromUser: true,
    isCustomField: true,
    parentUuid,
    containerUuid,
    columnName
  })
}

// Default template for injected fields
export function getFieldTemplate(overwriteDefinition) {
  let displayType = CHAR.id // String reference (10)
  if (!isEmptyValue(overwriteDefinition.displayType)) {
    displayType = overwriteDefinition.displayType
  }

  const componentReference = evalutateTypeField(displayType)

  // set size from displayed, max 24
  let size = DEFAULT_SIZE
  if (!isEmptyValue(componentReference.size)) {
    size = componentReference.size
  }
  // rewrite size default size field
  if (!isEmptyValue(overwriteDefinition.size)) {
    size = overwriteDefinition.size
    delete overwriteDefinition.size
    if (typeof size === 'number') {
      size = {
        xs: size,
        sm: size,
        md: size,
        lg: size,
        xl: size
      }
    }
  }

  const fieldTemplateMetadata = {
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
    displayType,
    componentPath: componentReference.componentPath,
    size,
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
    isDisplayedFromLogic: undefined,
    isReadOnlyFromLogic: undefined,
    isMandatoryFromLogic: undefined,
    // browser attributes
    callout: undefined,
    isQueryCriteria: false,
    displayLogic: undefined,
    mandatoryLogic: undefined,
    readOnlyLogic: undefined,
    parentFieldsList: undefined,
    handleFocusGained: false,
    handleFocusLost: false,
    handleKeyPressed: false,
    handleKeyReleased: false,
    handleActionPerformed: true,
    dependentFieldsList: [],
    reference: {
      tableName: '',
      keyColumnName: '',
      query: '',
      directQuery: '',
      validationCode: '',
      windowsList: []
    },
    contextInfo: undefined,
    isShowedFromUser: false,
    isFixedTableColumn: false,
    ...overwriteDefinition
  }

  // get parsed parent fields list
  fieldTemplateMetadata.parentFieldsList = getParentFields(fieldTemplateMetadata)

  // evaluate logics
  const setEvaluateLogics = {
    parentUuid: fieldTemplateMetadata.parentUuid,
    containerUuid: fieldTemplateMetadata.containerUuid,
    context: getContext
  }
  if (!isEmptyValue(fieldTemplateMetadata.displayLogic)) {
    fieldTemplateMetadata.isDisplayedFromLogic = evaluator.evaluateLogic({
      ...setEvaluateLogics,
      logic: fieldTemplateMetadata.displayLogic
    })
  }
  if (!isEmptyValue(fieldTemplateMetadata.mandatoryLogic)) {
    fieldTemplateMetadata.isMandatoryFromLogic = evaluator.evaluateLogic({
      ...setEvaluateLogics,
      logic: fieldTemplateMetadata.mandatoryLogic
    })
  }
  if (!isEmptyValue(fieldTemplateMetadata.readOnlyLogic)) {
    fieldTemplateMetadata.isReadOnlyFromLogic = evaluator.evaluateLogic({
      ...setEvaluateLogics,
      logic: fieldTemplateMetadata.readOnlyLogic
    })
  }

  return fieldTemplateMetadata
}
