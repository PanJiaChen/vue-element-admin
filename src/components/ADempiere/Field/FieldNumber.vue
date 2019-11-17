<template>
  <el-input-number
    :ref="metadata.columnName"
    v-model="value"
    type="number"
    :pattern="pattern"
    :min="minValue"
    :max="maxValue"
    :placeholder="metadata.help"
    :disabled="isDisabled"
    :precision="precision"
    controls-position="right"
    :class="'display-type-' + cssClass"
    @blur="validateInput"
    @change="preHandleChange"
  />
</template>

<script>
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

export default {
  name: 'FieldNumber',
  mixins: [fieldMixin],
  props: {
    validateInput: {
      type: Function,
      default: () => undefined
    }
  },
  data() {
    return {
      pattern: undefined,
      showControls: true
    }
  },
  computed: {
    maxValue() {
      if (!this.isEmptyValue(this.metadata.valueMax)) {
        return Number(this.metadata.valueMax)
      }
      return Infinity
    },
    minValue() {
      if (!this.isEmptyValue(this.metadata.valueMin)) {
        return Number(this.metadata.valueMin)
      }
      return -Infinity
    },
    cssClass() {
      return this.metadata.referenceType
        .split(/(?=[A-Z])/)
        .join('-').toLowerCase()
    },
    precision() {
      if (['Number', 'Amount'].includes()) {
        return 2
      }
      return undefined
    }
  },
  watch: {
    // enable to dataTable records
    valueModel(value) {
      if (this.metadata.inTable) {
        if (this.isEmptyValue(value)) {
          value = null
        }
        this.value = value
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        if (this.isEmptyValue(value)) {
          value = null
        }
        this.value = value
      }
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
  /* ADempiere Custom */
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 15px;
    padding-right: 50px;
    text-align: -webkit-right;
  }
</style>
