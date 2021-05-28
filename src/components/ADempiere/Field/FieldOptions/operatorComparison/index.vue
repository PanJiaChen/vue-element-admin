<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <div class="operator-comparison">
    <span class="custom-tittle-popover">
      {{ $t('operators.compareSearch') }}:
    </span>
    <br>

    <el-select
      v-model="currentOperator"
      @change="changeOperator"
    >
      <el-option
        v-for="(itemOperator, key) in operatorsList"
        :key="key"
        :value="itemOperator"
        :label="$t('operators.' + itemOperator)"
      />
    </el-select>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'FieldOperatorComparison',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    const operatorsList = ref(props.fieldAttributes.operatorsList)

    const currentOperator = computed({
      get() {
        const { columnName, containerUuid } = props.fieldAttributes

        const { operator } = root.$store.getters.getFieldFromColumnName({
          containerUuid,
          columnName
        })

        return operator
      },
      set(newValue) {
        const { columnName, containerUuid } = props.fieldAttributes

        root.$store.dispatch('changeFieldAttribure', {
          containerUuid,
          columnName,
          attributeName: 'operator',
          attributeValue: newValue
        })
      }
    })

    const fieldValue = computed(() => {
      const { columnName, containerUuid, parentUuid } = props.fieldAttributes

      // main panel values
      return root.$store.getters.getValueOfField({
        parentUuid,
        containerUuid,
        columnName
      })
    })

    /**
     * @param {mixed} value, main value in component
     */
    const handleChange = (value) => {
      const { columnName, containerUuid } = props.fieldAttributes

      root.$store.dispatch('notifyFieldChange', {
        containerUuid,
        field: props.fieldAttributes,
        columnName,
        newValue: value
      })
    }

    /**
     * @param {string} operatorValue
     */
    const changeOperator = (operatorValue) => {
      const value = fieldValue.value
      if (!root.isEmptyValue(value) ||
        ['NULL', 'NOT_NULL'].includes(operatorValue)) {
        handleChange(value)
      }
    }

    return {
      currentOperator,
      operatorsList,
      changeOperator
    }
  }
})
</script>

<style scoped lang="scss">
.custom-tittle-popover {
  font-size: 14px;
  font-weight: bold;
  float: left;
}

.operator-comparison {
  margin: 10px;
  padding: 10px;
}
</style>
