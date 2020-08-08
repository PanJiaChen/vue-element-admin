<template>
  <el-autocomplete
    v-model="displayedValue"
    :placeholder="placeholder"
    :fetch-suggestions="localSearch"
    clearable
    value-key="name"
    style="width: 100%;"
    popper-class="custom-field-bpartner-info"
    @focus="isFocus = true"
    @blur="isFocus = false"
  >
    <template slot="suffix">
      <i
        class="el-icon-arrow-down el-input__icon"
      />
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
      if (this.isEmptyValue(stringToMatch)) {
        // not show list
        callBack([])
        return
      }

      const recordsList = this.getterLookupList
      let results = recordsList
      if (stringToMatch || true) {
        const parsedValue = stringToMatch.toLowerCase().trim()
        results = recordsList.filter(rowBPartner => {
          // columns: id, uuid, label
          for (const columnBPartner in rowBPartner) {
            const valueToCompare = String(rowBPartner[columnBPartner]).toLowerCase()

            if (valueToCompare.includes(parsedValue)) {
              return true
            }
          }
          return false
        })

        // Remote search
        if (this.isEmptyValue(results)) {
          clearTimeout(this.timeOut)

          this.timeOut = setTimeout(() => {
            this.remoteSearch(stringToMatch)
              .then(remoteResponse => {
                callBack(remoteResponse)
              })
          }, 2000)
          return
        }
      }

      // call callback function to return suggestions
      callBack(results)
    },
    remoteSearch(searchValue) {
      return new Promise(resolve => {
        const message = {
          message: 'Sin resultados coincidentes con la busqueda',
          type: 'info',
          showClose: true
        }

        this.$store.dispatch('getLookupListFromServer', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          tableName: this.metadata.reference.tableName,
          query: this.metadata.reference.query,
          isAddBlankValue: true,
          blankValue: this.blankOption.id,
          valuesList: searchValue
        })
          .then(() => {
            const recordsList = this.getterLookupAll
            if (this.isEmptyValue(recordsList)) {
              this.$message(message)
            }

            resolve(recordsList)
          })
          .catch(error => {
            console.warn(error.message)

            this.$message(message)
            resolve([])
          })
          .finally(() => {
            this.isLoading = false
          })
      })
    }
  }
}
</script>
