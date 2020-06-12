<template>
  <el-time-picker
    :ref="metadata.columnName"
    v-model="value"
    :picker-options="{
      minTime: minValue,
      maxTime: maxValue
    }"
    :is-range="isPickerRange"
    range-separator="-"
    :placeholder="$t('components.timePlaceholder')"
    :class="cssClassStyle"
    :readonly="Boolean(metadata.readonly)"
    :disabled="isDisabled"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
    @keydown.native="keyPressed"
    @keyup.native="keyReleased"
  />
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'

export default {
  name: 'FieldTime',
  mixins: [fieldMixin],
  computed: {
    isPickerRange() {
      if (this.metadata.isRange && !this.metadata.inTable) {
        return true
      }
      return false
    },
    maxValue() {
      if (!this.isEmptyValue(this.metadata.valueMax)) {
        return Number(this.metadata.valueMax)
      }
      return Infinity
    },
    minValue() {
      if (!this.isEmptyValue(this.metadata.valueMin)) {
        return Number(this.metadata.valueMin)
      }
      return -Infinity
    },
    cssClassStyle() {
      return this.metadata.cssClassName + ' custom-field-time'
    }
  },
  methods: {
    parseValue(value) {
      if (typeof value === 'number') {
        value = new Date(value).toUTCString()
      }
      if (this.isEmptyValue(value)) {
        value = undefined
      }
      return value
    }
  }
}
</script>

<style scoped>
  .custom-field-time {
    width: 100% !important;
  }
</style>
