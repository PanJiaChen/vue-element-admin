<template>
  <el-color-picker
    :ref="metadata.columnName"
    v-model="value"
    show-alpha
    :disabled="isDisabled"
    :class="cssClassStyle"
    @change="preHandleChange"
  />
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import fieldMixinText from '@/components/ADempiere/Field/mixin/mixinFieldText.js'

export default {
  name: 'FieldColor',
  mixins: [
    fieldMixin,
    fieldMixinText
  ]
}
</script>
