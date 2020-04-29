
export const fieldMixin = {
  props: {
    metadata: {
      type: Object,
      required: true
    },
    // value received from data result
    valueModel: {
      type: [String, Number, Boolean, Date, Array, Object],
      default: null
    }
  },
  data() {
    // value render
    let value = this.metadata.value
    if (this.metadata.inTable) {
      value = this.valueModel
    }
    return {
      value: value
    }
  },
  computed: {
    isDisabled() {
      return Boolean(this.metadata.readonly || this.metadata.disabled)
    }
  },
  async created() {
    if (this.metadata.isSQLValue && (this.isEmptyValue(this.metadata.value) || this.metadata.value.isSQL || isNaN(this.metadata.value))) {
      const value = await this.$store.dispatch('getValueBySQL', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        query: this.metadata.defaultValue
      })
      this.preHandleChange(value)
    }
  },
  methods: {
    activeFocus() {
      this.$refs[this.metadata.columnName].focus()
    },
    /**
     * Overwrite component method if necessary
     * validate values before send values to store or server
     * @param {mixed} value
     */
    preHandleChange(value) {
      this.handleChange(value)
    },
    focusGained(value) {
      this.$store.dispatch('notifyFocusGained', {
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        value: this.value
      })
    },
    focusLost(value) {
      this.$store.dispatch('notifyFocusLost', {
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        value: this.value
      })
    },
    keyPressed(value) {
      this.$store.dispatch('notifyKeyPressed', {
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        value: value.key,
        keyCode: value.keyCode
      })
    },
    keyReleased(value) {
      this.$store.dispatch('notifyKeyReleased', {
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        value: value.key,
        keyCode: value.keyCode
      })
    },
    /**
     * @param {mixed} value, main value in component
     * @param {mixed} valueTo, used in end value in range
     * @param {string} label, or displayColumn to show in select
     */
    handleChange(value, valueTo = undefined, label = undefined) {
      let newValue = value
      let isSendCallout = true
      let isSendToServer = true
      let isChangedOldValue = false
      if (value === 'NotSend') {
        newValue = this.value
        if (this.componentPath === 'FieldYesNo') {
          isChangedOldValue = true
          newValue = Boolean(newValue)
        }
        isSendToServer = false
        isSendCallout = false
      }
      if (this.metadata.isAdvancedQuery) {
        isSendCallout = false
      }

      const sendParameters = {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        field: this.metadata,
        panelType: this.metadata.panelType,
        columnName: this.metadata.columnName,
        newValue,
        valueTo,
        isAdvancedQuery: this.metadata.isAdvancedQuery,
        isSendToServer,
        isSendCallout,
        isChangedOldValue
      }
      // Global Action performed
      this.$store.dispatch('notifyActionPerformed', {
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        value: newValue
      })
      if (this.metadata.inTable) {
        this.$store.dispatch('notifyCellTableChange', {
          ...sendParameters,
          keyColumn: this.metadata.keyColumn,
          tableIndex: this.metadata.tableIndex,
          rowKey: this.metadata.rowKey
        })
      } else {
        this.$store.dispatch('notifyFieldChange', {
          ...sendParameters,
          displayColumn: label
        })
      }
    }
  }
}
