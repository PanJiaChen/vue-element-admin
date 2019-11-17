<template>
  <el-switch
    :ref="metadata.columnName"
    v-model="value"
    :inactive-text="$t('components.switchInactiveText')"
    :active-text="$t('components.switchActiveText')"
    true-value="true"
    false-value="false"
    :disabled="isDisabled"
    @change="preHandleChange"
  />
</template>

<script>
import { fieldIsDisplayed } from '@/utils/ADempiere'
import { FIELD_READ_ONLY_FORM } from '@/components/ADempiere/Field/references'
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

export default {
  name: 'FieldYesNo',
  mixins: [fieldMixin],
  data() {
    return {
      valuesReadOnly: [
        {
          columnName: 'IsActive',
          isReadOnlyValue: false
        }
      ]
    }
  },
  watch: {
    valueModel(value) {
      if (this.metadata.inTable) {
        this.value = Boolean(value)
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        this.value = Boolean(value)
      }
    },
    value(value, oldValue) {
      if (typeof value !== 'boolean') {
        this.value = Boolean(value)
      }
      this.preHandleChange('NotSend')
    }
  },
  mounted() {
    this.preHandleChange('NotSend') // activate logics
  },
  methods: {
    preHandleChange(value) {
      this.handleChange(value)
      if (!this.metadata.inTable && !this.metadata.isAdvancedQuery) {
        this.isReadOnlyForm(this.value)
      }
    },
    isReadOnlyForm(value) {
      var fieldReadOnlyForm = FIELD_READ_ONLY_FORM.find(item => item.columnName === this.metadata.columnName)
      // columnName: IsActive, Processed, Processing
      if (fieldReadOnlyForm && fieldIsDisplayed(this.metadata)) {
        this.$store.dispatch('changeFieldAttributesBoolean', {
          containerUuid: this.metadata.containerUuid,
          fieldsIncludes: [],
          attribute: 'isReadOnlyFromForm',
          valueAttribute: Boolean(fieldReadOnlyForm.valueIsReadOnlyForm !== value),
          // if isChangedAllForm it does not exclude anything, otherwise it excludes this columnName
          fieldsExcludes: fieldReadOnlyForm.isChangedAllForm ? [] : [this.metadata.columnName],
          currenValue: value
        })
      }
    }
  }
}
</script>
