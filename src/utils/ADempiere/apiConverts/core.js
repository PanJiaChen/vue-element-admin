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

import { isEmptyValue } from '../valueUtils'
import { camelizeObjectKeys, renameObjectKey } from '../transformObject'

export function convertContextInfo(contextInfo) {
  if (!contextInfo) {
    return { messageText: {}}
  }
  const convertedContextInfo = camelizeObjectKeys(contextInfo)
  const messageText = contextInfo.message_text ? camelizeObjectKeys(contextInfo.message_text) : {}
  convertedContextInfo.messageText = messageText
  return convertedContextInfo
}

export function convertOrganization(organization) {
  return camelizeObjectKeys(organization)
}

export function convertLanguage(language) {
  const convertedLanguage = camelizeObjectKeys(language)
  renameObjectKey(convertedLanguage, 'languageIso', 'languageISO')
  return convertedLanguage
}

export function convertCountry(country) {
  const convertedCountry = camelizeObjectKeys(country)
  renameObjectKey(convertedCountry, 'isPostCodeLookup', 'isPostcodeLookup')
  convertedCountry.currency = convertCurrency(country.currency)
  return convertedCountry
}

function convertCurrency(currency) {
  if (isEmptyValue(currency)) {
    return {
      id: 0,
      uuid: '',
      iSOCode: '',
      curSymbol: '',
      description: '',
      standardPrecision: 0,
      costingPrecision: 0
    }
  }
  const convertedCurrency = camelizeObjectKeys(currency)
  renameObjectKey(convertedCurrency, 'isoCode', 'iSOCode')
  renameObjectKey(convertedCurrency, 'currencySymbol', 'curSymbol')
  return convertedCurrency
}

export function convertBusinessPartner(businessPartner) {
  return camelizeObjectKeys(businessPartner)
}

export function convertConversionRate(conversionRate) {
  const convertedRate = camelizeObjectKeys(conversionRate)
  if (isEmptyValue(conversionRate.currency_from) && isEmptyValue(conversionRate.currency_to)) {
    delete convertedRate['validFrom']
    delete convertedRate['conversionTypeUuid']
    return convertedRate
  }
  convertedRate.currencyFrom = convertCurrency(conversionRate.currency_from)
  convertedRate.currencyTo = convertCurrency(conversionRate.currency_to)
  return convertedRate
}

export function convertSalesRepresentative(salesRepresentative) {
  return camelizeObjectKeys(salesRepresentative)
}

export function convertBankAccount(bankAccount) {
  if (!bankAccount) {
    return undefined
  }
  const convertedBankAccount = camelizeObjectKeys(bankAccount)
  convertedBankAccount.currency = convertCurrency(bankAccount.currency)
  convertedBankAccount.businessPartner = convertBusinessPartner(bankAccount.business_partner)
  return convertedBankAccount
}

export function convertDocumentType(documentType) {
  if (!documentType) {
    return undefined
  }
  return camelizeObjectKeys(documentType)
}

export function convertDocumentStatus(documentStatus) {
  return camelizeObjectKeys(documentStatus)
}

export function convertPriceList(priceList) {
  const convertedPriceList = camelizeObjectKeys(priceList)
  convertedPriceList.currency = convertCurrency(priceList.currency)
  return convertedPriceList
}

export function convertProductPrice(productPrice) {
  const convertedProductPrice = camelizeObjectKeys(productPrice)
  convertedProductPrice.currency = convertCurrency(productPrice.currency)
  convertedProductPrice.taxRate = convertTaxRate(productPrice.tax_rate)
  convertedProductPrice.product = convertProduct(productPrice.product)
  convertedProductPrice.schemaCurrency = convertCurrency(productPrice.schema_currency)
  return convertedProductPrice
}

export function convertTaxRate(taxRate) {
  return camelizeObjectKeys(taxRate)
}

export function convertProduct(product) {
  return camelizeObjectKeys(product)
}
