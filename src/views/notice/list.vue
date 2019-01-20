<template>
  <div class="app-container">
    <div v-if="flag">
      <div id="dg" style="position: fixed;right: 20px;bottom: 50px;">
        <el-button style="margin-left: 10px;" type="mini" size="small" @click="showDetail">返回</el-button>
      </div>
      <div style="margin-top:-20px;">
        <span v-html="list[2].content"/>
      </div>
    </div>
    <div v-if="!flag">
      <el-table v-loading.body="listLoading" :show-overflow-tooltip="true" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" width="150px" label="发布者">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="发布时间">
          <template slot-scope="scope">
            <span>{{ scope.row.modifyTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" max-width="500px" align="left" label="标题">
          <template slot-scope="scope">
            <router-link :to="{path: '/notice/'+scope.row.articleId}" class="link-type" target="_blank">
              <span>{{ scope.row.title }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column width="300px" align="left" label="附件">
          <template slot-scope="scope">
            <span v-if="scope.row.articleAttachment && scope.row.articleAttachment.attachmentName" class="el-tag el-tag--info el-tag--small">
              <a class="link-type" @click="download(scope.row.articleAttachment.url, scope.row.articleAttachment.attachmentName)">{{ scope.row.articleAttachment.attachmentName }}</a>
              <i class="el-tag__close el-icon-close" @click="deleteAttachment(scope.row)"/>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('action')" align="center" width="150">
          <template slot-scope="scope">
            <el-button style="margin:5px;float:right">
              <el-dropdown class="avatar-container right-menu-item" trigger="click">
                <i style="cursor:pointer" class="el-icon-caret-bottom"/>
                <el-dropdown-menu slot="dropdown">
                  <router-link :to="'/notice/edit/'+scope.row.articleId">
                    <el-dropdown-item>
                      {{ $t('edit') }}
                    </el-dropdown-item>
                  </router-link>
                  <el-dropdown-item divided>
                    <span style="display:block;" @click="showUploadData(scope.row)">查 看</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <span style="display:block;" @click="deleteArticle(scope.row)">{{ $t('delete') }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
            <el-upload
              v-if="scope.row.upload===1"
              :action="importFileUrl"
              :on-remove="handleRemove"
              :data="uploadData"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :file-list="scope.row.attachmentList"
              :show-file-list="false"
              style="float:left;margin:5px;"
              name="file"
            ><el-button size="mini" @click="handleUpdate(scope.row)"><i class="el-icon-upload el-icon--right"/>上传</el-button>

            </el-upload>

          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <uploadUser ref="uploadUser"/>
  </div>
</template>

<script>
import { fetchList, deleteArticle } from '@/api/article'
import { downloadFile, deleteAttachment } from '@/api/user'
import uploadUser from '@/views/notice/uploadUser'

export default {
  name: 'ArticleList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    uploadUser
  },
  data() {
    return {
      importFileUrl: window.UEDITOR_HOME_URL + 'ueditor/importFile',
      uploadData: {
        noticeId: undefined
      },
      attachmentList: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      list: null,
      total: 0,
      limit: 1,
      flag: false,
      count: 123,
      rowIndex: undefined,
      showReviewer: false,
      dialogPvVisible: false,
      listLoading: true,
      listQuery: {
        fid: this.$store.getters.user.fid,
        page: 1,
        limit: 20
      },
      selectRow: undefined
    }
  },
  created() {
    this.getList()
  },
  methods: {
    deleteArticle(row) {
      deleteArticle(row.id).then(() => {
        fetchList(this.listQuery).then(response => {
          this.list = response.data.result.list
          this.total = response.data.result.total
          this.listLoading = false
        }).catch((error) => {
          alert(error)
        })
      })
    },
    download(url, name) {
      downloadFile(url, name)
    },
    showUploadData(item) {
      this.$refs.uploadUser.handleModifyStatus(item)
    },
    deleteAttachment(row) {
      this.$confirm('您确定删除吗？').then(_ => {
        deleteAttachment(row.articleAttachment).then(() => {
          row.articleAttachment = undefined
        })
      }).catch(_ => {
      })
    },
    handleUpdate(row) {
      this.uploadData.noticeId = row.id
      this.selectRow = row
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.result.list
        this.total = response.data.result.total
        this.listLoading = false
      }).catch((error) => {
        alert(error)
      })
    },
    handleRemove(file, attachmentList) {
      alert(file, attachmentList)
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    showDetail() {
      this.flag = !this.flag
    },
    handlePreview(file) {
      this.$message.warning(`file url = ` + file.url)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSuccess(response, file, attachmentList) {
      if (response == null) {
        return
      }
      this.selectRow.attachmentList = []
      this.selectRow.articleAttachment = response
      this.showReviewer = true
    },
    handleExceed(files, attachmentList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + attachmentList.length} 个文件`)
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

.demo-block {
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    margin:20px;
}

</style>
