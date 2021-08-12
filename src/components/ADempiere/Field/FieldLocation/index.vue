<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-popover
    ref="locationAddress"
    v-model="isShowedLocationForm"
    placement="left-end"
    width="300"
    trigger="manual"
  >
    <location-address-form
      :values="localValues"
      :parent-metadata="metadata"
    />
    <el-button slot="reference" type="text" style="width: -webkit-fill-available;" @click="setShowedLocationForm(true)">
      <el-input
        v-model="displayedValue"
        readonly
      >
        <i slot="prefix" class="el-icon-location-information el-input__icon" />
      </el-input>
    </el-button>
  </el-popover>
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import mixinLocation from './mixinLocation.js'
import LocationAddressForm from './locationAddressForm'

export default {
  name: 'FieldLocation',
  components: {
    LocationAddressForm
  },
  mixins: [
    fieldMixin,
    mixinLocation
  ],
  data() {
    return {
      localValues: {}
    }
  },
  computed: {
    displayedValue: {
      get() {
        /**
         * TODO: Add DisplayColumn (to locator's and location's fields) in entities
         * list response, to set value or empty value in fieldValue state when
         * change records with dataTable.
         */
        if (this.isEmptyValue(this.value)) {
          return undefined
        }

        return this.$store.getters.getValueOfField({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: this.metadata.displayColumnName
        })
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: this.metadata.displayColumnName,
          value
        })
      }
    },
    popoverPlacement() {
      return this.metadata.popoverPlacement || 'top'
    }
  },
  mounted() {
    if (!this.metadata.isAdvancedQuery) {
      this.getLocation()
    }
  },
  methods: {
    getLocation() {
      if (!this.isEmptyValue(this.displayedValue)) {
        return
      }

      const value = this.value
      if (this.isEmptyValue(value)) {
        return
      }

      this.getLocationAddress({
        id: value
      })
        .then(responseLocation => {
          const { values } = responseLocation

          this.localValues = values

          // TODO: Get Display_ColumnName from server request
          this.displayedValue = this.getDisplayedValue(values) || value
        })
        .catch(error => {
          console.warn(`Get Location Address, Field Location - Error ${error.code}: ${error.message}.`)
        })
    }
  }
}
</script>
