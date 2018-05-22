<template>
  <div class="app-container">
    <div>
      <el-tag type="info" style="margin-bottom:20px;">
        购买视频包:
      </el-tag>
      <el-tag type="danger" style="margin-bottom:20px;">
        <a @click="goBuy('vod_100')">100元视频包</a>
      </el-tag>
      <el-tag type="danger" style="margin-bottom:20px;">
        <a @click="goBuy('vod_500')">500元视频包</a>
      </el-tag>
      <el-tag type="danger" style="margin-bottom:20px;">
        <a @click="goBuy('vod_1000')">1000元视频包</a>
      </el-tag>
      <el-tag type="danger" style="margin-bottom:20px;">
        <a @click="goBuy('vod_2000')">2000元视频包</a>
      </el-tag>
    </div>
    <div>
      <el-tag type="info" style="margin-bottom:20px;">
        购买存储包:
      </el-tag>
      <el-tag type="danger" style="margin-bottom:20px;">
        <a @click="goBuy('store_100GB')">100GB存储包</a>
      </el-tag>
      <el-tag type="danger" style="margin-bottom:20px;">
        <a @click="goBuy('store_500GB')">500GB存储包</a>
      </el-tag>
      <el-tag type="danger" style="margin-bottom:20px;">
        <a @click="goBuy('store_1T')">1TB存储包</a>
      </el-tag>
      <el-tag type="danger" style="margin-bottom:20px;">
        <a @click="goBuy('store_2T')">2TB存储包</a>
      </el-tag>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row empty-text="暂无数据">
      <el-table-column prop="keyStr" label="名称"></el-table-column>
      <el-table-column prop="number" label="资源包数量"></el-table-column>
      <el-table-column prop="numberLeft" label="剩余数量"></el-table-column>
      <el-table-column label="支付状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isPay">已支付</el-tag>
          <el-tag type="danger" v-if="!scope.row.isPay">未支付</el-tag>
        </template>
			</el-table-column>
      <el-table-column prop="dateAdd" label="购买时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" class='delete' @click="delResource(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
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


    <el-dialog title="在线支付" :visible.sync="dialogTableVisible">
      <form :action="alipayPostData.gateway" method="POST" target="_blank">
        <input type="hidden" v-for="(v, k) in alipayPostData.params" v-bind:key="k" :name="k" :value="v" />
        <el-button type="success" native-type="submit" round>打开支付宝</el-button>
      </form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDataList, buyResource, delResource } from '@/api/centerUserResourceBundle'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      page:1,
      pageSize:10,
      totalRow:0,


      list: null,
      listLoading: true,
      dialogTableVisible : false,
      alipayPostData:{}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList(this.page, this.pageSize).then(response => {
        if (response.code == 0) {
          this.list = response.data.result
          this.totalRow = response.data.totalRow
        }
        this.listLoading = false
      })
    },
    goBuy(key){
      buyResource(key).then(res => {
        // 弹框点击确定调整支付宝付款
        this.alipayPostData = res.data;
        this.dialogTableVisible = true;
      })
    },
    delResource(id){
      this.$confirm('删除无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delResource(id).then(res => {
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
    }
  }
}
</script>
