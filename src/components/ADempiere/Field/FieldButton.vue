<template>
  <el-input
    :ref="metadata.columnName"
    v-model="value"
    type="hidden"
    @change="preHandleChange"
  />
</template>

<script>
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

export default {
  name: 'FieldButton',
  mixins: [fieldMixin],
  watch: {
    valueModel(value) {
      if (this.metadata.inTable) {
        this.value = String(value)
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        this.value = String(value)
      }
    }
  }
}
</script>
