<template>
  <div>
    <el-popover
      ref="locationAddress"
      v-model="isShowedLocationForm"
      :placement="popoverPlacement"
      width="300"
      trigger="manual"
    >
      <location-address-form
        v-if="isShowedLocationForm"
        :values="localValues"
        :parent-metadata="metadata"
      />
    </el-popover>
    <el-input
      v-model="displayedValue"
      readonly
      @focus="setShowedLocationForm(true)"
    >
      <i slot="prefix" class="el-icon-location-information el-input__icon" />
    </el-input>
  </div>
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
