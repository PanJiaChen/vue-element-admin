<template>
  <el-tooltip v-model="isShowed" :manual="true" :content="valueToDisplay" placement="top" effect="light">
    <el-input-number
      :ref="metadata.columnName"
      v-model="value"
      v-shortkey="['enter']"
      type="number"
      :min="minValue"
      :max="maxValue"
      :placeholder="metadata.help"
      :disabled="isDisabled"
      :precision="precision"
      controls-position="right"
      :class="'display-type-' + cssClass"
      @change="preHandleChange"
      @shortkey.native="changeValue"
      @blur="changeValue"
      @keydown.native="calculateValue"
    />
  </el-tooltip>
</template>

<script>
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'
import { FIELDS_FLOATS } from '@/components/ADempiere/Field/references'

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
      expression: /[^\d\/.()%\*\+\-]/gim,
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
    cssClass() {
      return this.metadata.referenceType
        .split(/(?=[A-Z])/)
        .join('-').toLowerCase()
    },
    precision() {
      // Amount, Costs+Prices, Number
      if (FIELDS_FLOATS.includes(this.metadata.referenceType)) {
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
      const result = this.calculationValue(this.value, event)
      if (!this.isEmptyValue(result)) {
        this.valueToDisplay = result
        this.isShowed = true
      } else {
        this.valueToDisplay = '...'
        this.isShowed = true
      }
    },
    changeValue() {
      const result = this.validateValue(this.valueToDisplay)
      this.$store.dispatch('notifyFieldChange', {
        isAdvancedQuery: this.metadata.isAdvancedQuery,
        panelType: this.metadata.panelType,
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        newValue: result,
        field: this.metadata,
        isChangedOldValue: true
      })
        .finally(() => {
          this.clearVariables()
          this.isShowed = false
        })
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
