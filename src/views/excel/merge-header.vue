<template>
  <div class="app-container">

    <el-button :loading="downloadLoading" style="margin-bottom:20px" type="primary" icon="el-icon-document" @click="handleDownload">Export</el-button>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Id" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Main Information" align="center">
        <el-table-column label="Title">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Author" width="110" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.author }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Readings" width="115" align="center">
          <template slot-scope="scope">
            {{ scope.row.pageviews }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="Date" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { parseTime } from '@/utils'

export default {
  name: 'MergeHeader',
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const multiHeader = [['Id', 'Main Information', '', '', 'Date']]
          const header = ['', 'Title', 'Author', 'Readings', '']
          const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
          const list = this.list
          const data = this.formatJson(filterVal, list)
          const merges = ['A1:A2', 'B1:D1', 'E1:E2']
          excel.export_json_to_excel({
            multiHeader,
            header,
            merges,
            data
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
