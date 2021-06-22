<template>
  <div class="app-container">
    <div class="head">
      <div>
        <el-button type="primary" @click="editCreate">新增</el-button>
        <el-button type="primary" @click="editDelete">删除</el-button>
        <el-button type="primary" @click="editSave">保存</el-button>
        <el-button type="primary" @click="editCopy">复制</el-button>
        <el-button type="primary" @click="upload">图文附件</el-button>
        <el-button type="primary" @click="expxls">另存数据</el-button>
      </div>
      <!-- <Search funid="insp_name" @search="search" /> -->
    </div>
    <el-row>
      <el-col :span="8">
        <el-card>
          <Search class="search" funid="insp_name" @search="search" />
          <el-table
            ref="deptTable"
            :data="data"
            style="width: 100%"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            @cell-dblclick="cellDblclick"
          >
            <el-table-column type="index" fixed="left" width="35px" />
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
                  <div v-if="d.label === '操作'">
                    <el-button icon="el-icon-view" type="text" title="编辑" @click="edit(scope.row)" />
                    <!-- <el-button v-if="scope.row.status !== 'NULLIFY'" icon="el-icon-delete" style="color:#F56C6C" type="text" title="删除" @click="Delete(scope.row)" /> -->
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
        </el-card>
      </el-col>
      <el-col :span="16">
        <InspItem ref="inspItem" v-model="id" />
      </el-col>
    </el-row>

    <el-dialog v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="巡检表名称" :label-width="formLabelWidth" prop="dept_code">
          <el-input v-model="form.insp_name__insp_name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="巡检表名称" :label-width="formLabelWidth" prop="dept_code">
          <el-input v-model="form.insp_name__insp_name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from './api'
import Search from '@/components/Search'
import InspItem from './components/insp_item'
export default {
  name: 'SafeIdsp',
  components: {
    Search,
    InspItem
  },
  data() {
    return {
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
        }, {
          prop: 'insp_name__insp_name',
          label: '巡检表名称'
        }, {
          prop: 'opration',
          label: '操作',
          width: '100px',
          fixed: 'right',
          minWidth: '100px',
          show: true
        }],
      value: '',
      id: '',
      form: { },
      initForm: {
        insp_name__insp_name: '',
        insp_name__insp_name_id: ''
      },
      rules: {
        insp_name__insp_name: [
          { required: true, message: '请输入部门编码', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      dialogEditVisible: false,
      formLabelWidth: '120px',
      auditForm: {},
      saveFrom: {},
      treeList: [],
      whereSql: false,
      whereValue: '',
      title: ''
    }
  },
  created() {
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
        } else {
          this.$message.error(data.message)
        }
      })
    },
    search(sql) {
      this.whereSql = sql
      this.getList()
    },
    editCreate() {
      this.title = '新增'
      this.dialogFormVisible = true
      this.form = JSON.parse(JSON.stringify(this.initForm))
    },
    create() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const data = `funid=insp_name&keyid=${this.form.insp_name__insp_name_id}&pagetype=editgrid&eventcode=save_eg&insp_name__insp_name=${this.form.insp_name__insp_name}&insp_name__insp_name_id=${this.form.insp_name__insp_name_id}&insp_name__org_id=&insp_name__dept_id=&user_id=administrator&dataType=json`
          api.Crerte(data).then(data => {
            if (data.success) {
              this.getList()
              this.dialogFormVisible = false
              this.$refs['form'].resetFields()
              this.$message.success('保存成功！')
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    edit(row) {
      this.title = '编辑'
      this.dialogFormVisible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    editCopy() {},
    expxls() {},
    Delete(row) {
      this.ids = []
      this.ids.push(row.insp_name__insp_name_id)
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
      console.log('upload')
    },
    auditFormChange(form) {
      this.form = form
    },
    cellDblclick(row) {
      this.title = '编辑'
      this.dialogFormVisible = true
      this.form = JSON.parse(JSON.stringify(row))
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
      this.ids = val.map(d => d.insp_name__insp_name_id)
    },
    rowClick(row) {
      this.id = row.insp_name__insp_name_id
      this.$refs.inspItem.getList(this.id, false)
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
      this.form.dept_name = ''
      this.form.dept_code = ''
    },
    handleNodeClick(data) {
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .head {
    display: flex;
    justify-content: space-between;
  }
  .search {
      margin-left: -50px;
      margin-bottom: 10px;
    }
  .el-card {
    margin-top: 10px;
  }
  .pagination{
    overflow: auto;
  }
</style>
