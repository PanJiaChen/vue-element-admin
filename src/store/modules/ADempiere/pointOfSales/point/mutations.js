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
 * Pos Mutations
 * All related to global store of Point of Sales
 */
export default {
  setPointOfSalesList(state, pointOfSalesList) {
    state.pointOfSalesList = pointOfSalesList
  },
  setWarehousesList(state, warehousesList) {
    state.warehousesList = warehousesList
  },
  setCurrentPriceList(state, currentPriceList) {
    state.currentPriceList = currentPriceList
  },
  setCurrentWarehouse(state, warehouse) {
    state.currentWarehouse = warehouse
  },
  setPricesList(state, pricesList) {
    state.pricesList = pricesList
  },
  setCurrenciesList(state, currenciesList) {
    state.currenciesList = currenciesList
  },
  addConversionToList(state, conversion) {
    state.conversionsList.push(conversion)
  },
  setCurrentPointOfSales(state, currentPointOfSales) {
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
