<template>
  <el-tooltip v-model="isShowed" :manual="true" :content="valueToDisplay" placement="top" effect="light">
    <el-input-number
      :ref="metadata.columnName"
      v-model="value"
      type="number"
      :min="minValue"
      :max="maxValue"
      :placeholder="metadata.help"
      :disabled="isDisabled"
      :precision="precision"
      controls-position="right"
      :class="'display-type-amount ' + metadata.cssClassName"
      @change="preHandleChange"
      @blur="changeValue"
      @keydown.native="calculateValue"
      @keyup.enter.native="changeValue"
    />
  </el-tooltip>
</template>

<script>
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'
import { FIELDS_DECIMALS } from '@/utils/ADempiere/references'

export default {
  name: 'FieldNumber',
  mixins: [fieldMixin],
  data() {
    // value render
    let value = this.metadata.value
    if (this.metadata.inTable) {
      value = this.valueModel
    }
    value = this.validateValue(value)
    return {
      value: value,
      showControls: true,
      operation: '',
      expression: /[\d\/.()%\*\+\-]/gim,
      valueToDisplay: '',
      isShowed: false
    }
  },
  computed: {
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
      if (FIELDS_DECIMALS.includes(this.metadata.displayType)) {
        return 2
      }
      return undefined
    }
  },
  watch: {
    // enable to dataTable records
    valueModel(value) {
      if (this.metadata.inTable) {
        this.value = this.validateValue(value)
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        this.value = this.validateValue(value)
      }
    }
  },
  methods: {
    validateValue(value) {
      if (this.isEmptyValue(value) || isNaN(value)) {
        return undefined
      }
      return Number(value)
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
            this.value = this.validateValue(result)
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
            this.value = this.validateValue(result)
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
        const result = this.validateValue(this.valueToDisplay)
        this.preHandleChange(result)
      }
      this.clearVariables()
      this.isShowed = false
    }
  }
}
</script>

<style lang="scss">
  /* if is controls width 100% in container */
  .el-input-number, .el-input {
    width: 100% !important; /* ADempiere Custom */
  }

  /** Amount reference **/
  .display-type-amount {
    text-align: right !important;
    input, .el-input__inner {
      text-align: right !important;
    }
  }
</style>
