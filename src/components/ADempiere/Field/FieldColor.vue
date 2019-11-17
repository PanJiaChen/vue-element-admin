<template>
  <el-color-picker
    :ref="metadata.columnName"
    v-model="value"
    show-alpha
    :disabled="isDisabled"
    @change="preHandleChange"
  />
</template>

<script>
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

export default {
  name: 'FieldColor',
  mixins: [fieldMixin],
  watch: {
    valueModel(value) {
      if (this.metadata.inTable) {
        if (this.isEmptyValue(value)) {
          value = ''
        }
        this.value = String(value)
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        if (this.isEmptyValue(value)) {
          value = ''
        }
        this.value = String(value)
      }
    }
  }
}
</script>
