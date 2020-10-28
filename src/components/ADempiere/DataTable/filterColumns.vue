<template>
  <el-select
    v-model="fieldsListShowed"
    :filterable="!isMobile"
    :placeholder="$t('components.filterableItems')"
    multiple
    size="mini"
    collapse-tags
    value-key="key"
    class="select"
  >
    <el-option
      v-for="(item, key) in fieldsListAvailable"
      :key="key"
      :label="item.name"
      :value="item.columnName"
    />
  </el-select>
</template>

<script>
export default {
  name: 'FilterColumns',
  props: {
    containerUuid: {
      type: String,
      required: true
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    fieldsList() {
      return this.$store.getters.getFieldsListFromPanel(this.containerUuid)
    },
    // available fields
    fieldsListAvailable() {
      return this.fieldsList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
        return fieldItem.isActive && isDisplayed && !fieldItem.isKey
      })
    },
    fieldsListShowed: {
      get() {
        // columns showed
        return this.fieldsList.filter(itemField => {
          if (itemField.isShowedTableFromUser && (itemField.isDisplayed || itemField.isDisplayedFromLogic) && !itemField.isKey) {
            return true
          }
        }).map(itemField => {
          return itemField.columnName
        })
      },
      set(selecteds) {
        // set columns to show/hidden in vuex store
        this.addField(selecteds)
      }
    }
  },
  methods: {
    /**
     * Set columns to hidden/showed in table
     * @param {array} selectedValues
     */
    addField(selectedValues) {
      this.$store.dispatch('changeFieldAttributesBoolean', {
        containerUuid: this.containerUuid,
        fieldsIncludes: selectedValues,
        attribute: 'isShowedTableFromUser',
        valueAttribute: true
      })
    }
  }
}
</script>
