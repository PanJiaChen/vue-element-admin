<template>
  <div class="app-container">
    <div class="head">
      <div>
        <el-button type="primary" @click="audit">提交</el-button>
        <el-button type="primary" @click="upload">图文附件</el-button>
      </div>
      <Search funid="hidden_review" @search="search" />
    </div>
    <el-card>
      <el-table
        ref="deptTable"
        :data="list"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
        @cell-dblclick="cellDblclick"
      >
        <el-table-column type="index" fixed="left" width="35px" />
        <template v-for="(d,i) in tableHeader">
          <el-table-column v-if="d.type && d.type === 'selection'" :key="i" :type="d.type" :fixed="d.fixed" />
          <el-table-column
            v-else
            :key="i"
            :prop="d.prop"
            :label="d.label"
          >
            <template slot-scope="scope">
              <div v-if="d.label==='隐患状态'">
                <el-tag v-if="scope.row.hidden_danger__hidden_state == 4" size="warning">{{
                  scope.row.hidden_danger__hidden_state == 1 ? '排查中' : scope.row.hidden_danger__hidden_state == 2 ? '待整改' :scope.row.hidden_danger__hidden_state == 3 ? '整改中' :scope.row.hidden_danger__hidden_state == 4 ? '待验收' : '已验收'
                }}</el-tag>
                <el-tag v-if="scope.row.hidden_danger__hidden_state == 5" size="success">{{
                  scope.row.hidden_danger__hidden_state == 1 ? '排查中' : scope.row.hidden_danger__hidden_state == 2 ? '待整改' :scope.row.hidden_danger__hidden_state == 3 ? '整改中' :scope.row.hidden_danger__hidden_state == 4 ? '待验收' : '已验收'
                }}</el-tag>
              </div>
              <div v-else-if="d.label==='检查时间'">
                {{ parseDay(scope.row.hidden_danger__check_date) }}
              </div>
              <div v-else-if="d.label==='整改期限'">
                {{ parseDay(scope.row.hidden_danger__reform_limit) }}
              </div>
              <div v-else-if="d.label === '操作'">
                <el-button icon="el-icon-view" type="text" title="编辑" @click="edit(scope.row)" />
                <el-button v-if="scope.row.attach.length <= 0" icon="el-icon-folder" type="text" title="查看附件" @click="checkAttach(scope.row)" />
                <el-button v-else icon="el-icon-folder-opened" type="text" title="查看附件" @click="checkAttach(scope.row)" />
                <!-- <el-button v-if="scope.row.status !== 'NULLIFY'" icon="el-icon-delete" style="color:#F56C6C" type="text" title="删除" @click="Delete(scope.row)" /> -->
              </div>
              <div v-else>{{ scope.row[d.prop] }}</div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
        :current-page="pager.pageNo"
        :page-sizes="[10, 30, 50, 100, 500]"
        :page-size="pager.pageSize"
        :total="pager.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </el-card>
    <el-dialog v-if="dialogUploadVisible" title="附件" :visible.sync="dialogUploadVisible" width="35%" @close="closeUploadDialog">
      <Attach ref="attach" :data-id="ids" table-name="hidden_danger" fun-id="hidden_check" @change="auditFormChange" />
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogUploadVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogUploadVisible = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from './api'
import Search from '@/components/Search'
import Attach from '@/components/sys_attach'
import { parseDay } from '@/utils/index'
export default {
  name: 'HiddenReview',
  components: {
    Search,
    Attach
  },
  data() {
    return {
      parseDay,
      data: [],
      list: [],
      deptTree: [],
      ids: [],
      keyids: [],
      isBacklog: this.$route.query.isBacklog || false,
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
          fixed: 'left'
        }, {
          prop: 'hidden_danger__hidden_code',
          label: '隐患编号'
        }, {
          prop: 'hidden_danger__hidden_state',
          label: '隐患状态'
        }, {
          prop: 'hidden_danger__check_man',
          label: '检查人'
        }, {
          prop: 'hidden_danger__check_dept',
          label: '检查部门'
        },
        {
          prop: 'hidden_danger__check_date',
          label: '检查时间'
        }, {
          prop: 'hidden_danger__check_location',
          label: '隐患描述'
        }, {
          prop: 'hidden_danger__check_content',
          label: '隐患描述'
        }, {
          prop: 'hidden_danger__reform_dept',
          label: '整改人'
        }, {
          prop: 'hidden_danger__reform_man',
          label: '整改部门'
        }, {
          prop: 'hidden_danger__reform_limit',
          label: '整改期限'
        }, {
          prop: 'opration',
          label: '操作',
          width: '70px',
          fixed: 'right',
          minWidth: '70px',
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
      rules: {
        dept_code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' }
        ],
        dept_name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }

        ]
      },
      formLabelWidth: '120px',
      auditForm: {},
      saveFrom: {},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'sys_dept__dept_name'
      },
      treeList: [],
      whereSql: '',
      whereValue: '',
      dialogUploadVisible: false
    }
  },
  created() {
    if (this.isBacklog) {
      this.whereSql = ''
    }
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList() {
      let pageNo = this.pager.pageNo * this.pager.pageSize - this.pager.pageSize
      if (pageNo < 0) {
        pageNo = 0
      }
      api.getDate(
        this.pager.pageSize,
        pageNo,
        this.whereSql
      ).then(data => {
        if (data.success) {
          this.data = data.data.root
          this.pager.total = data.data.total
          this.keyids = this.data.map(d => {
            return d.hidden_danger__hidden_danger_id
          }).join()
          this.queryAttach()
        } else {
          this.$message.error(data.message)
        }
      })
    },
    search(sql) {
      this.whereSql = sql
      this.getList()
    },
    queryAttach() {
      api.queryAttach(this.keyids).then(data => {
        if (data.success) {
          if (data.data.length > 0) {
            this.attachData = data.data
            this.data.forEach((d, i) => {
              this.data[i].attach = this.attachData.filter(v => {
                return v.data_id === d.hidden_danger__hidden_danger_id
              })
            })
          }
          this.list = JSON.parse(JSON.stringify(this.data))
        } else {
          this.$message.error(data.message)
        }
      })
    },
    editCreate() {
      const param = `/hidden_danger/hidden_review/create`
      this.$router.push(param)
    },
    Delete(row) {
      this.ids = []
      this.ids.push(row.hidden_danger__hidden_danger_id)
      this.editDelete()
    },
    editDelete() {
      if (this.ids && this.ids.length > 0) {
        this.$confirm('确认删除？').then(() => {
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
    audit() {},
    upload() {
      console.log('upload')
    },
    edit(row) {
      const param = `/hidden_danger/hidden_review/audit/${row.hidden_danger__hidden_danger_id}`
      this.$router.push(param)
    },
    auditFormChange(form) {
      this.saveFrom = form
    },
    closeUploadDialog() {
      this.dialogUploadVisible = false
    },
    cellDblclick(row) {
      const param = `/hidden_danger/hidden_review/audit/${row.hidden_danger__hidden_danger_id}`
      this.$router.push(param)
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
      this.ids = val.map(d => d.hidden_danger__hidden_danger_id)
    },
    closeDialog() {
      this.$refs['form'].resetFields()
      this.form.dept_name = ''
      this.form.dept_code = ''
    },
    checkAttach(row) {
      // this.drawer = true
      this.ids = []
      this.ids.push(row.hidden_danger__hidden_danger_id)
      this.dialogUploadVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
  .head {
    display: flex;
    justify-content: space-between;
  }
  .el-card {
    margin-top: 10px;
  }
</style>
