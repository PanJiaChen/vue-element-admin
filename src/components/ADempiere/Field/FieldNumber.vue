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
  <el-tooltip
    v-model="isShowed"
    manual
    :content="valueToDisplay"
    placement="top"
    effect="light"
  >
    <el-input-number
      v-if="isFocus"
      key="number-input-focus"
      :ref="metadata.columnName"
      v-model="value"
      type="number"
      :min="minValue"
      :max="maxValue"
      :placeholder="metadata.placeholder"
      :disabled="isDisabled"
      :precision="precision"
      :controls="isShowControls"
      :controls-position="controlsPosition"
      :class="cssClassStyle"
      autofocus
      @change="preHandleChange"
      @focus="focusGained"
      @keydown.native="keyPressed"
      @keyup.native="keyReleased"
    />
    <el-input
      v-else
      key="number-displayed-blur"
      :ref="metadata.columnName"
      v-model="displayedValue"
      :placeholder="metadata.placeholder"
      :disabled="isDisabled"
      :class="cssClassStyle"
      readonly
      style="text-align-last: end !important"
      @focus="customFocusGained"
    />
  </el-tooltip>
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { FIELDS_CURRENCY, FIELDS_DECIMALS } from '@/utils/ADempiere/references'

export default {
  name: 'FieldNumber',
  mixins: [fieldMixin],
  data() {
    return {
      showControls: true,
      isFocus: false,
      operation: '',
      expression: /[\d\/.()%\*\+\-]/gim,
      valueToDisplay: '',
      isShowed: false
    }
  },
  computed: {
    cssClassStyle() {
      let styleClass = ' custom-field-number '
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    },
    maxValue() {
      if (this.isEmptyValue(this.metadata.valueMax)) {
        return Infinity
      }
      return Number(this.metadata.valueMax)
    },
    minValue() {
      if (this.isEmptyValue(this.metadata.valueMin)) {
        return -Infinity
      }
      return Number(this.metadata.valueMin)
    },
    precision() {
      // Amount, Costs+Prices, Number
      if (this.isDecimal) {
        return this.currencyDefinition.standardPrecision
      }
      return undefined
    },
    isShowControls() {
      if (!this.isEmptyValue(this.metadata.showControl)) {
        if (this.metadata.showControl === 0) {
          return false
        }
      }
      return true
    },
    controlsPosition() {
      if (!this.isEmptyValue(this.metadata.showControl)) {
        // show side controls
        if (this.metadata.showControl === 1) {
          return undefined
        }
      }
      // show right controls
      return 'right'
    },
    isDecimal() {
      return FIELDS_DECIMALS.includes(this.metadata.displayType)
    },
    isCurrency() {
      return FIELDS_CURRENCY.includes(this.metadata.displayType)
    },
    displayedValue() {
      let value = this.value
      if (this.isEmptyValue(value)) {
        value = 0
      }
      if (!this.isDecimal) {
        return value
      }

      let options = {
        useGrouping: true,
        minimumIntegerDigits: 1,
        minimumFractionDigits: this.precision,
        maximumFractionDigits: this.precision
      }
      let lang
      if (this.isCurrency) {
        lang = this.countryLanguage
        options = {
          ...options,
          style: 'currency',
          currency: this.currencyCode
        }
      }

      // TODO: Check the grouping of thousands
      const formatterInstance = new Intl.NumberFormat(lang, options)
      return formatterInstance.format(value)
    },
    countryLanguage() {
      return this.$store.getters.getCountryLanguage
    },
    currencyCode() {
      if (!this.isEmptyValue(this.metadata.labelCurrency)) {
        if (this.metadata.labelCurrency.iSOCode === this.currencyDefinition.iSOCode) {
          return this.currencyDefinition.iSOCode
        }
        return this.metadata.labelCurrency.iSOCode
      }
      return this.currencyDefinition.iSOCode
    },
    currencyDefinition() {
      return this.$store.getters.getCurrency
    }
  },
  methods: {
    parseValue(value) {
      if (this.isEmptyValue(value)) {
        return undefined
      }
      return Number(value)
    },
    customFocusGained(event) {
      this.isFocus = true
    },
    customFocusLost(event) {
      this.isFocus = false
      // this.focusLost(event)
    },
    calculateValue(event) {
      const isAllowed = event.key.match(this.expression)
      if (isAllowed) {
        const result = this.calculationValue(this.value, event)
        if (!this.isEmptyValue(result)) {
          this.valueToDisplay = result
          this.isShowed = true
        } else {
          this.valueToDisplay = '...'
          this.isShowed = true
        }
      } else if (!isAllowed && event.key === 'Backspace') {
        if (String(this.value).slice(0, -1) > 0) {
          event.preventDefault()
          const newValue = String(this.value).slice(0, -1)
          const result = this.calculationValue(newValue, event)
          if (!this.isEmptyValue(result)) {
            this.value = this.parseValue(result)
            this.valueToDisplay = result
            this.isShowed = true
          } else {
            this.valueToDisplay = '...'
            this.isShowed = true
          }
        }
      } else if (!isAllowed && event.key === 'Delete') {
        if (String(this.value).slice(-1) > 0) {
          event.preventDefault()
          const newValue = String(this.value).slice(-1)
          const result = this.calculationValue(newValue, event)
          if (!this.isEmptyValue(result)) {
            this.value = this.parseValue(result)
            this.valueToDisplay = result
            this.isShowed = true
          } else {
            this.valueToDisplay = '...'
            this.isShowed = true
          }
        }
      } else {
        event.preventDefault()
      }
    },
    changeValue() {
      if (!this.isEmptyValue(this.valueToDisplay) && this.valueToDisplay !== '...') {
        const result = this.parseValue(this.valueToDisplay)
        this.preHandleChange(result)
      }
      this.clearVariables()
      this.isShowed = false
    }
  }
}
</script>

<style lang="scss" scoped>
  /* Show input width 100% in container */
  .el-input-number, .el-input {
    width: 100% !important; /* ADempiere Custom */
  }
</style>
