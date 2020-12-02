
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
