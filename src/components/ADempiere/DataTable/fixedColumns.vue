<template>
  <el-select
    v-model="columnsFixed"
    :filterable="!isMobile"
    :placeholder="$t('components.fixedleItems')"
    multiple
    size="mini"
    collapse-tags
    value-key="key"
    @change="addField"
  >
    <el-option
      v-for="(item, key) in columnListAvailable"
      :key="key"
      :label="item.name"
      :value="item.columnName"
    />
  </el-select>
</template>

<script>
export default {
  name: 'FixedColumns',
  props: {
    containerUuid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      columnsFixed: [], // columns showed
      columnListAvailable: [] // available fields
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    fieldsList() {
      return this.$store.getters.getFieldsListFromPanel(this.containerUuid)
    }
  },
  created() {
    this.getPanel()
  },
  methods: {
    getPanel() {
      const fieldsList = this.fieldsList
      if (!this.isEmptyValue(fieldsList)) {
        this.generatePanel(fieldsList)
      }
    },
    generatePanel(fieldsList) {
      this.columnListAvailable = fieldsList.filter(fieldItem => {
        return this.isDisplayed(fieldItem)
      })
    },
    isDisplayed(field) {
      const isDisplayed = field.isActive && field.isDisplayed && field.isDisplayedFromLogic && !field.isKey
      if (field.isFixedTableColumn && field.isDisplayed) {
        this.columnsFixed.push(field.columnName)
      }
      return isDisplayed
    },
    /**
     * @param {array} selectedValues
     */
    addField(selectedValues) {
      this.$store.dispatch('changeFieldAttributesBoolean', {
        containerUuid: this.containerUuid,
        fieldsIncludes: selectedValues,
        attribute: 'isFixedTableColumn',
        valueAttribute: true
      })
    }
  }
}
</script>
