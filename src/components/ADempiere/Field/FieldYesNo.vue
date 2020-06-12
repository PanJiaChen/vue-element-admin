<template>
  <el-switch
    :ref="metadata.columnName"
    v-model="value"
    :inactive-text="$t('components.switchInactiveText')"
    :active-text="$t('components.switchActiveText')"
    :class="cssClassStyle"
    :true-value="true"
    :false-value="false"
    :disabled="isDisabled"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
  />
</template>

<script>
import { fieldIsDisplayed } from '@/utils/ADempiere'
import { FIELDS_READ_ONLY_FORM } from '@/utils/ADempiere/references'
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { convertStringToBoolean } from '@/utils/ADempiere/valueFormat.js'

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
  computed: {
    cssClassStyle() {
      return this.metadata.cssClassName + ' custom-field-yes-no'
    }
  },
  methods: {
    parseValue(value) {
      return convertStringToBoolean(value)
    },
    preHandleChange(value) {
      this.handleFieldChange({ value })
      if (!this.metadata.inTable && !this.metadata.isAdvancedQuery) {
        this.isReadOnlyForm(this.value)
      }
    },
    isReadOnlyForm(value) {
      const fieldReadOnlyForm = FIELDS_READ_ONLY_FORM.find(item => item.columnName === this.metadata.columnName)
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

<style scoped>
  .custom-field-yes-no {
    max-height: 34px;
  }
</style>
