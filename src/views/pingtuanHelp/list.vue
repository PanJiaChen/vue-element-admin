<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="拼团ID" v-model="searchData.pingtuanId">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="团号" v-model="searchData.pingtuanJoiner">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="订单ID" v-model="searchData.orderId">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="商品ID" v-model="searchData.goodsId">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="searchData.mobileUser">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="用户昵称" v-model="searchData.nick">
      </el-input>
      <el-date-picker type="date" placeholder="购买时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="购买时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column label="序号">
        <template slot-scope="scope">
         {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column prop="pingtuanId" label="拼团ID"></el-table-column>
      <el-table-column prop="pingtuanJoiner" label="团号"></el-table-column>
      <el-table-column prop="orderId" label="订单ID"></el-table-column>
      <el-table-column prop="goodsId" label="商品ID"></el-table-column>
      <el-table-column label="团长手机号码">
        <template slot-scope="scope">
         {{userMapJoin[scope.row.uid].mobile}}
        </template>
      </el-table-column>
      <el-table-column label="团长昵称">
        <template slot-scope="scope">
         {{userMapJoin[scope.row.uid].nick}}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号码">
        <template slot-scope="scope">
         {{userMapHelp[scope.row.uidHelp].mobile}}
        </template>
      </el-table-column>
      <el-table-column label="用户昵称">
        <template slot-scope="scope">
         {{userMapHelp[scope.row.uidHelp].nick}}
        </template>
      </el-table-column>
      <el-table-column prop="dateAdd" label="购买时间"></el-table-column>
    </el-table>
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
import { fetchDataList } from '@/api/pingtuanHelp'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      page:1,
      pageSize:10,
      totalRow:0,

      rules: {
        goodsId: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        number: [
          { required: true, message: '不能为空'},
          { type:'integer', message: '必须为数字'}
        ],
        originalPrice: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        minPrice: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        helpPriceMin: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        helpPriceMax: [
          { required: true, message: '不能为空'},
          { type:'number', message: '必须为数字'}
        ],
        status: [
          { required: true, message: '不能为空'}
        ],
        dateAddStr: [
          { required: true, message: '不能为空'}
        ],
        dateEndStr: [
          { required: true, message: '不能为空'}
        ],
      },

      searchData:{
        pingtuanId:undefined,
        pingtuanJoiner:undefined,
        orderId:undefined,
        goodsId:undefined,
        mobileUser:undefined,
        nick:undefined,
        status:undefined,
        dateAddBegin:undefined,
        dateAddEnd:undefined,
        dateUpdateBegin:undefined,
        dateUpdateEnd:undefined,
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        goodsId:undefined,
        number:undefined,
        originalPrice:undefined,
        minPrice:undefined,
        helpPriceMin:undefined,
        helpPriceMax:undefined,
        status:undefined,
        dateAddStr:undefined,
        dateEndStr:undefined
      },

      multipleSelection: [],
      list: null,
      listLoading: true,
      statisticsData:{}
    }
  },
  created() {
    this.pushDataTmp = Object.assign({}, this.pushData)
    this.fetchData()
  },
  mounted() {
    
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
          this.userMapJoin = response.data.userMapJoin
          this.userMapHelp = response.data.userMapHelp
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
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
