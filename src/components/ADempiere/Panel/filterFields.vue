<template>
  <el-select
    v-model="selectedFields"
    :filterable="!isMobile"
    :placeholder="$t('components.filterableItems')"
    multiple
    collapse-tags
    value-key="key"
    style="float: right;"
    @change="addField"
  >
    <el-option
      v-for="(item, key) in getterFieldListOptional"
      :key="key"
      :label="item.name"
      :value="item.columnName"
    />
  </el-select>
</template>

<script>
export default {
  name: 'FilterFields',
  props: {
    containerUuid: {
      type: String,
      required: true
    },
    groupField: {
      type: String,
      default: ''
    },
    panelType: {
      type: String,
      default: 'window'
    },
    isAdvancedQuery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedFields: [] // fields optional showed
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    getterFieldListOptional() {
      if (this.panelType === 'table') {
        // fields to search without taking into account the mandatory
        return this.$store.getters.getFieldsListFromPanel(this.containerUuid, this.isAdvancedQuery)
          .filter(fieldItem => {
            return fieldItem.componentPath !== 'FieldButton'
          })
      } else if (this.panelType === 'window') {
        // compare group fields to window
        return this.$store.getters.getFieldsListNotMandatory(this.containerUuid)
          .filter(fieldItem => {
            return fieldItem.groupAssigned === this.groupField
          })
      }
      // get fields not mandatory
      return this.$store.getters.getFieldsListNotMandatory(this.containerUuid)
    },
    getFieldSelected() {
      return this.getterFieldListOptional
        .filter(fieldItem => {
          return fieldItem.isShowedFromUser
        })
        .map(itemField => itemField.columnName)
    }
  },
  watch: {
    // TODO: Verify peformance with computed set (dispatch) and get (state)
    getFieldSelected(value) {
      this.selectedFields = value
    }
  },
  created() {
    this.selectedFields = this.getFieldSelected
  },
  methods: {
    /**
     * @param {array} selectedValues
     */
    addField(selectedValues) {
      this.$store.dispatch('changeFieldShowedFromUser', {
        containerUuid: this.containerUuid,
        fieldsUser: selectedValues,
        show: true,
        groupField: this.groupField,
        isAdvancedQuery: this.isAdvancedQuery
      })
    }
  }
}
</script>

<style>
  .el-tag--small {
    height: 24px;
    padding: 0 8px;
    line-height: 22px;
    max-width: 65%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .el-select .el-tag__close.el-icon-close {
    background-color: #C0C4CC;
    right: 0px;
    top: 0;
    color: #FFFFFF;
  }
</style>
