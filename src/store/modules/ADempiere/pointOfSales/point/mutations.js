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

import Vue from 'vue'

/**
 * Pos Mutations
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 */
export default {
  setPontOfSales(state, pos) {
    state.pointOfSales = pos
  },
  setCurrentPOS(state, pos) {
    Vue.set(state.pointOfSales, 'currentPOS', pos)
  },
  listPointOfSales(state, listPointOfSales) {
    state.listPointOfSales = listPointOfSales
  },
  listWarehouses(state, listWarehouses) {
    state.listWarehouses = listWarehouses
  },
  currentListPrices(state, listPrices) {
    state.currentlistPrices = listPrices
  },
  currentWarehouse(state, warehouse) {
    state.currentWarehouse = warehouse
  },
  listPrices(state, listPrices) {
    state.listPrices = listPrices
  },
  listCurrencies(state, listCurrency) {
    state.listCurrency = listCurrency
  },
  conversionList(state, conversion) {
    state.conversionList.push(conversion)
  },
  currentPointOfSales(state, currentPointOfSales) {
    state.currentPointOfSales = currentPointOfSales
  },
  setShowPOSOptions(state, isShowedOptions) {
    state.showPOSOptions = isShowedOptions
  },
  setShowPOSKeyLayout(state, isShowedKeyLayout) {
    state.showPOSKeyLayout = isShowedKeyLayout
  },
  setShowPOSCollection(state, isShowedCollection) {
    state.showPOSCollection = isShowedCollection
  }
}
