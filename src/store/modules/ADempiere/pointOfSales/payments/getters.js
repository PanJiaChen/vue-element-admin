// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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

/**
 * Payments Getters
 */

export default {
  getPaymentBox: (state) => {
    return state
  },
  getMultiplyRate: (state) => {
    return state.multiplyRate
  },
  getDivideRate: (state) => {
    return state.divideRate
  },
  getMultiplyRateCollection: (state) => {
    return state.multiplyRateCollection
  },
  getDivideRateCollection: (state) => {
    return state.divideRateCollection
  },
  getListPayments: (state) => {
    return state.listPayments
  },
  getListCurrency: (state) => {
    return state.currency
  },
  getConvertionPayment: (state) => {
    return state.convertion
  },
  getFieldCuerrency: (state) => {
    return state.fieldCurrency
  }
}
