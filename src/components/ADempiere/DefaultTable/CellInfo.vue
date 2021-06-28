<template>
  <el-tag
    v-if="isDocumentStatus"
    key="document-status"
    :type="documentStatus"
    disable-transitions
  >
    {{ displayedValue }}
  </el-tag>

  <span v-else key="info-value">
    {{ displayedValue }}
  </span>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import { COLUMNS_NAME_DOCUMENT_STATUS, FIELDS_CURRENCY } from '@/utils/ADempiere/references.js'
import { typeValue } from '@/utils/ADempiere/valueUtils.js'
import {
  formatField, formatPrice, formatQuantity, convertBooleanToTranslationLang
} from '@/utils/ADempiere/valueFormat.js'

export default defineComponent({
  name: 'CellInfo',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    dataRow: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, { root }) {
    const { columnName } = props.fieldAttributes
    const fieldValue = props.dataRow[columnName]

    const isDocumentStatus = computed(() => {
      return COLUMNS_NAME_DOCUMENT_STATUS.includes(columnName)
    })

    const displayedValue = computed(() => {
      return formatValue(props.dataRow, props.fieldAttributes)
    })

    const documentStatus = computed(() => {
      return root.tagStatus(fieldValue)
    })

    const formatNumber = ({ displayType, value }) => {
      if (root.isEmptyValue(value)) {
        value = 0
      }
      // Amount, Costs+Prices
      if (FIELDS_CURRENCY.includes(displayType)) {
        return formatPrice(value)
      }
      return formatQuantity(value)
    }

    /**
     * @param {object} row, row data
     * @param {object} field, field with attributes
     */
    const formatValue = (row, field) => {
      const { componentPath, displayColumnName, displayType } = field

      let valueToShow
      switch (componentPath) {
        case 'FieldDate':
        case 'FieldTime': {
          let cell = fieldValue
          if (typeValue(cell) === 'DATE') {
            cell = cell.getTime()
          }
          // replace number timestamp value for date
          valueToShow = formatField(cell, displayType)
          break
        }

        case 'FieldNumber':
          if (root.isEmptyValue(fieldValue)) {
            valueToShow = undefined
            break
          }
          valueToShow = formatNumber({
            displayType,
            value: fieldValue
          })
          break

        case 'FieldSelect':
          valueToShow = row[displayColumnName]
          if (root.isEmptyValue(valueToShow) && fieldValue === 0) {
            valueToShow = field.defaultValue
            break
          }
          break

        case 'FieldYesNo':
          // replace boolean true-false value for 'Yes' or 'Not' ('Si' or 'No' for spanish)
          valueToShow = convertBooleanToTranslationLang(fieldValue)
          break

        default:
          valueToShow = fieldValue
          break
      }

      return valueToShow
    }

    return {
      // computeds
      isDocumentStatus,
      documentStatus,
      displayedValue
    }
  }
})
</script>
