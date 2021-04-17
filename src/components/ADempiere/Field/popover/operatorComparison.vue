<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
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
