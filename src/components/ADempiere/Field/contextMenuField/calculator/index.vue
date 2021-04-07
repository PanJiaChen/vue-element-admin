<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        {{ $t('field.field') }}
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>
    <el-form ref="form" label-position="top" label-width="120px" @submit.native.prevent="notSubmitForm">
      <el-form-item label="Valor">
        <el-input
          ref="calculatorInput"
          v-model="calcValue"
          class="calculator-input"
          size="mini"
          readonly
          @keydown.native="calculateValue"
          @keyup.enter.native="changeValue"
        />
      </el-form-item>
    </el-form>
    <el-table
      ref="calculator"
      :data="tableData"
      style="width: 100%"
      border
      size="mini"
      :show-header="false"
      :span-method="spanMethod"
      class="calculator-table"
      @cell-click="sendValue"
    >
      <el-table-column
        align="center"
        prop="row1"
        height="15"
        width="45"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row1.value }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="row2"
        height="15"
        width="45"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row2.value }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="row3"
        height="15"
        width="45"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row3.value }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="row4"
        height="15"
        width="45"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row4.value }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="row5"
        height="15"
        width="45"
      >
        <template slot-scope="{ row, column }">
          <el-button type="text" :disabled="isDisabled(row, column)">
            {{ row.row5.value }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { ID, INTEGER } from '@/utils/ADempiere/references'
import buttons from './buttons.js'

export default {
  name: 'FieldCalc',
  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    fieldValue: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      calcValue: this.valueField,
      valueToDisplay: ''
    }
  },
  computed: {
    tableData() {
      return buttons
    },
    valueField() {
      return this.$store.getters.getValueOfField({
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        columnName: this.fieldAttributes.columnName
      })
    }
  },
  watch: {
    valueField(value) {
      console.log(value)
    },
    fieldValue(value) {
      this.calcValue = value
    }
  },
  created() {
    this.calcValue = this.valueField
  },
  methods: {
    sendValue(row, column) {
      const button = row[column.property]
      const { value, type } = button
      const isAcceptedType = ['result', 'clear'].includes(type)
      if (!isAcceptedType && !this.isDisabled(row, column)) {
        this.isEmptyValue(this.calcValue) ? this.calcValue = value : this.calcValue += value
        const result = this.calculationValue(this.calcValue, event)
        if (!this.isEmptyValue(result)) {
          this.valueToDisplay = result
        } else {
          this.valueToDisplay = '...'
        }
      }
      if (type === 'clear') {
        if (value === 'C') {
          this.calcValue = this.calcValue.slice(0, -1)
        } else if (value === 'AC') {
          this.calcValue = ''
          this.valueToDisplay = ''
        }
      }
      if (value === '=') {
        this.changeValue()
      }
    },
    changeValue() {
      const newValue = Number(this.valueToDisplay)
      let isSendCallout = true
      const isSendToServer = true
      const isChangedOldValue = false
      if (this.fieldAttributes.isAdvancedQuery) {
        isSendCallout = false
      }

      const sendParameters = {
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        field: this.fieldAttributes,
        panelType: this.fieldAttributes.panelType,
        columnName: this.fieldAttributes.columnName,
        newValue,
        isAdvancedQuery: this.fieldAttributes.isAdvancedQuery,
        isSendToServer,
        isSendCallout,
        isChangedOldValue
      }
      this.$store.dispatch('notifyFieldChange', {
        ...sendParameters
      })
        .finally(() => {
          this.clearVariables()
          this.$children[0].visible = false
          this.$store.commit('changeShowRigthPanel', false)
        })
    },
    spanMethod({ row, column }) {
      const button = row[column.property]
      const { value } = button
      if (this.isEmptyValue(value)) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
      if (['+', '='].includes(value)) {
        return {
          rowspan: 2,
          colspan: 1
        }
      }
      if (value === '0') {
        return {
          rowspan: 1,
          colspan: 2
        }
      }

      return {
        rowspan: 1,
        colspan: 1
      }
    },
    isDisabled(row, column) {
      // Integer or ID
      const isInteger = [ID.id, INTEGER.id].includes(this.fieldAttributes.displayType)
      const { value } = row[column.property]
      if (isInteger && value === ',') {
        return true
      }
      return false
    },
    calculateValue(event) {
      const result = this.calculationValue(this.valueField, event)
      if (!this.isEmptyValue(result)) {
        this.valueToDisplay = result
      } else {
        this.valueToDisplay = '...'
      }
    },
    focusCalc() {
      this.$refs.calculatorInput.focus()
    }
  }
}
</script>

<style>
  .calculator-input > .el-input__inner,
  .calculator-input .el-input__inner {
    border-radius: 0px !important;
  }

  .calculator-input {
    width: 202px;
    font-size: 16px;
    padding-left: 4px;
  }

  /* row color with hover */
	.el-table--enable-row-hover .el-table__body tr:hover > td {
		background-color: #ffffff !important;
	}

  .calculator-table .el-table__body-wrapper > table {
    border-spacing: 5px;
  }

  /* Button shadow and border */
  .calculator-table .el-table__body tr > td {
    box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.5);
    border-radius: 5px;
    cursor: pointer;
  }

  .calculator-table th, .calculator-table td,
  .calculator-table > th, .calculator-table > td {
    padding: 0px !important;
    height: 0px !important;
    padding-left: 0px !important;
  }

  .calculator-table .el-table .cell {
    padding-right: 5px !important;
    padding-left: 5px !important;
  }
  .calculator-table .el-table > .cell, .calculator-table .el-table .cell {
    padding-left: 0px !important;
  }
  .calculator-table .el-table th.is-leaf, .el-table td {
    border-bottom: 0px solid #dfe6ec !important;
  }
</style>
