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

import { convertCriteria } from './core.js'

export function convertRecentItemsList(recentItemsListToConvert) {
  return {
    recordCount: recentItemsListToConvert.record_count,
    recentItemsList: recentItemsListToConvert.records.map(recentItem => {
      return convertRecentItem(recentItem)
    }),
    nextPageToken: recentItemsListToConvert.next_page_token
  }
}

export function convertRecentItem(recentItemToConvert) {
  return {
    menuUuid: recentItemToConvert.menu_uuid,
    menuName: recentItemToConvert.menu_name,
    menuDescription: recentItemToConvert.menu_description,
    windowUuid: recentItemToConvert.window_uuid,
    tabUuid: recentItemToConvert.tab_uuid,
    tableId: recentItemToConvert.table_id,
    tableName: recentItemToConvert.table_name,
    id: recentItemToConvert.id,
    uuid: recentItemToConvert.uuid,
    displayName: recentItemToConvert.display_name,
    updated: recentItemToConvert.updated,
    referenceUuid: recentItemToConvert.reference_uuid,
    action: recentItemToConvert.action
  }
}

export function convertFavorite(favoriteToConvert) {
  return {
    menuUuid: favoriteToConvert.menu_uuid,
    menuName: favoriteToConvert.menu_name,
    menuDescription: favoriteToConvert.menu_description,
    referenceUuid: favoriteToConvert.reference_uuid,
    action: favoriteToConvert.action
  }
}

export function convertDashboard(dashboardToConvert) {
  return {
    windowUuid: dashboardToConvert.window_uuid,
    browserUuid: dashboardToConvert.browser_uuid,
    dashboardName: dashboardToConvert.dashboard_name,
    dashboardDescription: dashboardToConvert.dashboard_description,
    dashboardHtml: dashboardToConvert.dashboard_html,
    columnNo: dashboardToConvert.column_no,
    lineNo: dashboardToConvert.line_no,
    isCollapsible: dashboardToConvert.is_collapsible,
    isOpenByDefault: dashboardToConvert.is_open_by_default,
    isEventRequired: dashboardToConvert.is_event_required,
    fileName: dashboardToConvert.file_name
  }
}

export function convertPendingDocument(pendingDocumentToConvert) {
  return {
    windowUuid: pendingDocumentToConvert.window_uuid,
    formUuid: pendingDocumentToConvert.form_uuid,
    documentName: pendingDocumentToConvert.document_name,
    documentDescription: pendingDocumentToConvert.document_description,
    sequence: pendingDocumentToConvert.sequence,
    recordCount: pendingDocumentToConvert.record_count,
    criteria: convertCriteria(
      pendingDocumentToConvert.criteria
    )
  }
}
