<template>
  <el-select
    :ref="metadata.columnName"
    v-model="value"
    :filterable="!isMobile"
    :placeholder="metadata.help"
    :loading="isLoading"
    value-key="key"
    :class="cssClassStyle"
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
      v-for="(option, key) in optionsList"
      :key="key"
      :value="option.key"
      :label="option.label"
    />
  </el-select>
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { convertBooleanToString } from '@/utils/ADempiere/valueUtils.js'

/**
 * This component is a lookup type field, use as a replacement for fields:
 * - Reference List
 * - Table List
 * - Table Direct
 *
 * TODO: ALL: Although in the future these will have different components, and
 * are currently not supported is also displayed as a substitute for fields:
 * - Search Field
 */
export default {
  name: 'FieldSelect',
  mixins: [fieldMixin],
  data() {
    // label with '' value is assumed to be undefined non-existent
    const label = ' '

    return {
      isLoading: false,
      optionsList: [{
        label,
        key: undefined
      }],
      blankValues: [null, undefined, -1],
      blankOption: {
        label,
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
    cssClassStyle() {
      let styleClass = this.metadata.cssClassName + ' custom-field-select'
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

      // sets the value to blank when the lookupList or lookupItem have no
      // values, or if only lookupItem does have a value
      if (this.isEmptyValue(allOptions) || (allOptions.length &&
        (!this.blankValues.includes(allOptions[0].key)))) {
        allOptions.unshift(this.blankOption)
      }
      return allOptions
    },
    value: {
      get() {
        const value = this.$store.getters.getValueOfField({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName
        })
        let label = this.findLabel(value)
        if (!label) {
          label = this.displayColumn
          /* eslint-disable */
          this.optionsList.push({
            key: value,
            label
          })
          /* eslint-disable */
        }
        return value
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value
        })
      }
    },
    displayColumn: {
      get() {
        return this.$store.getters.getValueOfField({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: this.metadata.displayColumnName
        })
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: this.metadata.displayColumnName,
          value
        })
      }
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
            // set first value
            this.value = this.value[0]
          } else {
            this.value = this.blankOption.key
          }
        }
      }
    },
    /*
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        value = this.parseValue(value)

        if (this.metadata.displayed) {
          if (!this.optionsList.some(option => option.key === value) &&
            !this.isEmptyValue(this.metadata.displayColumn)) {
            this.optionsList.push({
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
              this.optionsList.push({
                key: this.value,
                label: value
              })
            }
          }
        }
      }
    }
    */
    'metadata.displayed'(value) {
      if (value) {
        // if is field showed, search into store all options to list
        this.optionsList = this.getterLookupAll
      }
    }
  },
  created() {
    this.changeBlankOption()
  },
  beforeMount() {
    if (this.metadata.displayed) {
      this.optionsList = this.getterLookupAll
      const value = this.value
      if (!this.isEmptyValue(value) && !this.metadata.isAdvancedQuery) {
        const label = this.findLabel(value)
        if (label) {
          this.displayColumn = label
        } else {
          if (!this.isEmptyValue(this.metadata.displayColumn)) {
          // verify if exists to add
            this.optionsList.push({
              key: value,
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
    parseValue(value) {
      if (typeof value === 'boolean') {
        // value ? 'Y' : 'N'
        value = convertBooleanToString(value)
      }
      return value
    },
    changeBlankOption() {
      if (Number(this.metadata.defaultValue) === -1) {
        this.blankOption.key = -1
      }
    },
    preHandleChange(value) {
      const label = this.findLabel(this.value)
      this.displayColumn = label
      this.handleFieldChange({
        value,
        label
      })
    },
    findLabel(value) {
      const selected = this.optionsList.find(item => item.key === value)
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
        value: this.value
      })
        .then(responseLookupItem => {
          this.displayColumn = responseLookupItem.label
          this.optionsList = this.getterLookupAll
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
    remoteMethod() {
      this.isLoading = true
      this.$store.dispatch('getLookupListFromServer', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        tableName: this.metadata.reference.tableName,
        query: this.metadata.reference.query,
        isAddBlankValue: true,
        blankValue: this.blankOption.key
      })
        .then(responseLookupList => {
          if (!this.isEmptyValue(responseLookupList)) {
            this.optionsList = responseLookupList
          } else {
            this.optionsList = this.getterLookupAll
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    clearLookup() {
      // set empty list and empty option
      this.optionsList = [
        this.blankOption
      ]

      this.$store.dispatch('deleteLookupList', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        tableName: this.metadata.reference.tableName,
        query: this.metadata.reference.query,
        directQuery: this.metadata.reference.directQuery,
        value: this.value
      })

      // set empty value
      this.value = this.blankOption.key
    }
  }
}
</script>

<style lang="scss" scoped>
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
