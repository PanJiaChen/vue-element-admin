<template>
  <div>
    <el-card>
      <div class="head">
        <div style="margin-bottom:20px;">
          <el-button type="primary" @click="editCreate">新增</el-button>
          <el-button type="primary" @click="editDelete">删除</el-button>
          <el-button type="primary" @click="editSave">保存</el-button>
          <el-button type="primary" @click="editCopy">复制</el-button>
          <el-button type="primary" @click="upload">图文附件</el-button>
          <el-button type="primary" @click="expxls">另存数据</el-button>
        </div>
        <Search funid="insp_item" :wsql="where_sql" :wvalue="id" :wtype="where_type" @search="search" />
      </div>
      <el-table
        ref="deptTable"
        :data="data"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @cell-dblclick="cellDblclick"
      >
        <template v-for="(d,i) in tableHeader">
          <el-table-column v-if="d.type && d.type === 'selection'" :key="i" :type="d.type" :fixed="d.fixed" />
          <el-table-column
            v-else
            :key="i"
            :prop="d.prop"
            :label="d.label"
          >
            <template slot-scope="scope">
              <div v-if="d.label === '操作'">
                <el-button icon="el-icon-view" type="text" title="编辑" @click="edit(scope.row)" />
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

    <el-dialog v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="巡检项目" :label-width="formLabelWidth" prop="insp_item__item_name">
          <el-input v-model="form.insp_item__item_name" type="textarea" />
        </el-form-item>
        <el-form-item label="巡检标准" :label-width="formLabelWidth" prop="insp_item__item_std">
          <el-input v-model="form.insp_item__item_std" type="textarea" />
        </el-form-item>
        <el-form-item label="巡检方法" :label-width="formLabelWidth" prop="insp_item__item_way">
          <el-input v-model="form.insp_item__item_way" type="textarea" />
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
import publicApi from '@/api/public'
import Search from '@/components/Search'
export default {
  name: 'SafeIdsp',
  components: {
    Search
  },

  data() {
    return {
      id: '',
      data: [],
      deptTree: [],
      ids: [],
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
          prop: 'insp_item__item_name',
          label: '巡检项目'
        }, {
          prop: 'insp_item__item_std',
          label: '巡检标准'
        },
        {
          prop: 'insp_item__item_way',
          label: '巡检方法'
        }, {
          prop: 'opration',
          label: '操作',
          width: '70px',
          fixed: 'right',
          minWidth: '70px',
          show: true
        }],
      dept_id: '',
      level: '',
      parent_id: '',
      initFrom: {
        insp_item__insp_item_id: '',
        insp_item__item_name: '',
        insp_item__item_std: '',
        insp_item__item_way: ''
      },
      form: {},
      rules: {
        insp_item__item_name: [
          { required: true, message: '请输入巡检项目', trigger: 'blur' }
        ],
        insp_item__item_std: [
          { required: true, message: '请输入巡检标准', trigger: 'blur' }
        ],
        insp_item__item_way: [
          { required: true, message: '请输入巡检方法', trigger: 'blur' }
        ]
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
      whereSql: '',
      whereValue: '',
      where_sql: 'insp_item.insp_name_id = ?',
      where_value: this.id,
      where_type: 'string',
      title: ''
    }
  },
  created() {
    if (this.value) {
      this.id = this.value
      this.getList(this.id)
    }
  },
  mounted() {
  },
  methods: {
    getList(id, isWhereSql) {
      this.id = id
      let pageNo = this.pager.pageNo * this.pager.pageSize - this.pager.pageSize
      if (pageNo < 0) {
        pageNo = 0
      }
      api.getDate(
        this.id,
        this.pager.pageSize,
        pageNo,
        this.whereSql,
        isWhereSql
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
      this.getList(this.id, true)
    },
    editCreate() {
      this.title = '新增'
      this.form = JSON.parse(JSON.stringify(this.initFrom))
      this.dialogFormVisible = true
    },
    create() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const data = `funid=insp_item&fkValue=${this.id}&pfunid=insp_name&keyid=${this.form.insp_item__insp_item_id}&pagetype=editgrid&eventcode=save_eg&insp_item__item_name=${this.form.insp_item__item_name}&insp_item__item_std=${this.form.insp_item__item_std}&insp_item__item_way=${this.form.insp_item__item_way}&insp_item__insp_item_id=${this.form.insp_item__insp_item_id}&insp_item__insp_name_id=${this.id}&user_id=administrator&dataType=json`
          api.Crerte(data).then(data => {
            if (data.success) {
              this.getList(this.id)
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
    editSave() {},
    editCopy() {},
    upload() {},
    expxls() {},
    Delete(row) {
      this.ids = []
      this.ids.push(row.insp_item__insp_item_id)
      this.editDelete()
    },
    editDelete() {
      if (this.ids && this.ids.length > 0) {
        this.$confirm('确认删除？').then(() => {
          api.Delete(this.ids).then(data => {
            if (data.success) {
              this.getList(this.id)
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
    auditFormChange(form) {
      this.saveFrom = form
    },
    cellDblclick(row) {
      this.title = '编辑'
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    sizeChange(size) {
      this.pager.pageSize = size
      this.getList(this.id)
    },
    pageChange(page) {
      this.pager.pageNo = page
      this.getList(this.id)
    },
    handleSelectionChange(val) {
      this.ids = val.map(d => d.insp_item__insp_item_id)
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
      this.form.dept_name = ''
      this.form.dept_code = ''
    },
    handleNodeClick(data) {
      console.log(data)
      this.whereValue = encodeURI(`${data.sys_dept__dept_id}\%`)
      this.whereSql = ''
      this.getList(this.id)
    },
    async getTypeSel() {
      await publicApi.getTypeSel('inspresult').then(data => {
        if (data.success) {
          this.inspresult = data.data.root
        } else {
          this.$message.error(data.message)
        }
      })
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
