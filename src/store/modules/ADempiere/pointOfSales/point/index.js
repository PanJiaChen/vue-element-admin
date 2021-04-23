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
 * Get Point Of Sales Vuex Module Store Data
 * Search Point of Sale list
 * Current Point of Sale
 */

import state from './state.js'
import mutations from './mutations.js'
import actions from './actions.js'
import getters from '../getters/index.js'

/**
 * Get Order Vuex Module Store Data
 * Create Order
 * Update Order
 * List Order
 * Delete Order
 * Reload Order
 */

import stateOrder from '../order/state.js'
import mutationsOrder from '../order/mutations.js'

/**
 * Get Order Line Vuex Module Store Data
 * Create Line
 * Update Line
 * Delete Line
 * List Line
 */

import stateOrderLine from '../orderLine/state.js'
import mutationsOrderLine from '../orderLine/mutations.js'

/**
 * Get Payments Vuex Module Store Data
 * Create Payment
 * Update Payment
 * Delete Payment
 * List Payment
 */

import statePayments from '../payments/state.js'
import mutationsPayments from '../payments/mutations.js'

/**
 * Get Product Price Vuex Module Store Data
 * Product List
 * Search Product
 */
import stateProductPrice from '../productPrice/state.js'
import mutationsProductPrice from '../productPrice/mutations.js'

/**
 * Get keyLayout Vuex Module Store Data
 * List Catalog
 */
import stateKeyLayout from '../keyLayout/state.js'
import mutationsKeyLayout from '../keyLayout/mutations.js'

const pointOfSales = {
  state: {
    ...state,
    ...stateOrder,
    ...stateOrderLine,
    ...statePayments,
    ...stateProductPrice,
    ...stateKeyLayout
  },
  mutations: {
    ...mutations,
    ...mutationsOrder,
    ...mutationsOrderLine,
    ...mutationsPayments,
    ...mutationsProductPrice,
    ...mutationsKeyLayout
  },
  actions,
  getters
}

export default pointOfSales
