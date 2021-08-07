<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanchez@erpya.com www.erpya.com
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
  <div
    class="card-form"
    style="height: 100%;overflow: auto;"
  >
    <el-table
      :ref="refTable"
      :data="recordsData"
      style="width: 100%;height: 100%;overflow: auto;"
      border
      highlight-current-row
      :show-summary="summary"
      :summary-method="getSummaries"
      :row-class-name="styleCell ? tableRowClassName : ''"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        v-if="multiSelection"
        type="selection"
        width="50"
      />
      <el-table-column
        v-else
        :type="multiSelection ? 'selection' : ''"
        width="50"
      >
        <template v-if="selection && currentRow.nrDocument === scope.row.nrDocument" slot-scope="scope">
          <i :class="currentRow.icon" />
        </template>
      </el-table-column>
      <el-table-column
        v-for="(valueOrder) in label"
        :key="valueOrder.columnName"
        :column-key="valueOrder.columnName"
        :label="valueOrder.label"
        width="auto"
        :min-width="!valueOrder.isNumeric ? valueOrder.size : valueOrder.size"
        :align="valueOrder.isNumeric ? 'right' : 'left'"
        :prop="valueOrder.columnName"
        :sortable="valueOrder.isNumeric"
      />
    </el-table>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
export default {
  name: 'TableFrom',
  props: {
    refTable: {
      type: String,
      default: 'TableFrom'
    },
    label: {
      type: Array,
      default: () => []
    },
    recordsData: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: ''
    },
    styleCell: {
      type: Boolean,
      default: false
    },
    isSelection: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Array,
      default: () => []
    },
    addSelection: {
      type: String,
      default: ''
    },
    multiSelection: {
      type: Boolean,
      default: false
    },
    summary: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentRow: {
        icon: 'el-icon-check'
      }
    }
  },
  watch: {
    selection(row) {
      this.currentRow = {
        ...this.currentRow,
        ...row[0]
      }
    }
  },
  mounted() {
    this.toggleSelection(this.selection)
    this.setCurrent(this.selection[0])
  },
  methods: {
    formatPrice,
    handleSelectionChange(selection, row) {
      this.$store.dispatch(this.addSelection, selection)
    },
    setCurrent(row) {
      this.currentRow = {
        ...this.currentRow,
        ...row
      }
    },
    handleCurrentChange(val) {
      this.currentRow = {
        ...this.currentRow,
        val
      }
      if (this.isSelection) {
        this.$store.dispatch(this.addSelection, [val])
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          const selectionRow = this.recordsData.find(record => record.NrDocument === row.NrDocument)
          this.$refs[this.refTable].toggleRowSelection(selectionRow)
        })
      } else {
        this.$refs[this.refTable].clearSelection()
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.Difference > 0) {
        'success-row'
      }
      return 'warning-row'
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Σ'
          return
        }
        const values = this.selection.map(item => {
          if (column.sortable) {
            return Number(item[column.property])
          } else {
            return ''
          }
        })
        if (values.every(value => value > 0) && !this.isEmptyValue(this.selection)) {
          sums[index] = this.formatPrice(values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0))
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-form {
    height: 100% !important;
    overflow: auto;
  }
</style>
<style>
  .el-table .warning-row {
    background:#ff4949a6;
  }
  .el-table .success-row {
    background: #8ff6bd80;
  }
</style>
