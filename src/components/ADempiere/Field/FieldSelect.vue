<template>
  <el-select
    :ref="metadata.columnName"
    v-model="value"
    :filterable="!isMobile"
    :placeholder="metadata.help"
    :loading="isLoading"
    value-key="key"
    :class="classStyle"
    clearable
    :multiple="isSelectMultiple"
    :allow-create="metadata.isSelectCreated"
    :collapse-tags="!isSelectMultiple"
    :disabled="isDisabled"
    @change="preHandleChange"
    @visible-change="getDataLookupList"
    @clear="clearLookup"
  >
    <el-option
      v-for="(option, key) in options"
      :key="key"
      :value="option.key"
      :label="option.label"
    />
  </el-select>
</template>

<script>
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

/**
 * This component is a lookup type field, use as a replacement for fields:
 * - Reference List
 * - Table List
 * - Table Direct
 *
 * TODO: ALL: Although in the future these will have different components, and
 * are currently not supported is also displayed as a substitute for fields:
 * - Locator (WH)
 * - Search Field
 */
export default {
  name: 'FieldSelect',
  mixins: [fieldMixin],
  data() {
    return {
      isLoading: false,
      options: [{
        label: ' ',
        key: undefined
      }],
      blankValues: [null, undefined, -1],
      blankOption: {
        // label with '' value is assumed to be undefined non-existent
        label: ' ',
        key: undefined
      }
    }
  },
  computed: {
    isPanelWindow() {
      return this.metadata.panelType === 'window'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isSelectMultiple() {
      return ['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery
    },
    classStyle() {
      let styleClass = 'custom-field-select'
      if (this.isSelectMultiple) {
        styleClass += ' custom-field-select-multiple'
      }
      return styleClass
    },
    getterLookupList() {
      if (this.isEmptyValue(this.metadata.reference.query) ||
        !this.metadata.displayed) {
        return [this.blankOption]
      }
      return this.$store.getters.getLookupList({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        query: this.metadata.reference.query,
        tableName: this.metadata.reference.tableName
      })
    },
    getterLookupAll() {
      const allOptions = this.$store.getters.getLookupAll({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        query: this.metadata.reference.query,
        directQuery: this.metadata.reference.directQuery,
        tableName: this.metadata.reference.tableName,
        value: this.value
      })

      if (this.isEmptyValue(allOptions) || (allOptions.length &&
        (!this.blankValues.includes(allOptions[0].key)))) {
        allOptions.unshift(this.blankOption)
      }
      return allOptions
    }
  },
  watch: {
    isSelectMultiple(isMultiple) {
      if (isMultiple) {
        const valueInArray = []
        if (!this.isEmptyValue(this.value)) {
          valueInArray.push(this.value)
        }
        this.value = valueInArray
      } else {
        if (Array.isArray(this.value)) {
          if (this.value.length) {
            this.value = this.value[0]
          } else {
            this.value = undefined
          }
        }
      }
    },
    valueModel(value) {
      if (this.metadata.inTable) {
        this.value = value
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        if (typeof value === 'boolean') {
          value = value ? 'Y' : 'N'
        }
        if (this.metadata.displayed) {
          if (!this.options.some(option => option.key === value) &&
            !this.isEmptyValue(this.metadata.displayColumn)) {
            this.options.push({
              key: value,
              label: this.metadata.displayColumn
            })
          }
        }
        if (!this.findLabel(value) &&
          this.metadata.displayed &&
          this.isEmptyValue(this.metadata.displayColumn)) {
          value = undefined
        }
        this.value = value
      }
    },
    'metadata.displayColumn'(value) {
      if (this.metadata.displayed) {
        if (!this.isEmptyValue(this.value)) {
          if (!this.isEmptyValue(value)) {
            // verify if exists to add
            if (!this.findLabel(this.value)) {
              this.options.push({
                key: this.value,
                label: value
              })
            }
          }
        }
      }
    },
    'metadata.displayed'(value) {
      if (value) {
        this.changeBlankOption()
        this.options = this.getterLookupAll
      }
    }
  },
  beforeMount() {
    if (this.metadata.displayed) {
      this.changeBlankOption()
      this.options = this.getterLookupAll
      if (!this.isEmptyValue(this.value) && !this.metadata.isAdvancedQuery) {
        if (!this.findLabel(this.value)) {
          if (!this.isEmptyValue(this.metadata.displayColumn)) {
          // verify if exists to add
            this.options.push({
              key: this.value,
              label: this.metadata.displayColumn
            })
          } else {
            if (!this.isPanelWindow || (this.isPanelWindow &&
              (this.isEmptyValue(this.metadata.optionCRUD) ||
              this.metadata.optionCRUD === 'create-new'))) {
              this.getDataLookupItem()
            }
          }
        }
      }
    }
  },
  methods: {
    changeBlankOption() {
      if (Number(this.metadata.defaultValue) === -1) {
        this.blankOption = {
          label: ' ',
          key: -1
        }
      }
      if (this.value === undefined || this.value === null) {
        this.blankOption = {
          label: ' ',
          key: undefined
        }
      }
    },
    preHandleChange(value) {
      const label = this.findLabel(this.value)
      this.handleChange(value, undefined, label)
    },
    findLabel(value) {
      const selected = this.options.find(item => item.key === value)
      if (selected) {
        return selected.label
      }
      return selected
    },
    async getDataLookupItem() {
      if (this.isEmptyValue(this.metadata.reference.directQuery) ||
        (this.metadata.isAdvancedQuery && this.isSelectMultiple)) {
        return
      }
      this.isLoading = true
      this.$store.dispatch('getLookupItemFromServer', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        tableName: this.metadata.reference.tableName,
        directQuery: this.metadata.reference.directQuery,
        value: this.metadata.value
      })
        .then(responseLookupItem => {
          if (this.isPanelWindow) {
            this.$store.dispatch('changeFieldAttribure', {
              containerUuid: this.metadata.containerUuid,
              isAdvancedQuery: this.metadata.isAdvancedQuery,
              columnName: this.metadata.columnName,
              attributeName: 'displayColumn',
              attributeValue: responseLookupItem.label
            })
          }
          this.changeBlankOption()
          this.options = this.getterLookupAll
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    /**
     * @param {boolean} isShowList triggers when the pull-down menu appears or disappears
     */
    getDataLookupList(isShowList) {
      if (isShowList) {
        // TODO: Evaluate if length = 1 and this element key = blankOption
        const list = this.getterLookupList
        if (this.isEmptyValue(list) || (list.length === 1 && this.blankValues.includes(list[0]))) {
          this.remoteMethod()
        }
      }
    },
    async remoteMethod() {
      if (this.isEmptyValue(this.metadata.reference.query)) {
        return
      }
      this.isLoading = true
      this.$store.dispatch('getLookupListFromServer', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        tableName: this.metadata.reference.tableName,
        query: this.metadata.reference.query
      })
        .then(responseLookupList => {
          this.changeBlankOption()
          this.options = this.getterLookupAll
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    clearLookup() {
      this.$store.dispatch('deleteLookupList', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        tableName: this.metadata.reference.tableName,
        query: this.metadata.reference.query,
        directQuery: this.metadata.reference.directQuery,
        value: this.value
      })

      // set empty list and empty option
      this.changeBlankOption()
      const list = []
      list.push(this.blankOption)
      this.options = list

      // set empty value
      this.value = this.blankOption.key
    }
  }
}
</script>

<style lang="scss">
  .custom-field-select {
    width: 100%;
  }

  .custom-field-select-multiple {
    overflow: auto;
    max-height: 100px;
    .el-select__tags {
      max-height: 100px;
    }
  }
</style>
