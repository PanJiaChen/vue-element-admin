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
  <div>
    <el-tabs v-if="!isEmptyValue(selectedInvoice)" type="border-card">
      <el-tab-pane :label="$t('form.match.title.invoice')">
        <table-from
          :label="labelTable"
          :records-data="selectedInvoice"
          :selection="selectedInvoice"
          :is-selection="true"
        />
      </el-tab-pane>
    </el-tabs>
    <el-tabs type="border-card">
      <el-tab-pane :label="$t('form.match.title.deliveryReceipt')">
        <br>
        <el-row>
          <template
            v-for="(option, index) in filtersSearch"
          >
            <el-col :key="index" :span="4">
              <el-checkbox v-model="option.value" :label="option.label" />
            </el-col>
          </template>
        </el-row>
        <br>
        <table-from
          :ref-table="ref"
          :label="labelTable"
          :records-data="receiptsList"
          :selection="selectedReceipts"
          :add-selection="selectReceipt"
          :multi-selection="true"
        />
      </el-tab-pane>
    </el-tabs>
    <el-form :inline="true" label-position="top" class="demo-form-inline">
      <template
        v-for="(item, index) in field"
      >
        <el-form-item :key="index" :label="item.label" style="width: 30%;text-align: center;">
          <el-input-number v-model="item.value" :controls="false" disabled />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import tableFrom from '../tableFrom'
import labelTable from '@/components/ADempiere/Form/VMatch/labelTable.js'
export default {
  name: 'Receipt',
  components: {
    tableFrom
  },
  data() {
    return {
      labelTable,
      key: 0,
      field: [
        {
          label: this.$t('form.match.field.toAssigned'),
          value: 0
        },
        {
          label: this.$t('form.match.field.assigning'),
          value: 0
        },
        {
          label: this.$t('form.match.field.difference'),
          value: 0
        }
      ],
      filtersSearch: [
        {
          label: this.$t('form.match.filtersSearch.sameBusinessPartner'),
          columnName: 'C_BPartner_ID',
          value: false
        },
        {
          label: this.$t('form.match.filtersSearch.sameProduct'),
          columnName: 'product',
          value: false
        },
        {
          label: this.$t('form.match.filtersSearch.sameQuantity'),
          columnName: 'quantity',
          value: false
        }
      ],
      ref: 'Receipt',
      selectReceipt: 'selectedelectedReceiptsMatch'
    }
  },
  computed: {
    receiptsList() {
      let receipts = this.$store.getters.getInvoiceMatch
      this.filtersSearch.forEach(filter => {
        if (filter.value) {
          receipts = this.filterBills(receipts, filter)
        }
      })
      return receipts
    },
    selectedInvoice() {
      return this.$store.getters.getSelectedInvoceMatch
    },
    selectedReceipts() {
      return this.$store.getters.getSelectedReceiptsMatch
    }
  },
  watch: {
    selectedReceipts(value) {
      this.assignmentSummary({
        toAssigned: this.field[this.key],
        assigning: this.field[1],
        difference: this.field[2],
        quantity: this.selectedInvoice[this.key].quantity
      })
    }
  },
  mounted() {
    if (!this.isEmptyValue(this.selectedInvoice)) {
      this.assignmentSummary({
        toAssigned: this.field[this.key],
        assigning: this.field[1],
        difference: this.field[2],
        quantity: this.selectedInvoice[this.key].quantity
      })
    }
  },
  methods: {
    sumQuantity(cash) {
      let sum = 0
      if (cash) {
        cash.forEach((pay) => {
          sum += pay.quantity
        })
      }
      return sum
    },
    filterBills(recordList, element) {
      return recordList.filter(record => {
        if (record[element.columnName] === this.selectedInvoice[this.key][element.columnName]) {
          return record
        }
      })
    },
    assignmentSummary({ toAssigned, assigning, difference, quantity }) {
      toAssigned.value = quantity
      assigning.value = this.sumQuantity(this.selectedReceipts)
      difference.value = toAssigned.value - this.sumQuantity(this.selectedReceipts)
    }
  }
}
</script>
