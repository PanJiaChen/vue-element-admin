
<template>
  <!--
    this v-show is to indicate that if the field is not shown,
    therefore you should not leave the column size spacing of your
    <el-col></el-col> container-->
  <el-col
    v-if="!inTable"
    v-show="isDisplayed()"
    :xs="sizeFieldResponsive.xs"
    :sm="sizeFieldResponsive.sm"
    :md="sizeFieldResponsive.md"
    :lg="sizeFieldResponsive.lg"
    :xl="sizeFieldResponsive.xl"
    :class="classField"
  >
    <el-popover
      v-if="field.contextInfo && field.contextInfo.isActive"
      ref="contextOptions"
      placement="top"
      :title="$t('components.contextFieldTitle')"
      width="400"
      trigger="click"
    >
      <p v-html="field.contextInfo.messageText.msgText" />
    </el-popover>
    <el-form-item v-popover:contextOptions :label="isFieldOnly()" :required="isMandatory()">
      <component
        :is="componentRender"
        :ref="field.columnName"
        :metadata="{
          ...field,
          panelType: panelType,
          inTable: inTable,
          isAdvancedQuery: isAdvancedQuery,
          // DOM properties
          required: isMandatory(),
          readonly: isReadOnly(),
          displayed: isDisplayed(),
          disabled: !field.isActive
        }"
        :value-model="recordDataFields"
      />
    </el-form-item>
  </el-col>
  <component
    :is="componentRender"
    v-else
    :class="classField"
    :metadata="{
      ...field,
      panelType: panelType,
      inTable: inTable,
      // DOM properties
      required: isMandatory(),
      readonly: isReadOnly(),
      disabled: !field.isActive
    }"
    :value-model="recordDataFields"
  />
</template>

<script>
import { FIELD_ONLY } from '@/components/ADempiere/Field/references'
import { DEFAULT_SIZE } from '@/components/ADempiere/Field/fieldSize'
import { fieldIsDisplayed } from '@/utils/ADempiere'

/**
 * This is the base component for linking the components according to the
 * reference (or type of visualization) of each field
 */
export default {
  name: 'Field',
  props: {
    parentUuid: {
      type: String,
      default: ''
    },
    containerUuid: {
      type: String,
      default: ''
    },
    metadataUuid: {
      type: String,
      default: undefined
    },
    panelType: {
      type: String,
      default: 'window'
    },
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
      return () => import(`@/components/ADempiere/Field/${this.field.componentPath}`)
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
    getterIsShowedRecordNavigation() {
      if (this.panelType === 'window') {
        return this.$store.getters.getIsShowedRecordNavigation(this.parentUuid)
      }
      return false
    },
    sizeFieldResponsive() {
      if (!this.isDisplayed()) {
        return DEFAULT_SIZE
      }

      const sizeField = this.field.sizeFieldFromType.size
      var newSizes = {}

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

      if (this.panelType === 'window') {
        if (this.field.componentPath === 'FieldTextLong') {
          return sizeField
        }
        // two columns if is mobile or desktop and show record navigation
        if (this.getWidth <= 768 || (this.getWidth >= 768 && this.getterIsShowedRecordNavigation)) {
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
    getterContextProcessing() {
      const processing = this.$store.getters.getContextProcessing(this.parentUuid)
      if (processing === true || processing === 'Y') {
        return true
      }
      return false
    },
    getterContextProcessed() {
      const processed = this.$store.getters.getContextProcessed(this.parentUuid)
      if (processed === true || processed === 'Y') {
        return true
      }
      return false
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
  },
  methods: {
    isDisplayed() {
      if (this.isAdvancedQuery) {
        return this.field.isShowedFromUser
      }
      return fieldIsDisplayed(this.field) && (this.isMandatory() || this.field.isShowedFromUser || this.inTable)
    },
    isReadOnly() {
      if (this.isAdvancedQuery) {
        return false
      }
      if (!this.field.isActive) {
        return true
      }

      const isUpdateableAllFields = this.field.isReadOnly || this.field.isReadOnlyFromLogic

      if (this.panelType === 'window') {
        if (this.field.isAlwaysUpdateable) {
          return false
        }
        if (this.getterContextProcessing) {
          return true
        }
        if (this.getterContextProcessed) {
          return true
        }

        // edit mode is diferent to create new
        const editMode = (!this.inTable && this.field.optionCRUD !== 'create-new') || (this.inTable && !this.isEmptyValue(this.field.recordUuid))
        return (!this.field.isUpdateable && editMode) || (isUpdateableAllFields || this.field.isReadOnlyFromForm)
      }
      if (this.panelType === 'browser') {
        if (this.inTable) {
          // browser result
          return this.field.isReadOnly
        }
        // query criteria
        return this.field.isReadOnlyFromLogic
      }
      // other type of panels (process/report)
      return isUpdateableAllFields
    },
    isMandatory() {
      if (this.isAdvancedQuery) {
        return false
      }
      return this.field.isMandatory || this.field.isMandatoryFromLogic
    },
    isFieldOnly() {
      if (this.inTable || this.field.isFieldOnly || this.verifyIsFieldOnly(this.field.displayType)) {
        return undefined
      }
      return this.field.name
    },
    /**
     * TODO: Evaluate the current field with the only fields contained in the
     * constant FIELD_ONLY
     * @param  {integer} id [identifier of the type of isDisplayed]
     * @return {boolean}
     */
    verifyIsFieldOnly(type) {
      const field = FIELD_ONLY.find(itemField => {
        if (type === itemField.id) {
          return true
        }
      })
      return Boolean(field)
    },
    focus(columnName) {
      if (this.isDisplayed() && this.isMandatory() && !this.isReadOnly()) {
        this.$refs[columnName].activeFocus(columnName)
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
    margin-right: 10px;
  }
  .in-table {
    margin-bottom: 0px !important;
    margin-left: 0px;
    margin-right: 0px;
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
</style>
