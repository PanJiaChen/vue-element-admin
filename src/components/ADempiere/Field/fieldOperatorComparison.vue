<template>
  <span>
    <el-popover
      ref="operatorComarison"
      placement="top"
      width="200"
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
          v-for="(item, key) in operatorsList"
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
import { FIELD_OPERATORS_LIST } from '@/utils/ADempiere/dataUtils'

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
  computed: {
    operatorsList() {
      const { conditionsList } = FIELD_OPERATORS_LIST.find(item => {
        return item.type === this.fieldAttributes.componentPath
      })
      return conditionsList
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
    changeOperator(value) {
      this.$store.dispatch('changeFieldAttribure', {
        containerUuid: this.fieldAttributes.containerUuid,
        columnName: this.fieldAttributes.columnName,
        isAdvancedQuery: true,
        attributeName: 'operator',
        attributeValue: value
      })
    },
    /**
     * @param {mixed} value, main value in component
     * @param {mixed} valueTo, used in end value in range
     * @param {string} label, or displayColumn to show in select
     */
    handleChange(value) {
      const sendParameters = {
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        field: this.fieldAttributes,
        panelType: this.fieldAttributes.panelType,
        columnName: this.fieldAttributes.columnName,
        newValue: value === 'NotSend' ? this.value : value,
        isAdvancedQuery: this.fieldAttributes.isAdvancedQuery,
        isSendToServer: !(value === 'NotSend' || this.fieldAttributes.isAdvancedQuery),
        isSendCallout: !(value === 'NotSend' || this.fieldAttributes.isAdvancedQuery)
      }

      this.$store.dispatch('notifyFieldChange', {
        ...sendParameters,
        isChangedOldValue: this.fieldAttributes.componentPath === 'FieldYesNo' && Boolean(value === 'NotSend')
      })
    }
  }
}
</script>
