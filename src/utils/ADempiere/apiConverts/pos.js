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

import { camelizeObjectKeys } from '../transformObject.js'
import {
  convertBankAccount,
  convertBusinessPartner,
  convertDocumentStatus,
  convertDocumentType,
  convertPriceList,
  convertProduct,
  convertSalesRepresentative,
  convertTaxRate
} from './core.js'

export function convertPointOfSales(pos) {
  const convertedPos = camelizeObjectKeys(pos)
  convertedPos.documentType = convertDocumentType(pos.document_type)
  convertedPos.cashBankAccount = convertBankAccount(pos.cash_bank_account)
  convertedPos.cashTransferBankAccount = convertBankAccount(pos.cash_transfer_bank_account)
  convertedPos.templateBusinessPartner = convertBusinessPartner(pos.template_business_partner)
  convertedPos.priceList = convertPriceList(pos.price_list)
  return convertedPos
}

export function convertOrder(order) {
  const convertedOrder = camelizeObjectKeys(order)
  convertedOrder.documentType = convertDocumentType(order.document_type)
  convertedOrder.salesRepresentative = convertSalesRepresentative(order.sales_representative)
  convertedOrder.documentStatus = convertDocumentStatus(order.document_status)
  convertedOrder.businessPartner = convertBusinessPartner(order.business_partner)
  return convertedOrder
}

export function convertOrderLine(orderLine) {
  const convertedOrderLine = camelizeObjectKeys(orderLine)
  convertedOrderLine.product = convertProduct(orderLine.product)
  convertedOrderLine.taxRate = convertTaxRate(orderLine.tax_rate)
  return convertedOrderLine
}

export function convertKeyLayout(keyLayout) {
  const convertedKeyLayout = camelizeObjectKeys(keyLayout)
  convertedKeyLayout.keysList = keyLayout.keys.map(key => convertKey(key))
  delete convertedKeyLayout['keys']
  return convertedKeyLayout
}

function convertKey(key) {
  const convertedKey = camelizeObjectKeys(key)
  convertedKey.resourceReference = convertResourceReference(key.resource_reference)
  return convertedKey
}

function convertResourceReference(resourceReference) {
  if (!resourceReference) {
    return undefined
  }
  return camelizeObjectKeys(resourceReference)
}

export function paymentsMethod(payments) {
  if (!payments) {
    return undefined
  }
  return camelizeObjectKeys(payments)
}
