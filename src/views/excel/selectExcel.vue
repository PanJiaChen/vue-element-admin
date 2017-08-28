<template>
  <div class="app-container">
    <el-button style='margin-bottom:20px' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出已选择项</el-button>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row @selection-change="handleSelectionChange"
      ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column align="center" label='ID' width="95">
        <template scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="文章标题">
        <template scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="95" align="center">
        <template scope="scope">
          <el-tag>{{scope.row.author}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="阅读数" width="115" align="center">
        <template scope="scope">
          {{scope.row.pageviews}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="发布时间" width="220">
        <template scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      multipleSelection: [],
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = ['序号', '文章标题', '作者', '阅读数', '发布时间']
          const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
          const list = this.multipleSelection
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '列表excel')
          this.$refs.multipleTable.clearSelection()
          this.downloadLoading = false
        })
      } else {
        this.$message({
          message: '请至少选择一条记录',
          type: 'warning'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
