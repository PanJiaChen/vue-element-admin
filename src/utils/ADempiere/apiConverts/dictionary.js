import {
  convertField,
  convertFieldGroup
} from '@/utils/ADempiere/apiConverts/field.js'
import { convertContextInfo } from '@/utils/ADempiere/apiConverts/core.js'

export function convertProcess(processToConvert) {
  return {
    accessLevel: processToConvert.access_level,
    description: processToConvert.description,
    help: processToConvert.help,
    id: processToConvert.id,
    isActive: processToConvert.is_active,
    isDirectPrint: processToConvert.is_direct_print,
    isReport: processToConvert.is_report,
    name: processToConvert.name,
    parameters: processToConvert.parameters.map(parameter => {
      return convertField(parameter)
    }),
    reportExportTypes: processToConvert.report_export_types, // no convert content
    showHelp: processToConvert.show_help,
    uuid: processToConvert.uuid
  }
}

// Convert report export type
export function convertReportExportType(reportExportType) {
  return {
    name: reportExportType.name,
    description: reportExportType.description,
    type: reportExportType.type
  }
}

export function convertBrowser(browserToConvert) {
  // browser definition
  return {
    // identifier attributes
    id: browserToConvert.id,
    uuid: browserToConvert.uuid,
    viewUuid: browserToConvert.view_uuid,
    //
    value: browserToConvert.value,
    name: browserToConvert.name,
    description: browserToConvert.description,
    help: browserToConvert.help,
    accessLevel: browserToConvert.access_level,
    isActive: browserToConvert.is_active,
    //
    isUpdateable: browserToConvert.is_updateable,
    isDeleteable: browserToConvert.is_deleteable,
    isSelectedByDefault: browserToConvert.is_selected_by_default,
    isCollapsibleByDefault: browserToConvert.is_collapsible_by_default,
    isExecutedQueryByDefault: browserToConvert.is_executed_query_by_default,
    isShowTotal: browserToConvert.is_show_total,
    // search query
    query: browserToConvert.query,
    whereClause: browserToConvert.where_clause,
    orderByClause: browserToConvert.order_by_clause,
    // External Reference
    window: convertWindow(
      browserToConvert.window
    ),
    process: convertProcess(
      browserToConvert.process
    ),
    //
    fields: browserToConvert.fields.map(fieldItem => {
      return convertField(fieldItem)
    })
  }
}

export function convertForm(formToConvert) {
  return {
    id: formToConvert.id,
    uuid: formToConvert.uuid,
    name: formToConvert.name,
    description: formToConvert.description,
    help: formToConvert.help,
    accessLevel: formToConvert.access_level,
    fileName: formToConvert.file_name,
    isActive: formToConvert.is_active
  }
}

export function convertWindow(windowToConvert) {
  return {
    id: windowToConvert.id,
    uuid: windowToConvert.uuid,
    name: windowToConvert.name,
    description: windowToConvert.description,
    help: windowToConvert.help,
    isActive: windowToConvert.is_active,
    isSalesTransaction: windowToConvert.is_sales_transaction,
    windowType: windowToConvert.window_type,
    contextInfo: convertContextInfo(
      windowToConvert.context_info
    ),
    tabs: windowToConvert.tabs.map(tab => {
      return convertTab(tab)
    })
  }
}

// convert Tabs
export function convertTab(tabToConvert) {
  return {
    id: tabToConvert.id,
    uuid: tabToConvert.uuid,
    name: tabToConvert.name,
    description: tabToConvert.description,
    help: tabToConvert.help,
    tableName: tabToConvert.table_name,
    sequence: tabToConvert.sequence,
    tabLevel: tabToConvert.tab_level,
    isActive: tabToConvert.is_active,
    isSingleRow: tabToConvert.is_single_row,
    isAdvancedTab: tabToConvert.is_advanced_tab,
    isHasTree: tabToConvert.is_has_tree,
    isInfoTab: tabToConvert.is_info_tab,
    isSortTab: tabToConvert.is_sort_tab,
    isTranslationTab: tabToConvert.is_translation_tab,
    isReadOnly: tabToConvert.is_read_only,
    isInsertRecord: tabToConvert.is_insert_record,
    isView: tabToConvert.is_view,
    isDeleteable: tabToConvert.is_deleteable,
    isDocument: tabToConvert.is_document,
    isChangeLog: tabToConvert.is_change_log,
    accessLevel: tabToConvert.access_level,
    linkColumnName: tabToConvert.link_column_name,
    sortOrderColumnName: tabToConvert.sort_order_column_name,
    sortYesNoColumnName: tabToConvert.sort_yes_no_column_name,
    parentColumnName: tabToConvert.parent_column_name,
    displayLogic: tabToConvert.display_logic,
    commitWarning: tabToConvert.commit_warning,
    query: tabToConvert.query,
    whereClause: tabToConvert.where_clause,
    orderByClause: tabToConvert.order_by_clause,
    parentTabUuid: tabToConvert.parent_tab_uuid,
    contextInfo: convertContextInfo(
      tabToConvert.context_info
    ),
    fieldGroup: convertFieldGroup(
      tabToConvert.field_group
    ),
    processes: tabToConvert.processes.map(process => {
      return convertProcess(process)
    }),
    fields: tabToConvert.fields.map(field => {
      return convertField(field)
    })
  }
}

//  Convert Validation Rule
export function convertValidationRule(validationRuleToConvert) {
  return {
    id: validationRuleToConvert.id,
    uuid: validationRuleToConvert.uuid,
    name: validationRuleToConvert.name,
    description: validationRuleToConvert.description,
    validationCode: validationRuleToConvert.validation_code,
    type: validationRuleToConvert.type
  }
}
