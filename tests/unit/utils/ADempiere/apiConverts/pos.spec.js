import {
  convertOrder,
  convertPointOfSales,
  convertOrderLine,
  convertKeyLayout,
  paymentsMethod
} from '@/utils/ADempiere/apiConverts/pos'
import pointOfSales from './objects/fromApi/pointOfSales.json'
import convertedPointOfSales from './objects/converted/pointOfSales.json'
import order from './objects/fromApi/order.json'
import convertedOrder from './objects/converted/order.json'
import orderLine from './objects/fromApi/orderLine.json'
import convertedOrderLine from './objects/converted/orderLine.json'
import keyLayout from './objects/fromApi/keyLayout.json'
import convertedKeyLayout from './objects/converted/keyLayout.json'
import paymentMethod from './objects/fromApi/paymentMethod.json'
import convertedPaymentMethod from './objects/converted/paymentMethod.json'

describe('point of sales', () => {
  it('should return a converted point of sales object', () => {
    const actualPointOfSales = convertPointOfSales(pointOfSales)
    expect(actualPointOfSales).toEqual(convertedPointOfSales)
  })
})

describe('order', () => {
  it('should return a converted order object', () => {
    const actualOrder = convertOrder(order)
    expect(actualOrder).toEqual(convertedOrder)
  })
})

describe('orderLine', () => {
  it('should return a converted orderLine object', () => {
    const actualOrderLine = convertOrderLine(orderLine)
    expect(actualOrderLine).toEqual(convertedOrderLine)
  })
})

describe('keyLayout', () => {
  it('should return a converted keyLayout object', () => {
    const actualKeyLayout = convertKeyLayout(keyLayout)
    expect(actualKeyLayout).toEqual(convertedKeyLayout)
  })
})

describe('paymentMethod', () => {
  it('should return a converted paymentMethod object', () => {
    const actualPaymentMethod = paymentsMethod(paymentMethod)
    expect(actualPaymentMethod).toEqual(convertedPaymentMethod)
  })

  it('should return an undefined object', () => {
    const actualPaymentMethod = paymentsMethod(undefined)
    expect(actualPaymentMethod).toBeUndefined()
  })
})
