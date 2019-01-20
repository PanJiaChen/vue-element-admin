<template>
  <div id="app">
    <div class="fm-header">
      <img class="fm-logo" src="./assets/logo.png">
      <div class="fm-title">表单设计器</div>

      <div style="color: #fff; font-size: 13px; position: absolute; top: 24px; left: 200px;">
        QQ交流群：902048874
      </div>

      <div class="fm-link">
        <a href="https://github.com/GavinZhuLei/vue-form-making">GitHub</a>
        <a href="https://gitee.com/gavinzhulei/vue-form-making">码云</a>
        <a href="http://www.xiaoyaoji.cn" target="_blank">小幺鸡接口文档</a>
      </div>
    </div>
    <div class="fm-container"><router-view/></div>
  </div>
</template>
<script>
import FormMaking from 'form-making'
import 'form-making/dist/FormMaking.css'

export default {
  name: 'CreateForm',
  components: { FormMaking },
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
  },
  methods: {
    handleDeleteUser(index) {
      this.article.receiverList.splice(index, 1)
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
    ready(editorInstance) {
      console.log(`编辑器实例${editorInstance.key}: `, editorInstance)
      // setInterval(this.getUEContent,10000)
    },

    getUEContent: function() {
      console.log(this.msg)
    },

    draft: function() {
      console.log(this.msg)
    }
  }
}
</script>
<style>

</style>

