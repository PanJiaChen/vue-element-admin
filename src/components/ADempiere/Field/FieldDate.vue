<template>
  <el-date-picker
    :ref="metadata.columnName"
    v-model="value"
    :format="formatView"
    :value-format="formatSend"
    :type="typePicker"
    range-separator="-"
    :placeholder="metadata.help"
    :start-placeholder="$t('components.dateStartPlaceholder')"
    :end-placeholder="$t('components.dateEndPlaceholder')"
    unlink-panels
    :class="cssClassStyle"
    :readonly="Boolean(metadata.readonly)"
    :disabled="isDisabled"
    :picker-options="pickerOptions"
    @change="preHandleChange"
    @blur="focusLost"
    @focus="focusGained"
    @keydown.native="keyPressed"
    @keyup.native="keyReleased"
  />
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { DATE_PLUS_TIME } from '@/utils/ADempiere/references'

export default {
  name: 'FieldDate',
  mixins: [fieldMixin],
  data() {
    return {
      pickerOptionsDate: {
        shortcuts: [{
          text: this.$t('components.date.Today'),
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: this.$t('components.date.Yesterday'),
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: this.$t('components.date.Week'),
          onClick(picker) {
            const date = new Date()
            const monthEndDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            picker.$emit('pick', monthEndDay)
          }
        }]
      },
      pickerOptionsDateRange: {
        shortcuts: [{
          text: this.$t('components.date.Yesterday'),
          onClick(picker) {
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, start])
          }
        }, {
          text: this.$t('components.date.Week'),
          onClick(picker) {
            const start_date = new Date()
            start_date.setHours(0, 0, 0, 0)
            const end_date = new Date()
            const date = null
            const currenDate = date ? new Date(date) : new Date()
            const first = currenDate.getDate() - currenDate.getDay('monday')
            const last = first - 7
            start_date.setDate(last)
            end_date.setDate(first - 1)
            picker.$emit('pick', [start_date, end_date])
          }
        }, {
          text: this.$t('components.date.LastMonth'),
          onClick(picker) {
            const date = new Date()
            const monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0)
            const monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1)
            picker.$emit('pick', [monthStartDay, monthEndDay])
          }
        }, {
          text: this.$t('components.date.CurrentMonth'),
          onClick(picker) {
            const date = new Date()
            const monthEndDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            const monthStartDay = new Date(date.getFullYear(), date.getMonth(), 1)
            picker.$emit('pick', [monthStartDay, monthEndDay])
          }
        }]
      }
    }
  },
  computed: {
    typePicker() {
      let picker = 'date'
      if (['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery) {
        picker += 's'
        return picker
      }
      // Date + Time reference (16)
      if (this.metadata.displayType === DATE_PLUS_TIME.id) {
        picker += 'time'
      }
      if (this.metadata.isRange && !this.metadata.inTable) {
        picker += 'range'
      }
      return picker
    },
    cssClassStyle() {
      let styleClass = ' custom-field-date '
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    },
    /**
     * Parse the date format to be compatible with element-ui
     */
    formatView() {
      let format = ''
      if (!this.isEmptyValue(this.metadata.vFormat)) {
        format = this.metadata.vFormat
          .replace(/[Y]/gi, 'y')
          .replace(/[m]/gi, 'M')
          .replace(/[D]/gi, 'd')
      }
      if (this.isEmptyValue(format)) {
        format = 'yyyy-MM-dd'
      }
      if (this.typePicker.replace('range', '') === 'datetime') {
        format = format + ' hh:mm:ss A'
      }
      return format
    },
    formatSend() {
      if (this.formatView) {
        return this.formatView
          .replace(/[h]/gi, 'H')
          .replace(/[aA]/gi, '')
      }
      return undefined
    },
    pickerOptions() {
      if (this.typePicker === 'daterange') {
        return this.pickerOptionsDateRange
      }
      return this.pickerOptionsDate
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
        let value = this.$store.getters.getValueOfField({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
        if (!this.metadata.isRange) {
          return this.parseValue(value)
        }

        const valueTo = this.$store.getters.getValueOfField({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName: this.metadata.columnNameTo
        })

        value = this.parseValue([value, valueTo])
        return value
      },
      set(value) {
        let startValue = value
        if (Array.isArray(value)) {
          startValue = value[0]
        }
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: startValue
        })
        if (!this.metadata.isRange) {
          return
        }

        const endValue = value[1]

        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnNameTo,
          value: endValue
        })
      }
    }
  },
  methods: {
    parseValue(value) {
      // not return undefined to v-model
      if (this.isEmptyValue(value)) {
        if (['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery) {
          return []
        }
        return null
      }

      if (['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery) {
        if (Array.isArray(value)) {
          value = value.map(itemValue => {
            if (typeof itemValue === 'object') {
              return itemValue.toUTCString()
            }
            return itemValue
          })
        } else {
          const tempValue = []
          if (!this.isEmptyValue(value)) {
            tempValue.push(value)
          }
          value = tempValue
        }
        return value
      }

      // instance date from long value
      if (typeof value === 'number') {
        value = new Date(value).toUTCString()
      }

      // generate range value
      if (this.metadata.isRange && !this.metadata.inTable) {
        let valueTo // = this.metadata.valueTo
        if (Array.isArray(value)) {
          valueTo = value[1]
          value = value[0]
        }
        if (typeof valueTo === 'number') {
          valueTo = new Date(valueTo).toUTCString()
        }
        if (this.isEmptyValue(valueTo)) {
          valueTo = undefined
        }
        value = [value, valueTo]
        if (this.isEmptyValue(value[0]) || this.isEmptyValue(value[1])) {
          value = []
        }
      }

      return value
    },
    // validate values before send values to store or server
    preHandleChange(value) {
      let startValue, endValue
      startValue = value

      if (this.typePicker === 'dates') {
        if (Array.isArray(value)) {
          value = value.map(itemValue => new Date(itemValue))
        }
        this.handleFieldChange({ value })
        return
      }

      if (this.metadata.isRange && !this.metadata.inTable && Array.isArray(value)) {
        startValue = value[0]
        endValue = value[1]
      }

      if (startValue === null) {
        startValue = undefined
        endValue = undefined
      }

      if (typeof startValue !== 'object' && startValue !== undefined) {
        startValue = new Date(startValue)
        endValue = new Date(endValue)
      }

      this.handleFieldChange({
        value: startValue,
        valueTo: endValue
      })
    }
  }
}
</script>

<style scoped>
  .custom-field-date {
    width: 100% !important;
  }
</style>
