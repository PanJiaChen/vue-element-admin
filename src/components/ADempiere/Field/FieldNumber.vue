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
      :ref="metadata.columnName"
      v-model="value"
      type="number"
      :min="minValue"
      :max="maxValue"
      :placeholder="metadata.help"
      :disabled="isDisabled"
      :precision="precision"
      :controls="isShowControls"
      :controls-position="controlsPosition"
      :class="cssClassStyle"
      @change="preHandleChange"
      @blur="customFocusLost"
      @focus="focusGained"
      @keydown.native="keyPressed"
      @keyup.native="keyReleased"
    />
    <el-input
      v-else
      :ref="metadata.columnName"
      v-model="displayedValue"
      :placeholder="metadata.help"
      :disabled="isDisabled"
      :class="cssClassStyle"
      readonly
      @blur="customFocusLost"
      @focus="customFocusGained"
      @keydown.native="keyPressed"
      @keyup.native="keyReleased"
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
      return this.metadata.cssClassName + ' custom-field-number'
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
        return this.currencyDefinition.stdPrecision
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
      return this.$store.getters['user/getCountryLanguage']
    },
    currencyCode() {
      return this.currencyDefinition.iSOCode
    },
    currencyDefinition() {
      return this.$store.getters['user/getCurrency']
    }
  },
  watch: {
    isFocus(value) {
      if (value) {
        // focus into input number
        this.$nextTick()
          .then(() => {
            this.$refs[this.metadata.columnName].$el.children[2].firstElementChild.focus()
          })
      }
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
      // this.focusGained(event)
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

  /** Align text in right input **/
  .custom-field-number {
    text-align: right !important;
    input, .el-input__inner {
      text-align: right !important;
    }
  }
</style>
