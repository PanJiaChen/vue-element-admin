<template>
  <el-select
    :ref="metadata.columnName"
    v-model="value"
    :filterable="!isMobile"
    :placeholder="metadata.help"
    :loading="isLoading"
    value-key="key"
    class="select-base"
    clearable
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
      blanckOption: {
        // label with '' value is assumed to be undefined non-existent
        label: ' ',
        key: undefined || -1
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
    getterLookupItem() {
      if (this.isEmptyValue(this.metadata.reference.directQuery)) {
        return this.blanckOption
      }
      return this.$store.getters.getLookupItem({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        directQuery: this.metadata.reference.directQuery,
        tableName: this.metadata.reference.tableName,
        value: this.value
      })
    },
    getterLookupList() {
      if (this.isEmptyValue(this.metadata.reference.query)) {
        return this.blanckOption
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
      if (allOptions && ((allOptions.length && allOptions[0].key !== this.blanckOption.key) || !allOptions.length)) {
        allOptions.unshift(this.blanckOption)
      }
      return allOptions
    }
  },
  watch: {
    valueModel(value) {
      if (this.metadata.inTable) {
        this.value = value
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        if (!this.options.some(option => option.key === value)) {
          this.value = value
          this.getDataLookupItem()
        }
        this.value = value
      }
    },
    'metadata.displayColumn'(value) {
      if (!this.isEmptyValue(this.value)) {
        // console.log('display wacth')
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
  beforeMount() {
    this.options = this.getterLookupAll
    if (!this.isEmptyValue(this.value) && this.metadata.panelType !== 'table') {
      if (!this.findLabel(this.value)) {
        if (!this.isEmptyValue(this.metadata.displayColumn)) {
        // verify if exists to add
          this.options.push({
            key: this.value,
            label: this.metadata.displayColumn
          })
        } else {
          if (!this.isPanelWindow || (this.isPanelWindow &&
            (this.isEmptyValue(this.metadata.optionCRUD) || this.metadata.optionCRUD === 'create-new'))) {
            this.getDataLookupItem()
          }
        }
      }
    }
  },
  methods: {
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
      if (this.isEmptyValue(this.metadata.reference.directQuery)) {
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
            this.$store.dispatch('notifyFieldChangeDisplayColumn', {
              containerUuid: this.metadata.containerUuid,
              columnName: this.metadata.columnName,
              displayColumn: responseLookupItem.label
            })
          }
          this.options = this.getterLookupAll
          if (this.options.length && !this.options[0].key) {
            this.options.unshift(this.blanckOption)
          }
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
        // TODO: Evaluate if length = 1 and this element key = blanckOption
        if (this.getterLookupList.length === 0) {
          this.remoteMethod()
        }
      }
    },
    remoteMethod() {
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
        value: this.metadata.value
      })
      // TODO: Evaluate if is number -1 or string '' (or default value)
      this.options = this.getterLookupAll
      this.value = this.blanckOption.key
    }
  }
}
</script>

<style scoped>
  .select-base {
    width: 100%;
  }
</style>
