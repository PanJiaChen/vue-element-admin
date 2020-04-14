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
// - reference.query
// - reference.directQuery
// - reference.tableName
// - displayColumn
// - defaultValue

import REFERENCES, { TEXT } from '@/utils/ADempiere/references'

export function createField({
  containerUuid,
  displayType = TEXT.id,
  columnName,
  name,
  isMandatory = false,
  isReadOnly = false
}) {
  const metadata = {
    isCustomField: true,
    containerUuid: containerUuid,
    columnName: columnName,
    name: name,
    displayType: displayType,
    isActive: true,
    isMandatory: isMandatory,
    isReadOnly: isReadOnly,
    isDisplayed: true,
    isDisplayedFromLogic: true,
    isShowedFromUser: true,
    componentPath: REFERENCES.find(reference => reference.id === displayType).type
  }
  // Special cases
  // Please if you need use a special case remember that already exists many implementations
  // switch (displayType) {
  //   case TEXT.id:
  //     break
  // }
  return metadata
}
