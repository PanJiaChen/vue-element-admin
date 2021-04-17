<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <el-footer style="height: 30px;">
    <div style="float: right;">
      <el-pagination
        small
        layout="slot, total, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handleChangePage"
      >
        <template v-slot>
          <span v-if="isSelection">
            {{ $t('table.dataTable.selected') }}: {{ selection }} / <!-- show total records -->
          </span>
        </template>
      </el-pagination>
    </div>
  </el-footer>
</template>

<script>
export default {
  name: 'CustomPagination',
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: undefined
    },
    panelType: {
      type: String,
      default: 'window'
    },
    currentPage: {
      type: Number,
      default: undefined
    },
    selection: {
      type: Number,
      default: undefined
    },
    pageSize: {
      type: Number,
      default: 50
    },
    total: {
      type: Number,
      default: undefined
    },
    handleChangePage: {
      type: Function,
      default: (pageNumber) => {
        this.$store.dispatch('setPageNumber', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          pageNumber,
          panelType: this.panelType
        })
      }
    }
  },
  computed: {
    isSelection() {
      if (this.isEmptyValue(this.selection)) {
        return false
      }
      return true
    }
  }
}
</script>
