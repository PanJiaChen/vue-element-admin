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
      :controls="isShowControls"
      :controls-position="controlsPosition"
      :class="cssClassStyle"
      @change="preHandleChange"
      @blur="focusLost"
      @focus="focusGained"
      @keydown.native="keyPressed"
      @keyup.native="keyReleased"
    />
  </el-tooltip>
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { FIELDS_DECIMALS } from '@/utils/ADempiere/references'

export default {
  name: 'FieldNumber',
  mixins: [fieldMixin],
  data() {
    return {
      showControls: true,
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
      if (FIELDS_DECIMALS.includes(this.metadata.displayType)) {
        return 2
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
    }
  },
  methods: {
    parseValue(value) {
      if (this.isEmptyValue(value)) {
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
