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

import { CHAR, DEFAULT_SIZE, TABLE_DIRECT } from '@/utils/ADempiere/references.js'
import { evalutateTypeField, getDefaultValue, getEvaluatedLogics } from '@/utils/ADempiere/dictionaryUtils.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { getParentFields } from '@/utils/ADempiere/contextUtils.js'
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
  let valueToMatch
  if (fieldUuid) {
    field = store.getters.getFieldFromUuid(fieldUuid)
    valueToMatch = fieldUuid
  } else if (columnUuid) {
    field = store.getters.getFieldFromColumnUuid(columnUuid)
    valueToMatch = columnUuid
  } else if (elementUuid) {
    field = store.getters.getFieldFromElementUuid(elementUuid)
    valueToMatch = elementUuid
  } if (elementColumnName) {
    field = store.getters.getFieldFromElementColumnName(elementColumnName)
    valueToMatch = elementColumnName
  } else if (tableName && columnName) {
    field = store.getters.getFieldFromElementColumnName({
      tableName,
      columnName
    })
    valueToMatch = columnName
  }

  if (isEmptyValue(field)) {
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
          const newField = getFactoryFromField({
            containerUuid,
            field: response,
            overwriteDefinition
          })

          resolve(newField)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field (match: ${valueToMatch}) From Server (State) - Error ${error.code}: ${error.message}.`)

          const templateField = createFieldFromDefinition({
            containerUuid,
            columnName,
            definition: {
              fieldUuid,
              columnUuid,
              elementUuid,
              elementColumnName,
              tableName,
              columnName,
              ...overwriteDefinition
            }
          })

          resolve(templateField)
        })
    })
  }
  return new Promise(resolve => {
    const fieldWithStore = getFactoryFromField({
      containerUuid,
      field,
      overwriteDefinition
    })

    resolve(fieldWithStore)
  })
}

// Convert field getted from server to factory
function getFactoryFromField({
  containerUuid,
  field,
  overwriteDefinition = {}
}) {
  const definition = {
    parentFieldsList: field.parentFieldsList || [],
    dependentFieldsList: field.dependentFieldsList || [],
    ...field,
    isDisplayed: true,
    // Overwrite definition
    ...overwriteDefinition
  }

  //  Convert it
  return createFieldFromDefinition({
    containerUuid,
    columnName: definition.columnName,
    definition
  })
}

/**
 * Create a field, it assumed that you define all behavior from source code
 * TODO: Join with generateField function
 */
export function createFieldFromDefinition({
  parentUuid,
  containerUuid,
  columnName,
  panelType = 'form',
  definition = {}
}) {
  if (!isEmptyValue(definition)) {
    if (isEmptyValue(definition.displayType)) {
      definition.displayType = CHAR.id
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
    displayColumnName: `DisplayColumn_${overwriteDefinition.columnName}`, // key to display column
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
    //
    formatPattern: undefined,
    VFormat: undefined,
    value: undefined,
    valueTo: undefined,
    defaultValue: undefined,
    parsedDefaultValue: undefined,
    defaultValueTo: undefined,
    parsedDefaultValueTo: undefined,
    valueType: componentReference.valueType, // value type to convert with gGRPC
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
    handleFocusGained: false,
    handleFocusLost: false,
    handleKeyPressed: false,
    handleKeyReleased: false,
    handleActionKeyPerformed: false,
    handleActionPerformed: false,
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
  const parentFieldsList = getParentFields(fieldTemplateMetadata)

  // TODO: Add support to isSOTrxMenu
  const parsedDefaultValue = getDefaultValue({
    ...fieldTemplateMetadata
  })

  let parsedDefaultValueTo
  if (fieldTemplateMetadata.isRange) {
    parsedDefaultValueTo = getDefaultValue({
      ...fieldTemplateMetadata,
      defaultValue: fieldTemplateMetadata.defaultValueTo,
      columnName: `${fieldTemplateMetadata.columnName}_To`,
      elementName: `${fieldTemplateMetadata.elementName}_To`
    })
  }

  // evaluate logics (diplayed, mandatory, readOnly)
  const evaluatedLogics = getEvaluatedLogics({
    ...fieldTemplateMetadata
  })

  return {
    ...fieldTemplateMetadata,
    ...evaluatedLogics,
    parsedDefaultValue,
    parsedDefaultValueTo,
    parentFieldsList
  }
}
