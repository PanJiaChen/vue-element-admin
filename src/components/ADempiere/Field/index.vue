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
      :xs="sizeFieldResponsive.xs"
      :sm="sizeFieldResponsive.sm"
      :md="sizeFieldResponsive.md"
      :lg="sizeFieldResponsive.lg"
      :xl="sizeFieldResponsive.xl"
      :class="classField"
    >
      <el-form-item>
        <template slot="label">
          <el-dropdown
            v-if="isMobile"
            size="mini"
            :hide-on-click="true"
            trigger="click"
            :style="isMobile ? 'text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:'+labelStyle+'%' : ''"
            @command="handleCommand"
            @click="false"
          >
            <div :style="isMobile ? 'display: flex;width: auto;' : 'display: block;'">
              <span :style="isMandatory && isEmptyValue(valueField) ? 'border: aqua; color: #f34b4b' : 'border: aqua;'">
                <span key="is-field-name">
                  {{ field.name }}
                </span>
              </span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <template
                v-for="(option, key) in optionField"
              >
                <el-dropdown-item
                  v-if="option.enabled"
                  :key="key"
                  :command="option"
                  :divided="true"
                >
                  <el-popover
                    v-if="!isMobile"
                    placement="top"
                    trigger="click"
                    style="padding: 0px;"
                  >
                    <component
                      :is="optionFieldFComponentRender"
                      v-if="visibleForDesktop"
                      :field-attributes="contextMenuField.fieldAttributes"
                      :source-field="contextMenuField.fieldAttributes"
                      :field-value="contextMenuField.valueField"
                    />
                    <el-button slot="reference" type="text" style="color: #606266;">
                      <div class="contents">
                        <div v-if="!option.svg" style="margin-right: 5%;padding-top: 3%;">
                          <i :class="option.icon" style="font-weight: bolder;" />
                        </div>
                        <div v-else style="margin-right: 5%">
                          <svg-icon :icon-class="option.icon" style="margin-right: 5px;" />
                        </div>
                        <div>
                          <span class="contents">
                            <b class="label">
                              {{ option.name }}
                            </b>
                          </span>
                        </div>
                      </div>
                    </el-button>
                  </el-popover>
                  <div v-if="isMobile" class="contents">
                    <div v-if="!option.svg" style="margin-right: 5%;padding-top: 3%;">
                      <i :class="option.icon" style="font-weight: bolder;" />
                    </div>
                    <div v-else style="margin-right: 5%">
                      <svg-icon :icon-class="option.icon" style="margin-right: 5px;" />
                    </div>
                    <div>
                      <span class="contents">
                        <b class="label">
                          {{ option.name }}
                        </b>
                      </span>
                    </div>
                  </div>
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <el-menu v-else class="el-menu-demo" mode="horizontal" :unique-opened="true" style="z-index: 0" :menu-trigger="triggerMenu" @open="handleOpen" @close="handleClose" @select="handleSelect">
            <el-submenu index="menu">
              <template slot="title">
                <div :style="isMobile ? 'display: flex;width: auto;' : 'display: block;'">
                  <span :style="isMandatory && isEmptyValue(valueField) ? 'border: aqua; color: #f34b4b' : 'border: aqua;'">
                    <span key="is-field-name">
                      {{ field.name }}
                    </span>
                  </span>
                </div>
              </template>
              <el-menu-item
                v-for="(option, key) in listOption"
                :key="key"
                :index="option.name"
              >
                <el-popover
                  v-if="!isMobile"
                  placement="top"
                  width="400"
                  trigger="click"
                  style="padding: 0px;"
                  :hide="visibleForDesktop"
                >
                  <component
                    :is="optionFieldFComponentRender"
                    v-if="visibleForDesktop"
                    :field-attributes="contextMenuField.fieldAttributes"
                    :source-field="contextMenuField.fieldAttributes"
                    :field-value="contextMenuField.valueField"
                  />
                  <el-button slot="reference" type="text" style="color: #606266;">
                    <div class="contents">
                      <div
                        v-if="!option.svg"
                        style="margin-right: 5%;padding-top: 3%;"
                      >
                        <i :class="option.icon" style="font-weight: bolder;" />
                      </div>
                      <div v-else style="margin-right: 5%;; padding-left: 2%;">
                        <svg-icon :icon-class="option.icon" style="margin-right: 5px;" />
                      </div>
                      <div>
                        <span class="contents">
                          <b class="label">
                            {{ option.name }}
                          </b>
                        </span>
                      </div>
                    </div>
                  </el-button>
                </el-popover>
                <div v-if="false" class="contents">
                  <div v-if="!option.svg" style="margin-right: 5%;padding-top: 3%;">
                    <i :class="option.icon" style="font-weight: bolder;" />
                  </div>
                  <div v-else style="margin-right: 5%">
                    <svg-icon :icon-class="option.icon" style="margin-right: 5px;" />
                  </div>
                  <div>
                    <span class="contents">
                      <b class="label">
                        {{ option.name }}
                      </b>
                    </span>
                  </div>
                </div>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </template>
        <el-popover
          v-if="openOptionField && !isEmptyValue(optionColumnName) && (optionColumnName === field.columnName) && showPopoverPath"
          v-model="openOptionField"
          placement="top-start"
          width="400"
          trigger="click"
        >
          <component
            :is="optionFieldFComponentRender"
            :field-attributes="fieldAttributes"
            :source-field="fieldAttributes"
            :field-value="valueField"
          />
          <el-button slot="reference" type="text" :disabled="true" @click="openOptionField = !openOptionField" />
        </el-popover>
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
import documentStatus from '@/components/ADempiere/Field/popover/documentStatus'
import operatorComparison from '@/components/ADempiere/Field/popover/operatorComparison'
import { DEFAULT_SIZE } from '@/utils/ADempiere/references'
import { evalutateTypeField, fieldIsDisplayed } from '@/utils/ADempiere/dictionaryUtils'
import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'

/**
 * This is the base component for linking the components according to the
 * reference (or type of visualization) of each field
 */
export default {
  name: 'FieldDefinition',
  components: {
    documentStatus,
    operatorComparison
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
      field: {},
      visibleForDesktop: false,
      triggerMenu: 'click',
      showPopoverPath: false,
      optionColumnName: this.$route.query.fieldColumnName
    }
  },
  computed: {
    // load the component that is indicated in the attributes of received property
    labelStyle() {
      if (this.field.name.length >= 25) {
        return '35'
      } else if (this.field.name.length >= 20) {
        return '50'
      }
      return '110'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    contextMenuField() {
      return this.$store.getters.getFieldContextMenu
    },
    panelContextMenu() {
      return this.$store.state.contextMenu.isShowRightPanel
    },
    optionFieldFComponentRender() {
      let component
      const option = this.optionField.find(option => this.$route.query.typeAction === option.name)
      const nameComponent = this.isEmptyValue(option) ? this.contextMenuField.name : this.$route.query.typeAction
      switch (nameComponent) {
        case this.$t('field.info'):
          component = () => import('@/components/ADempiere/Field/contextMenuField/contextInfo')
          break
        case this.$t('language'):
          component = () => import('@/components/ADempiere/Field/contextMenuField/translated/index')
          break
        case this.$t('field.calculator'):
          component = () => import('@/components/ADempiere/Field/contextMenuField/calculator')
          break
        case this.$t('field.preference'):
          component = () => import('@/components/ADempiere/Field/contextMenuField/preference/index')
          break
        case this.$t('field.logsField'):
          component = () => import('@/components/ADempiere/Field/contextMenuField/changeLogs/index')
          break
      }
      return component
    },
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

      if (this.isPanelWindow) {
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
      if (this.isPanelWindow && !this.isAdvancedQuery) {
        if (this.field.columnName === 'DocStatus' && !this.isEmptyValue(this.processOrderUuid)) {
          return true
        }
      }
      return false
    },
    isContextInfo() {
      if (!this.isPanelWindow) {
        return false
      }
      return Boolean(this.field.contextInfo && this.field.contextInfo.isActive) ||
        Boolean(this.field.reference && this.field.reference.zoomWindows.length)
    },
    optionField() {
      return [
        {
          name: this.$t('field.info'),
          enabled: true,
          fieldAttributes: this.fieldAttributes,
          svg: false,
          icon: 'el-icon-info'
        },
        {
          name: this.$t('table.ProcessActivity.zoomIn'),
          enabled: this.isContextInfo,
          fieldAttributes: this.fieldAttributes,
          svg: false,
          icon: 'el-icon-files'
        },
        {
          name: this.$t('language'),
          enabled: this.field.isTranslatedField,
          fieldAttributes: this.fieldAttributes,
          svg: true,
          icon: 'language'
        },
        {
          name: this.$t('field.calculator'),
          enabled: this.field.isNumericField,
          fieldAttributes: this.fieldAttributes,
          recordDataFields: this.recordDataFields,
          valueField: this.valueField,
          svg: false,
          icon: 'el-icon-s-operation'
        },
        {
          name: this.$t('field.preference'),
          enabled: true,
          fieldAttributes: this.fieldAttributes,
          valueField: this.valueField,
          svg: false,
          icon: 'el-icon-notebook-2'
        },
        {
          name: this.$t('field.logsField'),
          enabled: true,
          fieldAttributes: this.fieldAttributes,
          valueField: this.valueField,
          svg: true,
          icon: 'tree-table'
        }
      ]
    },
    listOption() {
      return this.optionField.filter(option => option.enabled)
    },
    permissionRoutes() {
      return this.$store.getters.permission_routes
    },
    valueField() {
      return this.$store.getters.getValueOfField({
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        columnName: this.fieldAttributes.columnName
      })
    },
    openOptionField: {
      get() {
        const option = this.optionField.find(option => this.$route.query.typeAction === option.name)
        if (!this.isEmptyValue(this.$route.query) && option) {
          return true
        }
        return false
      },
      set(value) {
        if (!value) {
          this.showPopoverPath = false
          this.$router.push({
            name: this.$route.name,
            query: {
              ...this.$route.query,
              typeAction: '',
              fieldColumnName: ''
            }
          }, () => {})
        }
      }
    }
  },
  watch: {
    panelContextMenu(value) {
      this.visibleForDesktop = false
    },
    metadataField(value) {
      this.field = value
    },
    openOptionField(value) {
      if (!value) {
        this.showPopoverPath = false
      }
    }
  },
  created() {
    this.timeOut = setTimeout(() => {
      if (this.isMobile && this.optionColumnName === this.field.columnName) {
        this.$store.commit('changeShowRigthPanel', true)
        this.$store.dispatch('setOptionField', {
          fieldAttributes: this.fieldAttributes,
          name: this.$route.query.typeAction,
          valueField: this.valueField
        })
      } else {
        this.showPopoverPath = true
      }
    }, 2000)
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
    recursiveTreeSearch,
    handleOpen(key, keyPath) {
      this.triggerMenu = 'hover'
    },
    handleClose(key, keyPath) {
      this.triggerMenu = 'click'
    },
    handleSelect(key, keyPath) {
      const option = this.listOption.find(option => option.name === key)
      if (option.name === this.$t('table.ProcessActivity.zoomIn')) {
        this.redirect({ window: option.fieldAttributes.reference.zoomWindows[0] })
        return
      }
      if (this.isMobile) {
        this.$store.commit('changeShowRigthPanel', true)
      } else {
        this.visibleForDesktop = true
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            typeAction: key,
            fieldColumnName: this.field.columnName
          }
        }, () => {})
      }
      this.$store.commit('changeShowPopoverField', true)
      this.$store.dispatch('setOptionField', option)
      this.triggerMenu = 'hover'
    },
    focusField() {
      if (this.field.handleRequestFocus || (this.field.displayed && !this.field.readonly)) {
        this.$refs[this.field.columnName].requestFocus()
      }
    },
    handleCommand(command) {
      console.log({ command })
      this.$store.commit('setRecordAccess', false)
      if (command.name === this.$t('table.ProcessActivity.zoomIn')) {
        this.redirect({ window: command.fieldAttributes.reference.zoomWindows[0] })
        return
      }
      if (this.isMobile) {
        this.$store.commit('changeShowRigthPanel', true)
      } else {
        this.visibleForDesktop = true
      }
      this.$store.commit('changeShowPopoverField', true)
      this.$store.dispatch('setOptionField', command)
    },
    redirect({ window }) {
      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: window.uuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        this.$router.push({
          name: viewSearch.name,
          query: {
            action: 'advancedQuery',
            tabParent: 0,
            [this.fieldAttributes.columnName]: this.value
          }
        }, () => {})
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('notifications.noRoleAccess')
        })
      }
    }
  }
}
</script>
<style scoped>
.el-form--label-top .el-form-item__label {
  padding-bottom: 0px !important;
  display: block;
}
</style>
<style>
  .el-popper {
    padding: 0px;
  }
  .el-textarea {
    position: relative;
    width: 100%;
    vertical-align: bottom;
    font-size: 14px;
    display: flex;
  }
  .el-menu--horizontal > .el-submenu .el-submenu__title {
    height: 60px;
    line-height: 60px;
    border-bottom: 2px solid transparent;
    color: #535457e3;
  }
</style>
<style scoped>
  .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #E6E6E6;
  }
  .svg-icon {
    width: 1em;
    height: 1.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .el-dropdown .el-button-group {
    display: flex;
  }
  .el-dropdown-menu {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 0px;
    margin: 0px;
    background-color: #FFFFFF;
    border: 1px solid #e6ebf5;
    border-radius: 4px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    max-height: 250px;
    max-width: 220px;
    overflow: auto;
  }
  .el-dropdown-menu--mini .el-dropdown-menu__item {
    line-height: 14px;
    padding: 0px 15px;
    padding-top: 1%;
    padding-right: 15px;
    padding-bottom: 1%;
    padding-left: 15px;
    font-size: 10px;
  }
  .el-dropdown-menu__item--divided {
    position: relative;
    /* margin-top: 6px; */
    border-top: 1px solid #e6ebf5;
  }
  .label {
    font-size: 14px;
    margin-top: 0% !important;
    margin-left: 0px;
    text-align: initial;
  }
  .description {
    margin: 0px;
    font-size: 12px;
    text-align: initial;
  }
  .contents {
    display: inline-flex;
  }
</style>

<style lang="scss">
  .el-popover {
    position: fixed;
  }
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
