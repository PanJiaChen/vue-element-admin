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
  <el-autocomplete
    v-model="displayedValue"
    :placeholder="metadata.placeholder"
    :fetch-suggestions="localSearch"
    :trigger-on-focus="true"
    clearable
    value-key="name"
    style="width: 100%;"
    popper-class="custom-field-bpartner-info"
    @focus="isFocus = true"
    @blur="isFocus = false"
    @select="handleSelect"
  >
    <template
      slot="prefix"
    >
      <i
        :class="metadata.icon"
      />
    </template>
    <template slot="suffix">
      <i
        class="el-icon-arrow-down el-input__icon"
      />
    </template>
    <template slot-scope="props">
      <div class="header">
        <b>{{ props.item.name }} </b>
      </div>
      <span class="info">
        {{ props.item.value }}
      </span>
    </template>
  </el-autocomplete>
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { convertBooleanToString } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'FieldAutocomplete',
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
      recordsBusinessPartners: [],
      controlDisplayed: this.displayedValue,
      isFocus: false,
      isLoading: false,
      optionsList: [blankOption],
      blankValues: [null, undefined, -1],
      blankOption,
      timeOut: null
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
      let styleClass = this.metadata.cssClassName + ' custom-field-select'
      if (this.isSelectMultiple) {
        styleClass += ' custom-field-select-multiple'
      }
      return styleClass
    },
    placeholder() {
      if (this.isFocus) {
        return this.displayedValue
      }
      return this.$t('quickAccess.searchWithEnter')
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
        const value = this.$store.getters.getValueOfField({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName
        })
        if (this.isEmptyValue(value)) {
          /* eslint-disable */
          this.displayedValue = undefined
          /* eslint-disable */
          return value
        }

        let label = this.findLabel(value)
        if (!label) {
          label = this.displayedValue
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
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value
        })
      }
    },
    displayedValue: {
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
  created() {
    this.changeBlankOption()
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
        this.blankOption.id = -1
      }
    },
    setNewDisplayedValue() {
      this.isFocus = true
      const displayValue = this.displayedValue
      if (this.controlDisplayed !== displayValue) {
        this.controlDisplayed = displayValue
      }
    },
    localSearch(stringToMatch, callBack) {
      const localListSearch = this.metadata.loadAll
      const results = stringToMatch ? localListSearch.filter(this.createFilter(stringToMatch)) : localListSearch
      // call callback function to return suggestions
      if (this.isEmptyValue(results) && stringToMatch.length > 3) {
        clearTimeout(this.timeOut)
        this.timeOut = setTimeout(() => {
          this.remoteSearch(stringToMatch)
            .then(remoteResponse => {
              callBack(remoteResponse)
            })
        }, 3000)
        return
      }
      callBack(results)
    },
    createFilter(stringToMatch) {
      return (find) => {
        return (find.name.toLowerCase().indexOf(stringToMatch.toLowerCase()) === 0)
      }
    },
    remoteSearch(searchValue) {
      return new Promise(resolve => {
        const message = {
          message: this.$t('notifications.searchWithOutRecords'),
          type: 'info',
          showClose: true
        }

        this.$store.dispatch(this.metadata.searchServer, {
          pageNumber: 1,
          searchValue
        })
          .then((response) => {
            const recordsList = this.metadata.loadAll
            if (this.isEmptyValue(recordsList)) {
              this.$message(message)
            }
            return response
          })
          .catch(error => {
            console.warn(error.message)

            this.$message(message)
            return []
          })
      })
    },
    handleSelect(item) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        value: item.id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.displayColumnName,
        value: item.name
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName + '_UUID',
        value: item.uuid
      })
    }
  }
}
</script>
