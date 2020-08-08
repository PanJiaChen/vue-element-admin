import { POSInstance as Instance } from '@/api/ADempiere/instances.js'
import Criteria from '@/utils/ADempiere/criteria.js'

/**
 * method in price-checking.js as getProductPrice
 */
export { getProductPrice as findProduct } from '@/api/ADempiere/form/price-checking.js'

// List Point of sales
export function requestlistPointOfSales({
  userUuid,
  pageSize,
  pageToken
}) {
  return Instance.call(this).listPointOfSales({
    userUuid,
    pageSize,
    pageToken
  })
}

// Create order from POS
export function createOrder({
  posUuid,
  customerUuid,
  documentTypeUuid
}) {
  return Instance.call(this).createOrder({
    posUuid,
    customerUuid,
    documentTypeUuid
  })
}

// Update order from POS
export function updateOrder({
  orderUuid,
  posUuid,
  customerUuid,
  description
}) {
  return Instance.call(this).updateOrder({
    orderUuid,
    posUuid,
    customerUuid,
    description
  })
}

// Create order line from order uuid and product
export function createOrderLine({
  orderUuid,
  warehouseUuid,
  productUuid,
  chargeUuid,
  description,
  quantity,
  price,
  discountRate
}) {
  return Instance.call(this).createOrderLine({
    orderUuid,
    warehouseUuid,
    productUuid,
    chargeUuid,
    description,
    quantity,
    price,
    discountRate
  })
}

// Create order line from order uuid and product
export function getOrder(orderUuid) {
  return Instance.call(this).getOrder({ orderUuid })
}

// List orders from pos uuid
export function requestListOrders({
  posUuid,
  documentNo,
  businessPartnerUuid,
  grandTotal,
  openAmount,
  isPaid,
  isProcessed,
  isAisleSeller,
  isInvoiced,
  dateOrderedFrom,
  dateOrderedTo,
  salesRepresentativeUuid,
  pageSize,
  pageToken
}) {
  const criteria = new Criteria({ tableName: 'C_Order' })

  /*
  criteria.addCondition({
    columnName: 'DocumentNo',
    value: documentNo
  }).addCondition({
    columnName: 'C_BPartner_ID_UUID',
    value: businessPartnerUuid
  }).addCondition({
    columnName: 'GrandTotal',
    value: grandTotal
  }).addCondition({
    columnName: 'OpenAmt',
    value: openAmount
  }).addCondition({
    columnName: 'IsPaid',
    value: isPaid
  }).addCondition({
    columnName: 'Processed',
    value: isProcessed
  }).addCondition({
    columnName: 'IsAisleSeller',
    value: isAisleSeller
  }).addCondition({
    columnName: 'IsInvoiced',
    value: isInvoiced
  }).addCondition({
    columnName: 'DateOrderedFrom',
    value: dateOrderedFrom
  }).addCondition({
    columnName: 'DateOrderedTo',
    value: dateOrderedTo
  }).addCondition({
    columnName: 'SalesRep_ID_UUID',
    value: salesRepresentativeId
  })
  */

  return Instance.call(this).listOrders({
    posUuid,
    documentNo,
    businessPartnerUuid,
    grandTotal,
    openAmount,
    isPaid,
    isProcessed,
    isAisleSeller,
    isInvoiced,
    dateOrderedFrom,
    dateOrderedTo,
    salesRepresentativeUuid,
    criteria: criteria.getCriteria(),
    pageSize,
    pageToken
  })
}

// updateOrderLine orders from pos uuid
export function updateOrderLine({
  orderLineUuid,
  description,
  quantity,
  price,
  discountRate
}) {
  return Instance.call(this).updateOrderLine({
    orderLineUuid,
    description,
    quantity,
    price,
    discountRate
  })
}

// delete Order Line
export function deleteOrderLine({
  orderLineUuid
}) {
  return Instance.call(this).deleteOrderLine({
    orderLineUuid
  })
}

export function listOrderLines({
  orderUuid
}) {
  return Instance.call(this).listOrderLines({
    orderUuid
  })
}

export function getKeyLayout({ keyLayoutUuid }) {
  return Instance.call(this).getKeyLayout({
    keyLayoutUuid
  })
}

// ListProductPrice
export function requestListProductPrice({
  searchValue,
  priceListUuid,
  businessPartnerUuid,
  warehouseUuid,
  validFrom,
  // Query
  criteria,
  pageSize,
  pageToken
}) {
  return Instance.call(this).requestListProductPrice({
    searchValue,
    priceListUuid,
    businessPartnerUuid,
    warehouseUuid,
    validFrom,
    // Query
    criteria,
    pageSize,
    pageToken
  })
}

export function requestPrintOrder({
  orderUuid
}) {
  console.info(`Print order ${orderUuid}`)
}

export function requestGenerateImmediateInvoice({
  posId,
  posUuid
}) {
  console.info(`Generate imediate invoice with POS id ${posId}, and uuid ${posUuid}`)
}

export function requestCompletePreparedOrder({
  orderUuid
}) {
  console.info(`Complete prepared order ${orderUuid}`)
}

export function requestReverseSalesTransaction({
  orderUuid
}) {
  console.info(`Reverse sales transaction ${orderUuid}`)
}

export function requestCreateWithdrawal({
  posId,
  posUuid
}) {
  console.info(`Withdrall cash with POS id ${posId}, and uuid ${posUuid}`)
}

export function requestCreateNewCustomerReturnOrder({
  orderUuid
}) {
  console.info(`New Customer Return Order ${orderUuid}`)
}

export function requestCashClosing({
  posId,
  posUuid
}) {
  console.info(`Cash closing with POS id ${posId}, and uuid ${posUuid}`)
}
