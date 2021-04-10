<template>
  <div>
    <!-- <buttons funid="insp_det" style="margin:10px 10px" @editDelete="editDelete" @upload="upload" /> -->
    <div class="buttons">
      <el-upload
        ref="upload"
        style="margin-bottom: 10px;"
        class="upload-demo"
        :action="baseUrl"
        :data="formData"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-change="onChange"
        :on-success="onSuccess"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button size="small" type="primary" @click="editDelete">批量删除</el-button>
    </div>
    <div>
      <el-table
        ref="table"
        v-loading="loading"
        :data="data"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
        @cell-dblclick="cellDblclick"
      >
        <template v-for="(d,i) in tableHeader">
          <el-table-column v-if="d.type && d.type === 'selection'" :key="i" :type="d.type" :fixed="d.fixed" />
          <el-table-column
            v-else-if="d.show !== false"
            :key="i"
            :prop="d.prop"
            :label="d.label"
            :width="d.width"
            :min-width="d.minWidth"
            :class-name="d.className"
            :fixed="d.fixed"
          >
            <template slot-scope="scope">
              <div v-if="d.label==='附件名称'">
                <a :href="href" @click="downLoadAttach(scope.row)">
                  {{
                    scope.row.sys_attach__attach_name
                  }}
                </a>
              </div>
              <div v-else-if="d.label==='上传日期'">
                {{ parseTime(scope.row.sys_attach__upload_date) }}
              </div>
              <div v-else-if="d.label === '操作'">
                <el-button icon="el-icon-delete" style="color:#F56C6C" type="text" title="删除" @click="Delete(scope.row)" />
              </div>
              <div v-else>{{ scope.row[d.prop] }}</div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="pager.pageNo"
          :page-sizes="[10, 30, 50, 100, 500]"
          :page-size="pager.pageSize"
          :total="pager.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </div>
    </div>

  </div>
</template>

<script>
import api from './api'
import store from '@/store/modules/user'
import { parseTime } from '@/utils/index'

var roles = store.state.roles.replace(/;/g, '')
export default {
  name: 'SafeIdsp',
  components: {
    // buttons
  },
  props: {
    dataId: {
      type: Array,
      default: () => []
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
      parseTime,
      loading: false,
      data: [],
      deptTree: [],
      ids: [],
      levels: [],
      pager: {
        pageNo: 0,
        pageSize: 10,
        total: 0
      },
      tableHeader: [
        {
          prop: 'selection',
          type: 'selection',
          fixed: 'left',
          width: '100px',
          show: true
        }, {
          prop: 'sys_attach__attach_name',
          label: '附件名称',
          width: '250px',
          show: true
        }, {
          prop: 'sys_attach__upload_user',
          label: '上传人',
          width: '100px',
          show: true
        },
        {
          prop: 'sys_attach__upload_date',
          label: '上传日期',
          width: '150px',
          show: true
        },
        {
          prop: 'opration',
          label: '操作',
          width: '100px',
          minWidth: '120px',
          show: true
        }],
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
      href: ''
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
</style>
