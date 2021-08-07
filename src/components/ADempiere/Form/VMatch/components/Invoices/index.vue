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
  <el-tabs type="border-card">
    <el-tab-pane :label="$t('form.match.title.invoice')">
      <table-from
        :ref-table="ref"
        :label="labelTable"
        :records-data="invoiceList"
        :selection="selectedInvoice"
        :add-selection="selectInvoice"
        :is-selection="true"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import tableFrom from '../tableFrom'
import labelTable from '@/components/ADempiere/Form/VMatch/labelTable.js'
export default {
  name: 'Invoices',
  components: {
    tableFrom
  },
  data() {
    return {
      labelTable,
      ref: 'Match',
      selectInvoice: 'selectedInvoceMatch'
    }
  },
  computed: {
    invoiceList() {
      return this.$store.getters.getInvoiceMatch
    },
    selectedInvoice() {
      return this.$store.getters.getSelectedInvoceMatch
    }
  }
}
</script>
