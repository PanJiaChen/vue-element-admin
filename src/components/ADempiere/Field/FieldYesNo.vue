<template>
  <el-switch
    :ref="metadata.columnName"
    v-model="value"
    :inactive-text="$t('components.switchInactiveText')"
    :active-text="$t('components.switchActiveText')"
    class="custom-field-yes-no"
    :true-value="true"
    :false-value="false"
    :disabled="isDisabled"
    @change="preHandleChange"
  />
</template>

<script>
import { fieldIsDisplayed } from '@/utils/ADempiere'
import { FIELD_READ_ONLY_FORM } from '@/utils/ADempiere/references'
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
        if (value === 'N' || value === 'n') {
          value = false
        }
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
      const fieldReadOnlyForm = FIELD_READ_ONLY_FORM.find(item => item.columnName === this.metadata.columnName)
      // columnName: IsActive, Processed, Processing
      if (fieldReadOnlyForm && fieldIsDisplayed(this.metadata)) {
        const fieldsExcludes = []
        // if isChangedAllForm it does not exclude anything, otherwise it excludes this columnName
        if (fieldReadOnlyForm.isChangedAllForm) {
          fieldsExcludes.push(this.metadata.columnName)
        }

        this.$store.dispatch('changeFieldAttributesBoolean', {
          containerUuid: this.metadata.containerUuid,
          fieldsIncludes: [],
          attribute: 'isReadOnlyFromForm',
          valueAttribute: Boolean(fieldReadOnlyForm.valueIsReadOnlyForm !== value),
          fieldsExcludes,
          currenValue: value
        })
      }
    }
  }
}
</script>

<style>
 .custom-field-yes-no {
   min-height: 34px;
 }
</style>
