<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-switch
    :ref="metadata.columnName"
    v-model="value"
    :active-text="value ? $t('components.switchActiveText') : $t('components.switchInactiveText')"
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
import { COLUMNS_READ_ONLY_FORM } from '@/utils/ADempiere/references'
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { convertStringToBoolean } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'FieldYesNo',
  mixins: [
    fieldMixin
  ],
  computed: {
    cssClassStyle() {
      let styleClass = ' custom-field-yes-no '
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    },
    columnReadOnlyForm() {
      return COLUMNS_READ_ONLY_FORM.find(item => {
        return item.columnName === this.metadata.columnName
      })
    }
  },
  mounted() {
    if (!this.isEmptyValue(this.columnReadOnlyForm)) {
      this.isReadOnlyForm(this.value)
    }
  },
  methods: {
    parseValue(value) {
      return convertStringToBoolean(value)
    },
    preHandleChange(value) {
      this.metadata.value = value
      this.handleFieldChange({ value })
      if (!this.metadata.inTable && !this.metadata.isAdvancedQuery) {
        this.isReadOnlyForm(this.value)
      }
    },
    isReadOnlyForm(value) {
      const fieldReadOnlyForm = this.columnReadOnlyForm

      // columnName: IsActive, Processed, Processing
      if (!this.isEmptyValue(fieldReadOnlyForm) && fieldIsDisplayed(this.metadata)) {
        const fieldsExcludes = []
        // if isChangedAllForm it does not exclude anything, otherwise it excludes this columnName
        if (!fieldReadOnlyForm.isChangedAllForm) {
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
