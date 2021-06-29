// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

export default {
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
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isDisabled() {
      return Boolean(this.metadata.readonly || this.metadata.disabled)
    },
    cssClassStyle() {
      let styleClass = ''
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass = this.metadata.cssClassName
      }
      return styleClass
    },
    value: {
      get() {
        const { columnName, containerUuid } = this.metadata

        // table records values
        if (this.metadata.inTable) {
          const row = this.$store.getters.getRowData({
            containerUuid,
            index: this.metadata.tableIndex
          })
          return row[columnName]
        }

        // main panel values
        return this.$store.getters.getValueOfField({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
      },
      set(value) {
        if (this.metadata.inTable) {
          this.$store.dispatch('notifyCellTableChange', {
            parentUuid: this.metadata.parentUuid,
            containerUuid: this.metadata.containerUuid,
            newValue: value,
            field: this.metadata
          })
          return
        }
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value
        })
      }
    }
  },
  async created() {
    if (this.metadata.isSQLValue && (this.isEmptyValue(this.metadata.value) || this.metadata.value.isSQL)) {
      const value = await this.$store.dispatch('getValueBySQL', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        query: this.metadata.defaultValue
      })
      // set value and change into store
      this.preHandleChange(value)
    }
  },
  mounted() {
    if (this.metadata.handleRequestFocus) {
      this.requestFocus()
    }
  },
  methods: {
    /**
     * Parse the value to a new value if required for element-ui component
     * compatibility where this method is overwritten
     * @param {mixed} value
     */
    parseValue(value) {
      return value
    },
    /**
     * Set focus if handle focus attribute is true
     */
    requestFocus() {
      if (this.$refs[this.metadata.columnName]) {
        this.$refs[this.metadata.columnName].focus()
      }
    },
    /**
     * Overwrite component method if necessary
     * validate values before send values to store or server
     * @param {mixed} value
     */
    preHandleChange(value) {
      this.handleFieldChange({ value })
    },
    focusGained(value) {
      if (this.metadata.handleContentSelection) {
        // select all the content inside the text box
        if (!this.isEmptyValue(value.target.selectionStart) &&
          !this.isEmptyValue(value.target.selectionStart)) {
          value.target.selectionStart = 0
          value.target.selectionEnd = value.target.value.length
        }
      }
      if (this.metadata.handleFocusGained) {
        this.$store.dispatch('notifyFocusGained', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: this.value
        })
      }
    },
    focusLost(value) {
      if (this.metadata.handleFocusLost) {
        this.$store.dispatch('notifyFocusLost', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: this.value
        })
      }
    },
    keyPressed(value) {
      if (this.metadata.handleKeyPressed) {
        this.$store.dispatch('notifyKeyPressed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value.key,
          keyCode: value.keyCode
        })
      }
    },
    actionKeyPerformed(value) {
      // TODO: Delete for production
      console.info('actionKeyPerformed ', value)
      if (this.metadata.handleActionKeyPerformed) {
        this.$store.dispatch('notifyActionKeyPerformed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value.target.value,
          keyCode: value.keyCode
        })
      }
    },
    keyReleased(value) {
      if (this.metadata.handleKeyReleased) {
        this.$store.dispatch('notifyKeyReleased', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: value.key,
          keyCode: value.keyCode
        })
      }
    },
    /**
     * @param {mixed} value, main value in component
     * @param {mixed} valueTo, used in end value in range
     * @param {string} label, or displayColumn to show in select
     */
    handleFieldChange({
      value,
      valueTo,
      label
    }) {
      // Global Action performed
      if (this.metadata.handleActionPerformed) {
        this.$store.dispatch('notifyActionPerformed', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value
        })
      }

      // if is custom field, set custom handle change value
      if (this.metadata.isCustomField) {
        if (this.metadata.isActiveLogics) {
          this.$store.dispatch('changeDependentFieldsList', {
            field: this.metadata
          })
        }
        return
      }

      if (this.metadata.inTable) {
        this.$store.dispatch('notifyCellTableChange', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          field: this.metadata
        })
      }
      this.$store.dispatch('notifyFieldChange', {
        containerUuid: this.metadata.containerUuid,
        field: this.metadata,
        columnName: this.metadata.columnName
      })
    }
  }
}
