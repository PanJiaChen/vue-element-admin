<template>
  <div class="">
    <el-form ref="article" :model="article" :rules="rules">
      <div style="z-index: 1; height: 50px;">
        <div class="sub-navbar draft" style="top: 0px; z-index: 1;height: 45px;margin-top:-5px;">
          <button type="button" class="el-button el-button--success el-button--mini" style="margin-left: 10px;"><!----><!---->
            <span>发布</span>
          </button>
          <button type="button" class="el-button el-button--warning el-button--mini" @click="saveUEContent">
            <span>保存</span>
          </button>
        </div>
      </div>
      <el-form-item label="标题" label-width="120px" prop="title" style="margin-top:-5px">
        <el-input v-model="article.title" :rows="1" :minlength="4" :maxlength="50" type="text" placeholder="请输入标题(少于50字)" style="width:95%;"/>
      </el-form-item>
      <el-form-item label="收件人" label-width="120px" style="margin-bottom:12px;">
        <el-button type="success" size="mini" @click="showSelectUser">收件人</el-button>
      </el-form-item>
      <el-form-item label="用户上传附件:" label-width="120px" prop="upload" style="margin-top:-12px;">
        <el-radio-group v-model="article.upload">
          <el-radio :label="0">不支持上传</el-radio>
          <el-radio :label="1">支持上传</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="content" style="margin-top:-10px;">
        <div style="margin-left:15px;margin-right:25px;line-height:0px;">
          <vue-ueditor-wrap ref="ueditor" v-model="article.content" @ready="ready"/>
        </div>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogFormVisible" title="收件人">
      <el-button type="success" size="mini" style="margin-top:-150px;" @click="selectUser">
        添加收件人
      </el-button>
      <el-table
        :data="article.receiverList"
        :height="300"
        border
        style="width:100%;overflow:auto;">
        <el-table-column :label="$t('id')" align="center" min-width="10%">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" min-width="30%" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" min-width="30%" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.roles[0]==1">教师</span>
            <span v-if="scope.row.roles[0]==2">班级</span>
            <span v-if="scope.row.roles[0]==3">群组</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!disabled" :label="$t('table.actions')" align="center" min-width="30%" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleDeleteUser(scope.$index)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

    <showUser v-if="hackReset" ref="showUser" @listenToChildEvent="getSelectUser"/>
  </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import { saveArticle, fetchArticle } from '@/api/article'
import { fetchTeacherList, fetchGroupList } from '@/api/user'
import showUser from '@/views/notice/showUser'

export default {
  name: 'CreateForm',
  components: { VueUeditorWrap, showUser },
  data() {
    return {
      hackReset: false,
      disabled: false,
      dialogFormVisible: false,
      userList: [],
      articleId: this.$route.params.id,
      article: {
        id: undefined,
        fid: this.$store.state.user.fid,
        title: undefined,
        upload: 0,
        type: '',
        content: '',
        group: undefined,
        attachmentList: [],
        receiverList: [],
        status: 'published'
      },
      receiverList: [],
      listQuery: {
        fid: this.$store.state.user.fid,
        importance: undefined,
        name: undefined,
        type: undefined,
        sort: '+id'
      },
      input: '',
      users: undefined,
      groups: undefined,
      value7: '',
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 4, max: 50, message: '长度必须在4到50个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchArticle()
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    handleDeleteUser(index) {
      this.article.receiverList.splice(index, 1)
    },
    fetchArticle() {
      if (this.articleId) {
        fetchArticle(this.articleId).then(response => {
          if (response.data.code === 200) {
            this.article = response.data.result
            const route = Object.assign({}, this.tempRoute, { title: this.article.title })
            this.$store.dispatch('updateVisitedView', route)
          }
        })
      }
    },
    getSelectUser: function(data) {
      var tempList = []
      var userList = data.get('user')
      for (var index in userList) {
        var userReceiver = {}
        userReceiver.uid = userList[index].uid
        userReceiver.name = userList[index].name
        userReceiver.roles = [1]
        tempList.push(userReceiver)
      }
      var groupList = data.get('group')
      for (var i in groupList) {
        var groupReceiver = {}
        groupReceiver.uid = groupList[i].groupId
        groupReceiver.name = groupList[i].name
        groupReceiver.roles = [3]
        tempList.push(groupReceiver)
      }
      for (const v of tempList) {
        var flag = true
        for (const userData of this.article.receiverList) {
          if (v.uid === userData.uid && v.roles[0] === userData.roles[0]) {
            flag = false
            break
          }
        }
        if (flag) {
          this.article.receiverList.push(v)
        }
      }
    },
    showSelectUser() {
      this.dialogFormVisible = true
    },
    selectUser() {
      this.hackReset = false
      if (this.$refs.showUser) {
        this.$refs.showUser.handleModifyStatus()
      }
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    getReceivers(name) {
      if (name !== '') {
        this.listQuery.name = name
        fetchTeacherList(this.listQuery).then(response => {
          var data = response.data
          if (data.code === 200 && data.result.total > 0) {
            this.users = [{
              label: '用户',
              options: data.result.list
            }]
          } else {
            this.users = []
          }
        })
        fetchGroupList(this.listQuery).then(response => {
          var data = response.data
          if (data.code === 200 && data.result.total > 0) {
            this.groups = [{
              label: '组名',
              options: response.data.result.list
            }]
          } else {
            this.groups = []
          }
        })
      } else {
        this.users = []
        this.groups = []
      }
    },
    ready(editorInstance) {
      console.log(`编辑器实例${editorInstance.key}: `, editorInstance)
      // setInterval(this.getUEContent,10000)
    },

    getUEContent: function() {
      console.log(this.msg)
    },

    draft: function() {
      console.log(this.msg)
    },

    saveUEContent: function() {
      this.$refs['article'].validate((valid) => {
        if (valid) {
          saveArticle(this.article).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
            var path = this.$route
            var allOpenViews = this.$store.state.tagsView.visitedViews
            for (var index in allOpenViews) {
              if (allOpenViews[index].fullPath === path.fullPath) {
                this.$store.dispatch('delView', allOpenViews[index]).then(({ visitedViews }) => {
                  this.$router.push({ path: '/notice/list' })
                })
              }
            }
          })
        }
      })
    }
  }
}
</script>
<style>

</style>
