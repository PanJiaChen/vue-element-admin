<template>
  <el-footer style="height: 30px;">
    <div style="float: right;">
      <el-pagination
        :current-page="currentPage"
        small
        layout="slot, total, prev, pager, next"
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
