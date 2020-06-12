<template>
  <el-input
    :ref="metadata.columnName"
    v-model="value"
    :pattern="pattern"
    :rows="rows"
    :class="cssClassStyle"
    :type="typeTextBox"
    :placeholder="metadata.help"
    :readonly="Boolean(metadata.readonly)"
    :disabled="isDisabled"
    :maxlength="maxLength"
    :show-password="Boolean(metadata.isEncrypted)"
    :autofocus="metadata.inTable"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
    @keydown.native="keyPressed"
    @keyup.native="keyReleased"
    @keyup.native.enter="actionKeyPerformed"
  />
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import fieldMixinText from '@/components/ADempiere/Field/mixin/mixinFieldText.js'
import { TEXT } from '@/utils/ADempiere/references'

export default {
  name: 'FieldText',
  mixins: [
    fieldMixin,
    fieldMixinText
  ],
  props: {
    inTable: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      patternFileName: '[A-Za-zñÑ0-9-_]{1,}',
      patternFilePath: '[A-Za-zñÑ0-9-_/.]{1,}'
    }
  },
  computed: {
    // Only used when input type='TextArea'
    rows() {
      if (this.metadata.inTable) {
        return 1
      }
      return 4
    },
    typeTextBox() {
      // String, Url, FileName...
      let typeInput = 'text'
      // Display Type 'Text' (14)
      if (this.metadata.displayType === TEXT.id) {
        typeInput = 'textarea'
      }
      if (this.metadata.isEncrypted) {
        typeInput = 'password'
      }
      return typeInput
    },
    maxLength() {
      if (!this.isEmptyValue(this.metadata.fieldLength) && this.metadata.fieldLength > 0) {
        return Number(this.metadata.fieldLength)
      }
      return undefined
    }
  }
}
</script>
