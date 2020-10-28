<template>
  <el-select
    v-model="value"
    multiple
    filterable
    allow-create
    :placeholder="metadata.help"
    :class="'custom-field-select custom-field-select-multiple ' + metadata.cssClassName"
    @change="preHandleChange"
  >
    <el-option
      v-for="(option, key) in value"
      :key="key"
      :value="option"
    />
  </el-select>
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'

/**
 * This component is a list type field, for IN and NOT IN search with advanced query
 */
export default {
  name: 'FieldSelectMultiple',
  mixins: [
    fieldMixin
  ]
}
</script>
