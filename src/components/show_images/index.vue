<template>
  <el-card>
    <div v-for="(item , i) in imgList" :key="i" class="img">
      <el-image :preview-src-list="imgPathList" :src="baseUrl +'?funid=sys_attach&pagetype=editgrid&eventcode=down&nousercheck=1&dataType=byte&keyid='+ item.sys_attach__attach_id +'&is_highimage=1'" />
    </div>
  </el-card>
</template>

<script>
import api from './api'
import store from '@/store/modules/user'

var roles = store.state.roles.replace(/;/g, '')
export default {
  name: 'SafeIdsp',
  components: {
    // buttons
  },
  props: {
    dataId: {
      type: String,
      default: null
    },
    tableName: {
      type: String,
      default: null
    },
    funId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      deptTree: [],
      ids: [],
      levels: [],
      pager: {
        pageNo: 0,
        pageSize: 100,
        total: 0
      },
      value: '',
      dept_id: '',
      level: '',
      id: '',
      parent_id: '',
      form: {
        dept_name: '',
        dept_code: '',
        memo: ''
      },
      dialogFormVisible: false,
      dialogEditVisible: false,
      formLabelWidth: '120px',
      auditForm: {},
      saveFrom: {},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'sys_dept__dept_name'
      },
      treeList: [],
      whereSql: false,
      whereValue: '',
      formData: {},
      attach_path: null,
      baseUrl: window.location.origin + '/bwhse/fileAction.do',
      href: '',
      imgList: [],
      imgPathList: []
    }
  },
  created() {
    this.getList()
    this.initFormData()
  },
  mounted() {
  },
  methods: {
    getList() {
      this.loading = true
      let pageNo = this.pager.pageNo * this.pager.pageSize - this.pager.pageSize
      if (pageNo < 0) {
        pageNo = 0
      }
      api.getDate(
        this.pager.pageSize,
        pageNo,
        this.dataId,
        this.tableName
      ).then(data => {
        if (data.success) {
          this.data = data.data.root

          this.imgList = this.data.filter(d => {
            return d.sys_attach__content_type === 'image/png'
          })
          this.imgPathList = this.imgList.map(d => {
            return `${this.baseUrl}?funid=sys_attach&pagetype=editgrid&eventcode=down&nousercheck=1&dataType=byte&keyid=${d.sys_attach__attach_id}&is_highimage=1`
          })
          console.log(this.imgList, 'this.imgList')
          this.pager.total = data.data.total
          setTimeout(() => {
            this.loading = false
          }, 200)
        } else {
          this.$message.error(data.message)
        }
      })
    },
    initFormData() {
      this.formData.attach_path = ''
      this.formData.funid = 'sys_attach'
      this.formData.eventcode = 'create'
      this.formData.nousercheck = '1'
      this.formData.table_name = this.tableName
      this.formData.datafunid = this.funId
      this.formData.user_id = 'administrator'
      this.formData.dataid = this.dataId[0]
    },
    create() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const data = `funid=sys_dept&parentId=${this.dept_id}&levelCol=sys_dept.dept_level&keyid=&pagetype=editgrid&eventcode=save_eg&sys_dept__dept_code=${this.form.dept_code}&sys_dept__dept_name=${this.form.dept_name}&sys_dept__memo=${this.form.memo}&sys_dept__is_novalid=0&sys_dept__dept_id=&sys_dept__dept_level=${Number(this.level) + 1}&user_id=administrator&dataType= json`
          api.Crerte(data).then(data => {
            if (data.success) {
              this.getList()
              this.dialogFormVisible = false
              this.$refs['form'].resetFields()
              this.form.dept_name = ''
              this.form.dept_code = ''
              this.$message.success('新增成功！')
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    Delete(row) {
      this.ids = []
      this.ids.push(row.sys_attach__attach_id)
      this.editDelete()
    },
    editDelete() {
      if (this.ids && this.ids.length > 0) {
        this.$confirm('确认删除附件？').then(() => {
          api.Delete(this.ids).then(data => {
            if (data.success) {
              this.getList()
              this.$message.success('删除成功！')
            } else {
              this.$message.error(data.message)
            }
          })
        }).catch(() => {})
      } else {
        this.$message.warning('请选择数据进行删除')
      }
    },
    editSave() {
      console.log('editSave')
    },
    upload() {
      console.log('upload')
    },
    edit(row) {
      this.id = row.attach_id
      this.parent_id = this.id.substring(0, this.id.length - 4)
      console.log(this.parent_id, this.id)
      this.auditForm = row
      this.dialogEditVisible = true
    },
    auditFormChange(form) {
      this.saveFrom = form
    },
    cellDblclick(row) {
    },
    sizeChange(size) {
      this.pager.pageSize = size
      this.getList()
    },
    pageChange(page) {
      this.pager.pageNo = page
      this.getList()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.ids = val.map(d => d.sys_attach__attach_id)
    },
    async downLoadAttach(row) {
      const timestamp = new Date().getTime()
      this.href = `${this.baseUrl}?funid=sys_attach&keyid=${row.sys_attach__attach_id}&pagetype=editgrid&eventcode=down&user_id=${roles}&dataType=byte&_dc=${timestamp}`
      // await api.downLoad(row.sys_attach__attach_id)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    onChange(file) {
      this.formData.attach_path = file.raw
    },
    onSuccess() {
      this.$message.success('上传成功！')
      this.getList()
      this.$refs.upload.clearFiles()
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-card {
    margin-top: 10px;
  }
  .el-table__row {
    a {
      color: blue;
      text-decoration: underline;
    }
  }
  .buttons{
    display: flex;
  }
  .el-button--primary {
    height: 26.8px;
    margin-right: 10px;
  }
  .pagination{
    overflow: auto;
  }
  .img{
    display: inline-block;
    width: 188px;
    height: 108px;
    text-align: center;
    line-height: 58px;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 2px 2px 5px;
    margin-right: 4px;
    box-sizing: border-box;
    padding: 10px;
    margin: 20px;
    .el-image{
      width: 100%;
      height: 100%;
    }
  }
</style>
