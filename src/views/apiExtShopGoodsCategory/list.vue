<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-button class="filter-item" @click="handleCreate" type="success" icon="el-icon-edit">添加</el-button>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="id" label="ID" align="center" width="100%"></el-table-column>
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          <font v-for="lv in scope.row.level-1" :key="lv">&#8195;&#8195;&#8195;&#8195;&#8195;</font>
          <font v-if="scope.row.level > 1">╚═══</font>
          <font>{{scope.row.name}}</font>
        </template>
      </el-table-column>
      <el-table-column prop="key" label="编号/类型" width="100%">
        <template slot-scope="scope">
          {{scope.row.key}} <br/> {{scope.row.type}}
        </template>
      </el-table-column>
      <el-table-column label="图标" width="100%" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.icon" :src="scope.row.icon" style="width:70px;" />
          <span v-if="!scope.row.icon">-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100%" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isUse">启用</el-tag>
          <el-tag type="danger" v-if="!scope.row.isUse">禁用</el-tag>
        </template>
			</el-table-column>
      <el-table-column label="添加/修改时间" width="170px">
        <template slot-scope="scope">
          {{scope.row.dateAdd}} <br/> {{scope.row.dateUpdate}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :rules="rules" ref="addEditPopForm" :model="pushData" label-position="left" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model.number="pushData.name" clearable @keyup.enter.native="handleCreateSave"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-col :span="4">
            <el-form-item prop="type">
              <el-input v-model.number="pushData.type" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">&nbsp;&nbsp;&nbsp;自定义类型，32个字符以内</el-col>
        </el-form-item>
        <el-form-item label="上级分类" prop="pid" >
          <el-select clearable v-model="pushData.pid" placeholder="请选择">
            <el-option label="顶级分类 " value="0">
              <span>顶级分类</span>
            </el-option>
            <el-option v-for="item in list" :key="item.value" :label="item.name" :value="item.id">
              <span>
                <span v-for="lv in item.level-1" :key="lv">&#8195;&#8195;&#8195;&#8195;&#8195;</span>
                <span v-if="item.level > 1">╚═══</span>
                {{item.name}}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编号">
          <el-col :span="4">
            <el-form-item prop="key">
              <el-input v-model.number="pushData.key" clearable @keyup.enter.native="handleCreateSave"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">&nbsp;&nbsp;&nbsp;自定义编号，32个字符以内</el-col>
        </el-form-item>
        <el-form-item label="上传图标">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            name="upfile"
            :headers="uploadUrlHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" prop="isUse" >
          <el-select v-model="pushData.isUse" placeholder="请选择">
            <el-option label="启用" value="true"></el-option>
            <el-option label="禁用" value="false"></el-option>
          </el-select>
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
import { fetchDataList, delData, saveData } from '@/api/apiExtShopGoodsCategory'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  computed: {
    ...mapGetters([
      'centerUserBase'
    ])
  },
  data() {
    return {
      imageUrl:undefined,
      uploadUrl:process.env.BASE_API + '/fileUpload',
      uploadUrlHeaders:{
        "X-Token":getToken()
      },

      rules: {
        name: [
          { required: true, message: '不能为空'}
        ],
        isUse: [
          { required: true, message: '不能为空'}
        ]
      },

      pushData: {
        dialogTitle : undefined,
        dialogFormVisible:false,

        id:undefined,
        name:undefined,
        type:undefined,
        pid:undefined,
        key:undefined,
        icon:undefined,
        isUse:undefined,
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.pushData.icon = res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type.indexOf('image/') != -1);
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是图片格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isJPG && isLt1M;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.list = null
      this.listLoading = true
      fetchDataList().then(response => {
        if (response.code == 0) {
          this.list = response.data
        }
        this.listLoading = false
      })
    },
    handleCreate(){
      this.pushData = Object.assign({}, this.pushDataTmp)
      this.pushData.dialogTitle = '增加分类'
      this.pushData.dialogFormVisible = true
      this.imageUrl = undefined
      this.$nextTick(() => {
        this.$refs['addEditPopForm'].clearValidate()
      })
    },
    handleUpdate(id){
      let updateObj = this.list.find(item => {
        return item.id == id
      })
      this.pushData = Object.assign({}, this.pushDataTmp, updateObj, {isUse:'' + updateObj.isUse})
      if (this.pushData.pid == 0) {
        this.pushData.pid = '0'
      }
      this.pushData.dialogTitle = '修改分类'
      this.imageUrl = undefined
      if (updateObj.icon) {
        this.imageUrl = new URL(updateObj.icon);
      }
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
