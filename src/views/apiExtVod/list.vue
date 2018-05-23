<template>
  <div class="app-container">
    
    <div class="filter-container">
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="名称" v-model="searchData.titleLike">
      </el-input>
      <el-input clearable @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" placeholder="视频ID" v-model="searchData.videoId">
      </el-input>
      <el-date-picker type="date" placeholder="添加时间起" v-model="searchData.dateAddBegin" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="添加时间止" v-model="searchData.dateAddEnd" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间起" v-model="searchData.dateUploadBegin" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-date-picker type="date" placeholder="更新时间止" v-model="searchData.dateUploadEnd" style="width: 200px;" class="filter-item"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-edit">上传视频</el-button>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55" row-key="id"></el-table-column>
      <el-table-column prop="videoId" label="视频ID"></el-table-column>
      <el-table-column prop="title" label="名称"></el-table-column>
      <el-table-column prop="statusStr" label="状态"></el-table-column>
      <el-table-column align="center" label="封面">
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div v-if="scope.row.coverUrl" slot="content"><img :src="scope.row.coverUrl" style="max-width:600px;"></div>
            <div v-else slot="content">-</div>
            <i class="el-icon-picture"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="视频地址">
        <template slot-scope="scope">
          <div><el-button type="text" @click='handleCopy(scope.row.fdMp4,$event)'>复制流畅Mp4地址</el-button></div>
          <div><el-button type="text" @click='handleCopy(scope.row.fdM3u8,$event)'>复制流畅M3u8</el-button></div>
          <div><el-button type="text" @click='handleCopy(scope.row.ldMp4,$event)'>复制标清Mp4</el-button></div>
          <div><el-button type="text" @click='handleCopy(scope.row.ldM3u8,$event)'>复制标清M3u8</el-button></div>
        </template>
      </el-table-column>
      <el-table-column prop="dateAdd" label="上传时间"></el-table-column>
      <el-table-column prop="dateUpload" label="更新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="delData(scope.row.id)" style="color:red">删除</el-button>
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

    <el-dialog :title="pushData.dialogTitle" :visible.sync="pushData.dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="reloadPage">
      <el-form ref="addEditPopForm" label-position="left" label-width="100px">
        <el-form-item label="选择视频">
          <input type="file" name="file" id="files"/>
        </el-form-item>
        <el-form-item label="视频格式">
          <div>支持 .3gp, .asf, .avi, .dat, .dv, .flv, .f4v, .gif, .m2t, .m3u8, .m4v, .mj2, .mjpeg, .mkv, .mov, .mp4, .mpe, .mpg, .mpeg, .mts, .ogg, .qt, .rm, .rmvb, .swf, .ts, .vob, .wmv, .webm.aac, .ac3, .acm, .amr, .ape, .caf, .flac, .m4a, .mp3, .ra, .wav, .wma</div>
        </el-form-item>
        <el-form-item label="上传进度">
          <select multiple="multiple" id="textarea" style="position:relative; width:100%; height:250px; vertical-align:top; border:1px solid #cccccc;"></select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reloadPage">取消</el-button>
        <el-button type="primary" @click="handleCreateSave">开始上传</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDataList, delData, authAndAddress } from '@/api/apiExtVod'
import { Message, MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'
import clip from '@/utils/clipboard'

var uploader,vm

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

      searchData:{
        titleLike:undefined,
        videoId:undefined,
        dateAddBegin:undefined,
        dateAddEnd:undefined,
        dateUploadBegin:undefined,
        dateUploadEnd:undefined,
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
    vm = this
  },
  methods: {
    reloadPage(){
      location.reload();
    },
    handleCopy(text, event) {
      clip(text, event)
    },
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
    handleCreate(){
      this.pushData.dialogTitle = '上传视频文件'
      this.pushData.dialogFormVisible = true
      this.$nextTick(() => {
        //this.$refs['addEditPopForm'].clearValidate()
        uploader = new AliyunUpload.Vod({
            // 文件上传失败
            'onUploadFailed': function (uploadInfo, code, message) {
                vm.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
            },
            // 文件上传完成
            'onUploadSucceed': function (uploadInfo) {
                vm.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
            },
            // 文件上传进度
            'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
                vm.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + (loadedPercent * 100.00).toFixed(2) + "%");
            },
            // STS临时账号会过期，过期时触发函数
            'onUploadTokenExpired': function (uploadInfo) {
                vm.log("onUploadTokenExpired");
            },
            onUploadCanceled:function(uploadInfo)
            {
                vm.log("onUploadCanceled:file:" + uploadInfo.file.name);
            },
            // 开始上传
            'onUploadstarted': function (uploadInfo) {
                authAndAddress(uploadInfo.file.name).then(res=>{
                  if (res.code != 0) {
                    Message({
                      message: res.msg,
                      type: 'error',
                      duration: 3 * 1000,
                      onClose: () => {
                        location.reload()
                      }
                    })
                    return;
                  }
                  uploader.setUploadAuthAndAddress(uploadInfo, res.data.uploadAuth, res.data.uploadAddress);
                  vm.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                })
            }
            ,
            'onUploadEnd':function(uploadInfo){
                vm.log("onUploadEnd: uploaded all the files");
            }
        });
        document.getElementById("files")
        .addEventListener('change', function (event) {
            let userData = '{"Vod":{"UserData":{"IsShowWaterMark":"false","Priority":"7"}}}'
            for(var i=0; i<event.target.files.length; i++) {
                vm.log("add file: " + event.target.files[i].name);
                uploader.addFile(event.target.files[i], null, null, null, userData);
            }
        });
      })
    },
    log(value){
      let textarea=document.getElementById("textarea");
      if (!value) {
          return;
      }
      let len = textarea.options.length;
      if (len > 0 && textarea.options[len-1].value.substring(0, 40) == value.substring(0, 40)) {
          //textarea.remove(len-1);
      } else if (len > 25) {
          textarea.remove(0);
      }

      let option=document.createElement("option");
      option.value=value,option.innerHTML=value;
      textarea.appendChild(option);
    },
    handleCreateSave(){
      uploader.startUpload();
      
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
