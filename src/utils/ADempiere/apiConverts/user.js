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

export function convertSession(sessionToConvert) {
  return {
    id: sessionToConvert.id,
    uuid: sessionToConvert.uuid,
    name: sessionToConvert.name,
    userInfo: sessionToConvert.user_info,
    role: convertRole(
      sessionToConvert.role
    ),
    processed: sessionToConvert.processed,
    defaultContext: sessionToConvert.default_context,
    // system info
    countryId: sessionToConvert.country_id,
    costingPrecision: sessionToConvert.costing_precision,
    countryCode: sessionToConvert.country_code,
    countryName: sessionToConvert.country_name,
    currencyIsoCode: sessionToConvert.currency_iso_code,
    currencyName: sessionToConvert.currency_name,
    currencySymbol: sessionToConvert.currency_symbol,
    displaySequence: sessionToConvert.display_sequence,
    language: sessionToConvert.language,
    standardPrecision: sessionToConvert.standard_precision
  }
}

export function convertRole(roleToConvert) {
  const { id, uuid, name, description } = roleToConvert

  return {
    id,
    uuid,
    name,
    description,
    clientId: roleToConvert.client_id,
    clientName: roleToConvert.client_name,
    isAllowHtmlView: roleToConvert.is_allow_html_view,
    isAllowInfoAccount: roleToConvert.is_allow_info_account,
    isAllowInfoAsset: roleToConvert.is_allow_info_asset,
    isAllowInfoBusinessPartner: roleToConvert.is_allow_info_business_partner,
    isAllowInfoCashJournal: roleToConvert.is_allow_info_cash_journal,
    isAllowInfoCrp: roleToConvert.is_allow_info_crp,
    isAllowInfoInOut: roleToConvert.is_allow_info_in_out,
    isAllowInfoInvoice: roleToConvert.is_allow_info_invoice,
    isAllowInfoMrp: roleToConvert.is_allow_info_mrp,
    isAllowInfoOrder: roleToConvert.is_allow_info_order,
    isAllowInfoPayment: roleToConvert.is_allow_info_payment,
    isAllowInfoProduct: roleToConvert.is_allow_info_product,
    isAllowInfoResource: roleToConvert.is_allow_info_resource,
    isAllowInfoSchedule: roleToConvert.is_allow_info_schedule,
    isAllowXlsView: roleToConvert.is_allow_xls_view,
    isCanExport: roleToConvert.is_can_export,
    isCanReport: roleToConvert.is_can_report,
    isPersonalAccess: roleToConvert.is_personal_access,
    isPersonalLock: roleToConvert.is_personal_lock
  }
}
