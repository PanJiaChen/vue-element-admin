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
    :class="'time-base ' + metadata.cssClassName"
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
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

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
    }
  },
  watch: {
    valueModel(value) {
      if (this.metadata.inTable) {
        this.value = this.parsedDateValue(value)
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        this.value = this.parsedDateValue(value)
      }
    }
  },
  methods: {
    parsedDateValue(value) {
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
  .time-base {
    width: 100% !important;
  }
</style>
