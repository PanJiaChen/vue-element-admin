<template>
  <!--
    this v-show is to indicate that if the field is not shown,
    therefore you should not leave the column size spacing of your
    <el-col></el-col> container-->
  <div v-if="!inTable">
    <el-col
      v-if="isDisplayed"
      key="is-panel-template"
      :xs="sizeFieldResponsive.xs"
      :sm="sizeFieldResponsive.sm"
      :md="sizeFieldResponsive.md"
      :lg="sizeFieldResponsive.lg"
      :xl="sizeFieldResponsive.xl"
      :class="classField"
    >
      <el-form-item
        :required="isMandatory"
      >
        <template slot="label">
          <operator-comparison
            v-if="field.isComparisonField"
            key="is-field-operator-comparison"
            :field-attributes="fieldAttributes"
            :field-value="field.value"
          />
          <context-info
            v-else-if="isContextInfo"
            key="is-field-context-info"
            :field-attributes="fieldAttributes"
            :field-value="field.value"
          />
          <span v-else key="is-field-name">
            {{ isFieldOnly }}
          </span>

          <document-status
            v-if="isDocuemntStatus"
            :field="fieldAttributes"
          />

          <translated
            v-if="field.isTranslatedField"
            :field-attributes="fieldAttributes"
            :record-uuid="field.recordUuid"
          />

          <calculator
            v-if="field.isNumericField && !field.isReadOnlyFromLogic"
            :field-attributes="fieldAttributes"
            :field-value="recordDataFields"
          />
        </template>

        <component
          :is="componentRender"
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
    key="is-table-template"
    :class="classField"
    :metadata="fieldAttributes"
    :value-model="recordDataFields"
    :in-table="true"
  />
</template>

<script>
import contextInfo from '@/components/ADempiere/Field/popover/contextInfo'
import documentStatus from '@/components/ADempiere/Field/popover/documentStatus'
import operatorComparison from '@/components/ADempiere/Field/popover/operatorComparison'
import translated from '@/components/ADempiere/Field/popover/translated'
import calculator from '@/components/ADempiere/Field/popover/calculator'
import { DEFAULT_SIZE } from '@/utils/ADempiere/references'
import { evalutateTypeField, fieldIsDisplayed } from '@/utils/ADempiere/dictionaryUtils'
import { LOG_COLUMNS_NAME_LIST } from '@/utils/ADempiere/dataUtils.js'

/**
 * This is the base component for linking the components according to the
 * reference (or type of visualization) of each field
 */
export default {
  name: 'FieldDefinition',
  components: {
    contextInfo,
    documentStatus,
    operatorComparison,
    translated,
    calculator
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
      // return () => import(`@/components/ADempiere/Field/${this.field.componentPath}`)
    },
    fieldAttributes() {
      return {
        ...this.field,
        inTable: this.inTable,
        isAdvancedQuery: this.isAdvancedQuery,
        // DOM properties
        required: this.isMandatory,
        readonly: this.isReadOnly,
        displayed: this.isDisplayed,
        disabled: !this.field.isActive,
        isSelectCreated: this.isSelectCreated
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

      // records in columns manage by backend
      const isLogColumns = LOG_COLUMNS_NAME_LIST.includes(this.field.columnName)

      const isUpdateableAllFields = this.field.isReadOnly || this.field.isReadOnlyFromLogic

      if (this.field.panelType === 'window') {
        if (isLogColumns) {
          return true
        }

        if (this.field.isAlwaysUpdateable) {
          return false
        }
        if (this.field.isProcessingContext || this.field.isProcessedContext) {
          return true
        }

        // TODO: Evaluate record uuid without route.action
        // edit mode is diferent to create new
        let isWithRecord = this.field.recordUuid !== 'create-new'
        if (this.inTable) {
          isWithRecord = !this.isEmptyValue(this.field.recordUuid)
        }

        return (!this.field.isUpdateable && isWithRecord) ||
          (isUpdateableAllFields || this.field.isReadOnlyFromForm)
      } else if (this.field.panelType === 'browser') {
        if (this.inTable) {
          // browser result
          return this.field.isReadOnly || isLogColumns
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
    sizeFieldResponsive() {
      if (!this.isDisplayed) {
        return DEFAULT_SIZE
      }

      let sizeField = {}
      if (this.field.size) {
        // set field size property
        sizeField = this.field.size
      }
      if (this.isEmptyValue(sizeField)) {
        // set default size
        sizeField = DEFAULT_SIZE
      }

      const newSizes = {}

      // in table set max width, used by browser result and tab children of window
      if (this.inTable) {
        newSizes.xs = 24
        newSizes.sm = 24
        newSizes.md = 24
        newSizes.lg = 24
        newSizes.xl = 24
        return newSizes
      }
      if (this.isAdvancedQuery) {
        newSizes.xs = 24
        newSizes.sm = 24
        newSizes.md = 12
        newSizes.lg = 12
        newSizes.xl = 12
        return newSizes
      }

      if (this.field.panelType === 'window') {
        // TODO: Add FieldYesNo and name.length > 12 || 14
        if (this.field.componentPath === 'FieldTextLong') {
          return sizeField
        }
        // two columns if is mobile or desktop and show record navigation
        if (this.getWidth <= 768 || (this.getWidth >= 768 && this.field.isShowedRecordNavigation)) {
          newSizes.xs = 12
          newSizes.sm = 12
          newSizes.md = 12
          newSizes.lg = 12
          newSizes.xl = 12
          return newSizes
        } else if (this.inGroup && this.getWidth >= 992) {
          newSizes.xs = sizeField.xs
          newSizes.sm = sizeField.sm * 2
          if (this.getWidth <= 1199) {
            newSizes.md = sizeField.md
          } else {
            newSizes.md = sizeField.md * 2
          }
          if (this.field.groupAssigned !== '') {
            newSizes.lg = sizeField.lg * 2
            newSizes.xl = sizeField.xl * 2
          } else {
            newSizes.lg = sizeField.lg
            newSizes.xl = sizeField.xl
          }
          return newSizes
        }
        return sizeField
      }
      return sizeField
    },
    processOrderUuid() {
      return this.$store.getters.getOrders
    },
    isDocuemntStatus() {
      if (this.field.panelType === 'window' && !this.isAdvancedQuery) {
        if (this.field.columnName === 'DocStatus' && !this.isEmptyValue(this.processOrderUuid)) {
          return true
        }
      }
      return false
    },
    isContextInfo() {
      if (this.field.panelType !== 'window') {
        return false
      }
      return Boolean(this.field.contextInfo && this.field.contextInfo.isActive) ||
        Boolean(this.field.reference && this.field.reference.zoomWindows.length)
    }
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
  .custom-tittle-popover {
    font-size: 14px;
    font-weight: bold;
    float: left;
  }

  /**
   * Separation between elements (item) of the form
   */
  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 10px;
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
  .el-textarea {
    position: relative;
    display: contents;
    width: 100%;
    vertical-align: bottom;
  }
  /* Global Styles */
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
</style>
