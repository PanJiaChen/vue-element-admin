<template>
  <span v-if="fieldAttributes.isComparisonField">
    <el-popover
      ref="operatorComarison"
      placement="top"
      width="230"
      trigger="click"
    >
      <span class="custom-tittle-popover">
        {{ $t('operators.operator') }}:
      </span>
      <el-select
        v-model="value"
        @change="changeOperator"
      >
        <el-option
          v-for="(item, key) in fieldAttributes.operatorsList"
          :key="key"
          :value="item"
          :label="$t('operators.' + item)"
        />
      </el-select>
    </el-popover>
    <span v-popover:operatorComarison>
      {{ fieldAttributes.name }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'FieldOperatorComparison',
  props: {
    fieldAttributes: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      value: this.fieldAttributes.operator
    }
  },
  watch: {
    'fieldAttributes.operator'(newValue) {
      this.value = newValue
      if (!this.isEmptyValue(this.fieldAttributes.value) ||
        ['NULL', 'NOT_NULL'].includes(this.fieldAttributes.operator)) {
        this.handleChange(this.fieldAttributes.value)
      }
    }
  },
  methods: {
    changeOperator(operatorValue) {
      this.$store.dispatch('changeFieldAttribure', {
        containerUuid: this.fieldAttributes.containerUuid,
        columnName: this.fieldAttributes.columnName,
        isAdvancedQuery: true,
        attributeName: 'operator',
        attributeValue: operatorValue
      })
    },
    /**
     * @param {mixed} value, main value in component
     * @param {mixed} valueTo, used in end value in range
     * @param {string} label, or displayColumn to show in select
     */
    handleChange(value) {
      // const sendParameters = {
      //   parentUuid: this.fieldAttributes.parentUuid,
      //   containerUuid: this.fieldAttributes.containerUuid,
      //   field: this.fieldAttributes,
      //   panelType: this.fieldAttributes.panelType,
      //   columnName: this.fieldAttributes.columnName,
      //   newValue: value === 'NotSend' ? this.value : value,
      //   isAdvancedQuery: true,
      //   isSendToServer: !(value === 'NotSend'),
      //   isSendCallout: false
      // }
      // this.$store.dispatch('notifyFieldChange', {
      //   ...sendParameters,
      //   isChangedOldValue: this.fieldAttributes.componentPath === 'FieldYesNo' && Boolean(value === 'NotSend')
      // })
    }
  }
}
</script>
