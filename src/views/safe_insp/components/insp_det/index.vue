<template>
  <div class="app-container">
    <el-card>
      <div class="head">
        <div class="buttons">
          <el-button type="primary" @click="editCreate">新增</el-button>
          <el-button type="primary" @click="editDelete">删除</el-button>
          <el-button type="primary" @click="editCopy">复制</el-button>
          <el-button type="primary" @click="upload">图文附件</el-button>
          <el-button type="primary" @click="expxls">另存数据</el-button>
        </div>
        <Search funid="insp_det" :wsql="where_sql" :wvalue="where_value" :wtype="where_type" @search="search" />
      </div>
      <el-table
        ref="deptTable"
        :data="data"
        style="width: 100%"
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
              <div v-if="d.label==='巡检结果'">
                {{
                  scope.row.insp_det__det_result === '1' ? '符合' : scope.row.insp_det__det_result === '0' ? '不符合' : null
                }}
              </div>
              <div v-else-if="d.label==='是否已整改'">
                {{
                  scope.row.insp_det__reform_flag === '1' ? '已整改' : scope.row.insp_det__reform_flag === '0' ? '未整改' : null
                }}
              </div>
              <div v-else-if="d.label === '操作'">
                <el-button icon="el-icon-view" type="text" title="编辑" @click="edit(scope.row)" />
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

    <el-dialog v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="巡检项目" :label-width="formLabelWidth" prop="det_desc">
          <el-input v-model="form.insp_det__det_name" type="text" disabled="false" />
        </el-form-item>
        <el-form-item label="巡检标准" :label-width="formLabelWidth" prop="det_desc">
          <el-input v-model="form.insp_det__det_std" type="text" disabled="false" />
        </el-form-item>
        <el-form-item label="巡检方法" :label-width="formLabelWidth" prop="det_desc">
          <el-input v-model="form.insp_det__det_way" type="text" disabled="false" />
        </el-form-item>
        <el-form-item label="巡检结果" :label-width="formLabelWidth" prop="insp_det__det_result">
          <el-select v-model="form.insp_det__det_result" placeholder="请选择">
            <el-option
              v-for="item in inspresult"
              :key="item.funall_control__value_data"
              :label="item.funall_control__display_data"
              :value="item.funall_control__value_data"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="不符合描述" :label-width="formLabelWidth" prop="det_desc">
          <el-input v-model="form.insp_det__det_desc" type="textarea" maxlength="500" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="dialogUploadVisible" title="附件" :visible.sync="dialogUploadVisible" width="35%" @close="closeUploadDialog">
      <Attach ref="attach" :data-id="ids" table-name="insp_det" fun-id="insp_det" @change="auditFormChange" />
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogUploadVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogUploadVisible = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from './api'
import publicApi from '@/api/public'
import Search from '@/components/Search'
import Attach from '@/components/sys_attach'
export default {
  name: 'SafeIdsp',
  components: {
    Search,
    Attach
  },
  props: {
    id: {
      type: String,
      default: null
    }
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
          prop: 'insp_det__det_name',
          label: '巡检项目'
        }, {
          prop: 'insp_det__det_std',
          label: '巡检标准'
        },
        {
          prop: 'insp_det__det_way',
          label: '巡检方法'
        }, {
          prop: 'insp_det__det_result',
          label: '巡检结果'
        },
        {
          prop: 'insp_det__det_desc',
          label: '不符合描述'
        },
        {
          prop: 'insp_det__reform_flag',
          label: '是否已整改'
        },
        {
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
      parent_id: '',
      initFrom: {
        det_desc: '',
        insp_det__det_desc: '',
        insp_det__det_name: '',
        insp_det__det_name_id: '',
        insp_det__det_result: '',
        insp_det__det_std: '',
        insp_det__det_way: '',
        insp_det__insp_det_id: '',
        insp_det__reform_flag: '',
        insp_det__safe_insp_id: ''
      },
      form: {},
      rules: {
        insp_det__det_result: [
          { required: true, message: '请选择巡检结果', trigger: 'blur' }
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
      where_sql: 'insp_det.safe_insp_id = ?',
      where_value: this.$props.id,
      where_type: 'string',
      dialogUploadVisible: false
    }
  },
  created() {
    this.getList()
    this.getTypeSel()
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
        this.id,
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
      console.log(sql, 'sqlsql  ')
      this.whereSql = sql
      this.getList()
    },
    editCopy() {},
    expxls() {},
    upload() {
      if (this.ids.length > 1) {
        this.$message.warning('只能选择一条数据！')
      } else if (this.ids.length === 0) {
        this.$message.warning('请选择一条数据！')
      } else {
        this.dialogUploadVisible = true
      }
    },
    closeUploadDialog() {
      this.dialogUploadVisible = false
    },
    editCreate() {
      this.title = '新增'
      this.form = JSON.parse(JSON.stringify(this.initFrom))
      this.dialogFormVisible = true
    },
    edit(row) {
      console.log(row, 'row')
      this.title = '编辑'
      this.form = row
      this.dialogFormVisible = true
    },
    create() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const data = `funid=insp_det&fkValue=${this.id}&pfunid=safe_insp&keyid=${this.form.insp_det__insp_det_id}&pagetype=editgrid&eventcode=save_eg&insp_det__det_name=${this.form.insp_det__det_name}&insp_det__det_std=${this.form.insp_det__det_std}&insp_det__det_way=${this.form.insp_det__det_way}&insp_det__det_result=${this.form.insp_det__det_result}&insp_det__det_desc=${this.form.insp_det__det_desc}&insp_det__reform_flag=${this.form.insp_det__reform_flag}&insp_det__safe_insp_id=${this.id}&insp_det__insp_det_id=${this.form.insp_det__insp_det_id}&insp_det__det_name_id=${this.form.insp_det__insp_det_id}&user_id=administrator&dataType=json`
          api.Crerte(data).then(data => {
            if (data.success) {
              this.getList()
              this.dialogFormVisible = false
              this.$refs['form'].resetFields()
              this.$message.success('保存成功！')
              this.$emit('updateList')
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    Delete(row) {
      this.ids = []
      this.ids.push(row.insp_det__insp_det_id)
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
      this.getList()
    },
    pageChange(page) {
      this.pager.pageNo = page
      this.getList()
    },
    handleSelectionChange(val) {
      this.ids = val.map(d => d.insp_det__insp_det_id)
      console.log(this.ids, 'this.ids')
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
      this.form.dept_name = ''
      this.form.dept_code = ''
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
  .buttons {
    margin-bottom: 20px;
  }
</style>
