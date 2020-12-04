<template>
  <el-select
    :ref="metadata.columnName"
    v-model="value"
    :filterable="!isMobile"
    :placeholder="metadata.help"
    :loading="isLoading"
    value-key="id"
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
      :value="option.id"
      :label="option.label"
    />
  </el-select>
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { convertBooleanToString } from '@/utils/ADempiere/valueFormat.js'

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
    const blankOption = {
      label,
      id: undefined,
      uuid: undefined
    }

    return {
      isLoading: false,
      optionsList: [blankOption],
      blankValues: [null, undefined, -1],
      blankOption
    }
  },
  computed: {
    isPanelWindow() {
      return this.metadata.panelType === 'window'
    },
    isSelectMultiple() {
      return ['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery
    },
    cssClassStyle() {
      let styleClass = ' custom-field-select '
      if (this.isSelectMultiple) {
        styleClass += ' custom-field-select-multiple '
      }
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
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
        (!this.blankValues.includes(allOptions[0].id)))) {
        allOptions.unshift(this.blankOption)
      }
      return allOptions
    },
    value: {
      get() {
        const { columnName, containerUuid } = this.metadata
        let value
        // table records values
        if (this.metadata.inTable) {
          const row = this.$store.getters.getRowData({
            containerUuid,
            index: this.metadata.tableIndex
          })
          value = row[columnName]
        } else {
          value = this.$store.getters.getValueOfField({
            parentUuid: this.metadata.parentUuid,
            containerUuid,
            columnName
          })
        }

        if (this.isEmptyValue(value)) {
          /* eslint-disable */
          this.displayedValue = undefined
          this.uuidValue = undefined
          /* eslint-disable */
          return value
        }

        const option = this.findOption(value)
        if (!option.label) {
          const label = this.displayedValue
          /* eslint-disable */
          this.optionsList.push({
            // TODO: Add uuid
            id: value,
            label
          })
          /* eslint-disable */
        }

        return value
      },
      set(value) {
        const option = this.findOption(value)
        // always update uuid
        this.uuidValue = option.uuid

        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value
        })
      }
    },
    uuidValue: {
      get() {
        if (this.metadata.inTable) {
          return undefined
        }
        return this.$store.getters.getValueOfField({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // 'ColumnName'_UUID
          columnName: this.metadata.columnName + '_UUID',
        })
      },
      set(value) {
        if (this.metadata.inTable) {
          return undefined
        }
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // 'ColumnName'_UUID
          columnName: this.metadata.columnName + '_UUID',
          value
        })
      }
    },
    displayedValue: {
      get() {
        const { displayColumnName: columnName, containerUuid } = this.metadata
        // table records values
        if (this.metadata.inTable) {
          const row = this.$store.getters.getRowData({
            containerUuid,
            index: this.metadata.tableIndex
          })
          // DisplayColumn_'ColumnName'
          return row[columnName]
        }
        return this.$store.getters.getValueOfField({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          // DisplayColumn_'ColumnName'
          columnName
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
      let value = this.value
      if (isMultiple) {
        const valueInArray = []
        if (!this.isEmptyValue(value)) {
          valueInArray.push(value)
        }
        value = valueInArray
      } else {
        if (Array.isArray(value)) {
          if (value.length) {
            // set first value
            value = value[0]
          } else {
            value = this.blankOption.id
          }
        }
      }
      this.value = value
    },
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
        const option = this.findOption(value)
        if (option.label) {
          this.displayedValue = option.label
          this.uuidValue = option.uuid
        } else {
          // TODO: Property displayColumn is @deprecated
          if (!this.isEmptyValue(this.metadata.displayColumn)) {
            // verify if exists to add
            this.optionsList.push({
              id: value,
              // TODO: Add uuid
              label: this.metadata.displayColumn
            })
          } else {
            if (!this.isPanelWindow || (this.isPanelWindow &&
              !this.isEmptyValue(this.$route.query) &&
              this.$route.query.action === 'create-new')) {
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
        this.blankOption.id = this.metadata.defaultValue
      }
    },
    preHandleChange(value) {
      const { label } = this.findOption(value)
      this.displayedValue = label
      this.handleFieldChange({
        value,
        label
      })
    },
    findOption(value) {
      const option = this.optionsList.find(item => item.id === value)
      if (option && option.label) {
        return option
      }
      return {
        label: undefined,
        value: undefined,
        uuid: undefined
      }
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
          this.displayedValue = responseLookupItem.label
          this.uuidValue = responseLookupItem.uuid
          this.$nextTick(() => {
            this.optionsList = this.getterLookupAll
          })
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
        // TODO: Evaluate if length = 1 and this element id = blankOption
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
        columnName: this.metadata.columnName,
        tableName: this.metadata.reference.tableName,
        query: this.metadata.reference.query,
        whereClause: this.metadata.validationCode,
        // valuesList: this.value
        isAddBlankValue: true,
        blankValue: this.blankOption.id
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
      this.value = this.blankOption.id
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
