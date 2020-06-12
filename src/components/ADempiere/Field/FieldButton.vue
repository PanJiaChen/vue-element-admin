<template>
  <el-input
    :ref="metadata.columnName"
    v-model="value"
    type="hidden"
    @change="preHandleChange"
  />
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import fieldMixinText from '@/components/ADempiere/Field/mixin/mixinFieldText.js'

export default {
  name: 'FieldButton',
  mixins: [
    fieldMixin,
    fieldMixinText
  ]
}
</script>
