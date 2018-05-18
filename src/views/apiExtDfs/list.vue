<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="searchData.fileType" placeholder="文件类型">
        <el-option label="图片" value="0"></el-option>
        <el-option label="音频" value="1"></el-option>
        <el-option label="其他" value="2"></el-option>
      </el-select>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="文件后缀" v-model="searchData.suffix">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="文件名称" v-model="searchData.urlLike">
      </el-input>
      <el-date-picker type="date" placeholder="上传时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="上传时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="id"></el-table-column>
      <el-table-column prop="fileTypeStr" label="类型"></el-table-column>
      <el-table-column prop="suffix" label="文件后缀"></el-table-column>
      <el-table-column prop="sizeStr" label="容量"></el-table-column>
      <el-table-column label="Url">
        <template slot-scope="scope">
          <a :href="scope.row.urlFull" target="_blank">{{ scope.row.urlFull }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="dateAdd" label="购买时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" class='delete' @click="delData(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button style='margin-top:20px' type="danger" @click="delDataMore">批量删除</el-button>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow" style="margin-top:20px;">
    </el-pagination>
  </div>
</template>

<script>
import { fetchDataList, statistics, delData } from '@/api/apiExtDfs'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      page:1,
      pageSize:10,
      totalRow:0,

      searchData:{
        fileType:undefined,
        suffix:'',
        urlLike:'',
        dateAddBegin:'',
        dateAddEnd:''
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
    }
  },
  created() {
    this.fetchData()
    this.statistics()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList(this.page, this.pageSize, this.searchData).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    statistics(){
      statistics().then(res => {
        // 弹框点击确定调整支付宝付款
        this.statisticsData = res.data
      })
    },
    delData(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(id).then(res => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              this.fetchData()
            }
          })
        })
      }).catch(() => {});
    },
    delDataMore(){
      if (!this.multipleSelection.length) {
        Message({
          message: '请先选择需要删除的数据',
          type: 'error',
          duration: 1 * 1000
        })
        return
      }
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.multipleSelection.forEach(obj => {
          delData(obj.id).then(res => {
            this.fetchData()
          })
        })
      }).catch(() => {});
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}

</style>
