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

import { requestGetCountryDefinition } from '@/api/ADempiere/system-core.js'
import { getLocationAddress } from '@/api/ADempiere/field/location.js'

export default {
  name: 'MixinLocationField',
  computed: {
    currentCountryDefinition() {
      return this.$store.getters.getCountry
    },
    isShowedLocationForm: {
      get() {
        return this.$store.getters.getIsShowedLocation
      },
      set() {
        // empty
      }
    }
  },
  methods: {
    getLocationAddress,
    requestGetCountryDefinition,
    toggleShowedLocationForm() {
      this.$store.commit('setShowedLocation', !this.isShowedLocationForm)
    },
    setShowedLocationForm(isShow) {
      this.$store.commit('setShowedLocation', isShow)
    },
    /**
     * TODO: Add support with sequence to displayed
     * @param {object} entityValues
     */
    getDisplayedValue(entityValues) {
      let value = ''

      if (!this.isEmptyValue(entityValues)) {
        if (!this.isEmptyValue(entityValues.Address1)) {
          value = entityValues.Address1
        }
        if (!this.isEmptyValue(entityValues.City)) {
          value += ', ' + entityValues.City
        }
        if (!this.isEmptyValue(entityValues.RegionName)) {
          value += ', ' + entityValues.RegionName
        }
        if (!this.isEmptyValue(entityValues.Postal)) {
          value += ', ' + entityValues.Postal
        }
      }

      return value
    }
  }
}
