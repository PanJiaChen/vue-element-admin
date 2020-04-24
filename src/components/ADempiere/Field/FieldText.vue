<template>
  <el-input
    :ref="metadata.columnName"
    v-model="value"
    :pattern="pattern"
    :rows="rows"
    :class="metadata.cssClassName"
    :type="typeTextBox"
    :placeholder="metadata.help"
    :readonly="Boolean(metadata.readonly)"
    :disabled="isDisabled"
    :maxlength="maxLength"
    :show-password="Boolean(metadata.isEncrypted)"
    :autofocus="metadata.inTable"
    @change="preHandleChange"
  />
</template>

<script>
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

export default {
  name: 'FieldText',
  mixins: [fieldMixin],
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
      if (this.metadata.referenceType === 'Text') {
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
  },
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
  },
  methods: {
    validateUrl(e) {
      // Entry pattern, in this case only accepts numbers and letters
      const _Pattern = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{1,5})+)(\/(.)*)?(\?(.)*)?/g
      var rex = RegExp(_Pattern)
      var value = e.target.value
      if (rex.test(value) && value.trim() !== '') {
        console.log('url good format')
      } else if (value.trim() === '') {
        console.log('url empty')
      } else {
        // e.target.focus()
        console.log('url wrong')
      }
    }
  }
}
</script>
