<template>
  <div>
    <buttons funid="hidden_reform" style="margin:10px 10px" @Create="editCreate" @Del="editDelete" @editSave="editSave" @upload="upload" />
    <el-card>
      <el-table
        ref="deptTable"
        v-loading="loading"
        :data="data"
        style="width: 100%"
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
              <div v-if="d.label==='隐患状态'">
                <el-tag v-if="scope.row.hidden_danger__hidden_state == 2" size="danger">{{
                  scope.row.hidden_danger__hidden_state == 1 ? '排查中' : scope.row.hidden_danger__hidden_state == 2 ? '待整改' :scope.row.hidden_danger__hidden_state == 3 ? '整改中' :scope.row.hidden_danger__hidden_state == 4 ? '待验收' : '已验收'
                }}</el-tag>
                <el-tag v-else-if="scope.row.hidden_danger__hidden_state == 3" size="danger">{{
                  scope.row.hidden_danger__hidden_state == 3 ? '排查中' : scope.row.hidden_danger__hidden_state == 2 ? '待整改' :scope.row.hidden_danger__hidden_state == 3 ? '整改中' :scope.row.hidden_danger__hidden_state == 4 ? '待验收' : '已验收'
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
                <el-button icon="el-icon-folder" type="text" title="查看附件" @click="checkAttach(scope.row)" />
                <el-button v-if="scope.row.status !== 'NULLIFY'" icon="el-icon-delete" style="color:#F56C6C" type="text" title="删除" @click="Delete(scope.row)" />
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
    <el-dialog v-if="dialogUploadVisible" title="附件" :visible.sync="dialogUploadVisible" width="45%" @close="closeUploadDialog">
      <Attach ref="attach" :data-id="ids" table-name="hidden_danger" fun-id="hidden_check" @change="auditFormChange" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from './api'
import buttons from '@/components/Buttons'
import Attach from '@/components/sys_attach'
import { parseDay } from '@/utils/index'
export default {
  name: 'SafeIdsp',
  components: {
    buttons,
    Attach
  },
  data() {
    return {
      parseDay,
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
          fixed: 'left'
        },
        {
          prop: 'hidden_danger__hidden_code',
          label: '隐患编号'
          // width: '200px',
          // show: true
        }, {
          prop: 'hidden_danger__hidden_state',
          label: '隐患状态'
          // width: '80px',
          // show: true
        }, {
          prop: 'hidden_danger__check_man',
          label: '检查人'
          // width: '150px',
          // show: true
        }, {
          prop: 'hidden_danger__check_dept',
          label: '检查部门'
          // width: '150px',
          // show: true
        },
        {
          prop: 'hidden_danger__check_date',
          label: '检查时间'
          // width: '200px',
          // show: true
        }, {
          prop: 'hidden_danger__check_location',
          label: '隐患描述'
          // width: '200px',
          // show: true
        }, {
          prop: 'hidden_danger__check_content',
          label: '隐患内容'
          // width: '200px',
          // show: true
        }, {
          prop: 'hidden_danger__reform_dept',
          label: '整改人'
          // width: '150px',
          // show: true
        }, {
          prop: 'hidden_danger__reform_man',
          label: '整改部门'
          // width: '150px',
          // show: true
        }, {
          prop: 'hidden_danger__reform_limit',
          label: '整改期限'
          // show: true
        }, {
          prop: 'opration',
          label: '操作',
          width: '100px',
          fixed: 'right',
          minWidth: '100px',
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
      whereSql: false,
      whereValue: '',
      dialogUploadVisible: false
    }
  },
  created() {
    this.getList()
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
        this.whereSql,
        this.whereValue
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
    editCreate() {
      const param = `/hidden_danger/hidden_reform/create`
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
    upload() {
      if (this.ids.length > 1) {
        this.$message.warning('只能选择一条数据！')
      } else if (this.ids.length === 0) {
        this.$message.warning('请选择一条数据！')
      } else {
        this.dialogUploadVisible = true
      }
    },
    edit(row) {
      const param = `/hidden_danger/hidden_reform/audit/${row.hidden_danger__hidden_danger_id}`
      this.$router.push(param)
    },
    auditFormChange(form) {
      this.saveFrom = form
    },
    save() {
      if (Object.keys(this.saveFrom).length === 0) {
        this.saveFrom = this.auditForm
      }
      this.$refs.auditForm.$refs.auditForm.validate(valid => {
        if (valid) {
          const _form = `funid=sys_dept&parentId=&levelCol=sys_dept.dept_level&keyid=${this.id}&pagetype=editgrid&eventcode=save_eg&sys_dept__dept_code=${this.saveFrom.sys_dept__dept_code}&sys_dept__dept_name=${this.saveFrom.sys_dept__dept_name}&sys_dept__memo=${this.saveFrom.sys_dept__memo}&sys_dept__is_novalid=${this.saveFrom.sys_dept__is_novalid}&sys_dept__dept_id=${this.id}&sys_dept__dept_level=${this.saveFrom.sys_dept__dept_level}&user_id=administrator&dataType=json`
          api.auditSave(_form).then(data => {
            if (data.success) {
              this.whereSql = false
              this.whereValue = ''
              this.getList()
              this.$message.success('保存成功！')
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    closeUploadDialog() {
      this.dialogUploadVisible = false
    },
    cellDblclick(row) {
      const param = `/hidden_danger/hidden_reform/audit/${row.hidden_danger__hidden_danger_id}`
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
    handleNodeClick(data) {
      console.log(data)
      this.whereValue = encodeURI(`${data.sys_dept__dept_id}\%`)
      this.whereSql = true
      this.getList()
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
  .el-card {
    margin-top: 10px;
  }
</style>
