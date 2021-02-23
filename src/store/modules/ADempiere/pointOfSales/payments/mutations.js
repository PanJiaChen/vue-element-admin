
/**
 * Payments Mutations
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 */
export default {
  addPaymentBox(state, paymentBox) {
    state.paymentBox.push(paymentBox)
  },
  currencyMultiplyRate(state, multiplyRate) {
    state.multiplyRate = multiplyRate
  },
  currencyDivideRate(state, divideRate) {
    state.divideRate = divideRate
  },
  currencyMultiplyRateCollection(state, multiplyRateCollection) {
    state.multiplyRateCollection = multiplyRateCollection
  },
  currencyDivideRateCollection(state, divideRateCollection) {
    state.divideRateCollection = divideRateCollection
  },
  setListPayments(state, list) {
    state.listPayments = list
  },
  setTenderTypeDisplaye(state, tenderTypeDisplaye) {
    state.tenderTypeDisplaye = tenderTypeDisplaye
  },
  setCurrencyDisplaye(state, currency) {
    state.currency = currency
  },
  setConvertionPayment(state, convertion) {
    state.convertion = convertion
  }
}
