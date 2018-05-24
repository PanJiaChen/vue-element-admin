<template>

  <div class="app-container">

<div class="filter-container">
<h4>设置信息</h4>
<el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px;" @click="handleCreate" type="success" icon="el-icon-edit">设置</el-button>
</div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" :show-header="false" border fit highlight-current-row empty-text="暂无数据">
      <el-table-column prop="name" label="name"></el-table-column>
      <el-table-column prop="val" label="val"></el-table-column>
    </el-table>

<el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="appid" prop="appid" >
          <el-input v-model.text="pushData.appid" type="text" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="privateKey" prop="privateKey" >
          <el-input v-model.textarea="pushData.privateKey" type="textarea " clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushData.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { info, saveData } from '@/api/centerUserAliappKey'
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

      rules: {
        appid: [
          { required: true, message: '不能为空'}
        ],
        privateKey: [
          { required: true, message: '不能为空'}
        ]
      },



      multipleSelection: [],
      appid:null,
      privateKey:null,
      list: null,
      listLoading: true,
      statisticsData:{},
      pushData: {
              dialogTitle : undefined,
              dialogFormVisible:false,

              id:undefined,
              appid:undefined,
              privateKey:undefined
            }
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
      info().then(response => {
        if (response.code == 0) {
          this.appid = response.data.appid,
          this.privateKey = response.data.privateKey,
          this.list = [{name: 'appid',val: response.data.appid}, {name: 'privateKey',val: response.data.privateKey}]
        }else if(response.code == 700){
        this.list = [{name: 'appid',val: '未设置'}, {name: 'privateKey',val: '未设置'}]
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp,{appid:this.appid, privateKey:this.privateKey})
      this.pushData.dialogTitle = '支付宝小程序设置'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleCreateSave(){
      this.$refs['addEditPopForm'].validate((valid) => {
        if (valid) {
          saveData(this.pushData).then((res) => {
            this.pushData.dialogFormVisible = false
            if (res.code == 0) {
              Message({
                message: '操作成功',
                type: 'success',
                duration: 1 * 1000,
                onClose: () => {
                  this.fetchData()
                }
              })
            } else {
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(e=>{
            console.error(e);
          })
        }
      })
    }
  }
}
</script>
