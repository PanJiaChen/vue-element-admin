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
  <!--
    this v-show is to indicate that if the field is not shown,
    therefore you should not leave the column size spacing of your
    <el-col></el-col> container-->
  <div v-if="!inTable">
    <el-col
      v-if="isDisplayed"
      key="is-panel-template"
      :xs="24"
      :sm="12"
      :md="8"
      :lg="8"
      :xl="8"
      :class="classField"
    >
      <el-form-item>
        <template slot="label">
          <field-options
            :metadata="fieldAttributes"
          />
        </template>

        <component
          :is="componentRender"
          :id="field.panelType !== 'form' ? field.columnName : ''"
          :ref="field.columnName"
          :metadata="fieldAttributes"
          :value-model="recordDataFields"
        />
      </el-form-item>
    </el-col>
  </div>
  <component
    :is="componentRender"
    v-else
    :id="field.panelType !== 'form' ? field.columnName : ''"
    key="is-table-template"
    :class="classField"
    :metadata="fieldAttributes"
    :value-model="recordDataFields"
    :in-table="true"
  />
</template>

<script>
import { evalutateTypeField, fieldIsDisplayed } from '@/utils/ADempiere/dictionaryUtils'
import FieldOptions from '@/components/ADempiere/Field/FieldOptions'

/**
 * This is the base component for linking the components according to the
 * reference (or type of visualization) of each field
 */
export default {
  name: 'FieldDefinition',

  components: {
    FieldOptions
  },

  props: {
    // receives the property that is an object with all the attributes
    metadataField: {
      type: Object,
      default: () => ({})
    },
    recordDataFields: {
      type: [Number, String, Boolean, Array, Object, Date],
      default: undefined
    },
    inGroup: {
      type: Boolean,
      default: false
    },
    inTable: {
      type: Boolean,
      default: false
    },
    isAdvancedQuery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      field: {}
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    // load the component that is indicated in the attributes of received property
    componentRender() {
      if (this.isEmptyValue(this.field.componentPath || !this.field.isSupported)) {
        return () => import('@/components/ADempiere/Field/FieldText')
      }
      if (this.isSelectCreated) {
        return () => import('@/components/ADempiere/Field/FieldSelectMultiple')
      }
      let field
      switch (this.field.componentPath) {
        case 'FieldAutocomplete':
          field = () => import('@/components/ADempiere/Field/FieldAutocomplete')
          break
        case 'FieldBinary':
          field = () => import('@/components/ADempiere/Field/FieldBinary')
          break
        case 'FieldButton':
          field = () => import('@/components/ADempiere/Field/FieldButton')
          break
        case 'FieldColor':
          field = () => import('@/components/ADempiere/Field/FieldColor')
          break
        case 'FieldDate':
          field = () => import('@/components/ADempiere/Field/FieldDate')
          break
        case 'FieldImage':
          field = () => import('@/components/ADempiere/Field/FieldImage')
          break
        case 'FieldLocation':
          field = () => import('@/components/ADempiere/Field/FieldLocation')
          break
        case 'FieldLocator':
          field = () => import('@/components/ADempiere/Field/FieldLocator')
          break
        case 'FieldNumber':
          field = () => import('@/components/ADempiere/Field/FieldNumber')
          break
        case 'FieldSelect':
          field = () => import('@/components/ADempiere/Field/FieldSelect')
          break
        case 'FieldText':
          field = () => import('@/components/ADempiere/Field/FieldText')
          break
        case 'FieldTextLong':
          field = () => import('@/components/ADempiere/Field/FieldTextLong')
          break
        case 'FieldTime':
          field = () => import('@/components/ADempiere/Field/FieldTime')
          break
        case 'FieldYesNo':
          field = () => import('@/components/ADempiere/Field/FieldYesNo')
          break
      }
      return field
    },
    fieldAttributes() {
      return {
        ...this.field,
        inTable: this.inTable,
        isPanelWindow: this.isPanelWindow,
        isAdvancedQuery: this.isAdvancedQuery,
        // DOM properties
        required: this.isMandatory,
        readonly: this.isReadOnly,
        displayed: this.isDisplayed,
        disabled: !this.field.isActive,
        isSelectCreated: this.isSelectCreated,
        placeholder: this.field.help ? this.field.help.slice(0, 40) + '...' : ''
      }
    },
    isDisplayed() {
      if (this.isAdvancedQuery) {
        return this.field.isShowedFromUser
      }
      return fieldIsDisplayed(this.field) &&
        (this.isMandatory || this.field.isShowedFromUser || this.inTable)
    },
    isMandatory() {
      if (this.isAdvancedQuery) {
        return false
      }
      return this.field.isMandatory || this.field.isMandatoryFromLogic
    },
    isPanelWindow() {
      return this.field.panelType === 'window'
    },
    preferenceClientId() {
      if (this.isPanelWindow) {
        return this.$store.getters.getPreferenceClientId
      }
      return undefined
    },
    /**
     * Idicate if field is read only
     * TODO: Create common method to evaluate isReadOnly
     */
    isReadOnly() {
      if (this.isAdvancedQuery) {
        if (['NULL', 'NOT_NULL'].includes(this.field.operator)) {
          return true
        }
        return false
      }

      if (!this.field.isActive) {
        return true
      }

      const isUpdateableAllFields = this.field.isReadOnly || this.field.isReadOnlyFromLogic

      if (this.isPanelWindow) {
        // TODO: Evaluate record uuid without route.action
        // edit mode is diferent to create new
        let isWithRecord = this.field.recordUuid !== 'create-new'
        // evaluate context
        if ((this.preferenceClientId !== this.metadataField.clientId) && isWithRecord) {
          return true
        }

        if (this.field.isAlwaysUpdateable) {
          return false
        }
        if (this.field.isProcessingContext || this.field.isProcessedContext) {
          return true
        }

        if (this.inTable) {
          isWithRecord = !this.isEmptyValue(this.field.recordUuid)
        }

        return (!this.field.isUpdateable && isWithRecord) ||
          (isUpdateableAllFields || this.field.isReadOnlyFromForm)
      } else if (this.field.panelType === 'browser') {
        if (this.inTable) {
          // browser result
          return this.field.isReadOnly
        }
        // query criteria
        return this.field.isReadOnlyFromLogic
      }
      // other type of panels (process/report)
      return Boolean(isUpdateableAllFields)
    },
    isFieldOnly() {
      if (this.inTable || this.field.isFieldOnly) {
        return undefined
      }
      return this.field.name
    },
    isSelectCreated() {
      return this.isAdvancedQuery &&
        ['IN', 'NOT_IN'].includes(this.field.operator) &&
        !['FieldBinary', 'FieldDate', 'FieldSelect', 'FieldYesNo'].includes(this.field.componentPath)
    },
    getWidth() {
      return this.$store.getters.getWidthLayout
    },
    classField() {
      if (this.inTable) {
        return 'in-table'
      }
      return ''
    },
  },
  watch: {
    metadataField(value) {
      this.field = value
    }
  },
  created() {
    // assined field with prop
    this.field = this.metadataField
    if (this.field.isCustomField && !this.field.componentPath) {
      let componentReference = evalutateTypeField(this.field.displayType)
      if (this.isEmptyValue(componentReference)) {
        componentReference = {
          componentPath: 'FieldText'
        }
      }
      this.field = {
        ...this.metadataField,
        isActive: true,
        isDisplayed: true,
        isDisplayedFromLogic: true,
        isShowedFromUser: true,
        //
        componentPath: componentReference.componentPath
      }
    }
  },
  methods: {
    focusField() {
      if (this.field.handleRequestFocus || (this.field.displayed && !this.field.readonly)) {
        this.$refs[this.field.columnName].requestFocus()
      }
    }
  }
}
</script>

<style lang="scss">
  /**
   * Separation between elements (item) of the form
   */
  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    // this.field.isShowedRecordNavigation
    margin-right: 10px;
  }

  /**
   * Maximum height to avoid distorting the field list
   */
  .el-form-item__content {
    max-height: 36px !important;
  }

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }

  .in-table {
    margin-bottom: 0px !important;
    margin-left: 0px;
    margin-right: 0px;
  }

  /**
   * Min height all text area, not into table
   */
  .el-textarea__inner:not(.in-table) {
    min-height: 36px !important;
    /*
    height: 36px auto !important;
    max-height: 54.2333px !important;
    */
  }

  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }
  .pre-formatted {
    white-space: pre;
  }
  .el-submenu__title {
    padding: 0;
  }
  .el-submenu .el-submenu__icon-arrow  {
    visibility: hidden;
  }
</style>
