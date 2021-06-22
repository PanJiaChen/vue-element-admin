<template>
  <div class="app-container">
    <div class="head">
      <div>
        <el-button type="primary" @click="editCreate">新增</el-button>
        <el-button type="primary" @click="editDelete">删除</el-button>
        <el-button type="primary" @click="upload">图文附件</el-button>
      </div>
      <Search funid="sys_user" @search="search" />
    </div>
    <el-row>
      <el-col :span="3" class="tree">
        <el-card>
          <div class="tree_title">安全组织架构</div>
          <el-tree :data="treeData" default-expand-all :props="defaultProps" @node-click="handleNodeClick" />
        </el-card>
      </el-col>
      <el-col :span="20" style="margin-left:20px">
        <el-card>
          <el-table
            ref="deptTable"
            :data="data"
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
                  <div v-if="d.label==='部门负责人？'">
                    {{
                      scope.row.sys_user__is_leader == 0 ? '否' : '是'
                    }}
                  </div>
                  <div v-else-if="d.label==='性别'">
                    {{
                      scope.row.sys_user__sex == 0 ? '女' : '男'
                    }}
                  </div>
                  <div v-else-if="d.label==='是否注销'">
                    {{
                      scope.row.sys_user__is_novalid == 0 ? '否' : '是'
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
      </el-col>
    </el-row>

    <el-dialog v-if="dialogFormVisible" title="新增部门" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-select v-model="dept_id" placeholder="请选择">
            <el-option
              v-for="item in data"
              :key="item.sys_user__dept_id"
              :label="item.sys_user__dept_name"
              :value="item.sys_user__dept_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门编码" :label-width="formLabelWidth" prop="dept_code">
          <el-input v-model="form.dept_code" />
        </el-form-item>
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="dept_name">
          <el-input v-model="form.dept_name" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="memo">
          <el-input v-model="form.memo" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="dialogEditVisible" title="部门" :visible.sync="dialogEditVisible" width="70%" @close="closeEditDialog">
      <AdutiUser :id="user_id" ref="auditForm" :audit-form="auditForm" :data="deptTree" @change="auditFormChange" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="dialogUploadVisible" title="附件" :visible.sync="dialogUploadVisible" width="35%" @close="closeUploadDialog">
      <Attach :id="user_id" ref="attach" :data-id="ids" table-name="sys_user" fun-id="sys_user" @change="auditFormChange" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from './api'
import Search from '@/components/Search'
import AdutiUser from './components/auditUser'
import Attach from '@/components/sys_attach'
export default {
  name: 'User',
  components: {
    Search,
    AdutiUser,
    Attach
  },
  data() {
    return {
      data: [],
      fun: [],
      searchVal: '',
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
          prop: 'sys_user__user_name',
          label: '姓名'
        }, {
          prop: 'sys_user__user_code',
          label: '工号'
        }, {
          prop: 'sys_dept__dept_name',
          label: '部门名称'
        }, {
          prop: 'sys_user__is_leader',
          label: '部门负责人？'
        },
        {
          prop: 'sys_user__duty',
          label: '职务'
        },
        {
          prop: 'sys_user__phone_code',
          label: '固定电话'
        },
        {
          prop: 'sys_user__mob_code',
          label: '手机号码'
        },
        {
          prop: 'sys_user__sex',
          label: '性别'
        },
        {
          prop: 'sys_user__email',
          label: '邮箱'
        },
        {
          prop: 'sys_user__is_novalid',
          label: '是否注销'
        },
        {
          prop: 'sys_user__memo',
          label: '备注'
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
      user_id: '',
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
      dialogFormVisible: false,
      dialogEditVisible: false,
      dialogUploadVisible: false,
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
      whereValue: ''
    }
  },
  created() {
    this.getList()
    this.transitionTree()
  },
  mounted() {
  },
  methods: {
    getList() {
      let pageNo = this.pager.pageNo * this.pager.pageSize - this.pager.pageSize
      if (pageNo < 0) {
        pageNo = 0
      }
      api.getUser(
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
    async transitionTree() {
      await api.getDeptTree().then(data => {
        if (data.success) {
          this.deptTree = data.data.root
        } else {
          this.$message.error(data.message)
        }
      })
      this.treeData = []
      let data = []
      data = this.deptTree.sort((a, b) => {
        return a.sys_dept__dept_id - b.sys_dept__dept_id
      })
      const oneTreeList = data.filter(d => {
        return d.sys_dept__dept_level === '1'
      })
      for (let i = 0; i < oneTreeList.length; i++) {
        const treeList = data.filter(d => {
          return d.sys_dept__dept_id.substring(0, 4).indexOf(oneTreeList[i].sys_dept__dept_id) > -1
        })
        treeList.forEach(d => {
          d.children = []
          if (d.sys_dept__dept_level === '1') {
            this.treeData.push(d)
          } else if (d.sys_dept__dept_level === '2') {
            this.treeData[i].children.push(d)
          } else if (d.sys_dept__dept_level === '3') {
            this.treeData[i].children.forEach((threeVal, three) => {
              if (d.sys_dept__dept_id.substring(0, 8).indexOf(threeVal.sys_dept__dept_id) > -1) {
                this.treeData[i].children[three].children.push(d)
              }
            })
          } else if (d.sys_dept__dept_level === '4') {
            this.treeData[i].children.forEach((threeVal, three) => {
              threeVal.children.forEach((fourVal, four) => {
                if (d.sys_dept__dept_id.substring(0, 12).indexOf(fourVal.sys_dept__dept_id) > -1) {
                  this.treeData[i].children[three].children[four].children.push(d)
                }
              })
            })
          } else if (d.sys_dept__dept_level === '5') {
            this.treeData[i].children.forEach((threeVal, three) => {
              threeVal.children.forEach((fourVal, four) => {
                fourVal.children.forEach((fiveVal, five) => {
                  if (d.sys_dept__dept_id.substring(0, 16).indexOf(fiveVal.sys_dept__dept_id) > -1) {
                    this.treeData[i].children[three].children[four].children[five].children.push(d)
                  }
                })
              })
            })
          } else if (d.sys_dept__dept_level === '6') {
            this.treeData[i].children.forEach((threeVal, three) => {
              threeVal.children.forEach((fourVal, four) => {
                fourVal.children.forEach((fiveVal, five) => {
                  fiveVal.children.forEach((sixVal, six) => {
                    if (d.sys_dept__dept_id.substring(0, 20).indexOf(sixVal.sys_dept__dept_id) > -1) {
                      this.treeData[i].children[three].children[four].children[five].children[six].children.push(d)
                    }
                  })
                })
              })
            })
          }
        })
      }
    },
    editCreate() {
      this.id = ''
      this.auditForm = {}
      this.dialogEditVisible = true
    },
    create() {
      this.$refs.auditForm.$refs.form.validate((valid) => {
        if (valid) {
          const data = `funid=sys_dept&parentId=${this.dept_id}&levelCol=sys_dept.dept_level&keyid=&pagetype=editgrid&eventcode=save_eg&sys_user__dept_code=${this.form.dept_code}&sys_user__dept_name=${this.form.dept_name}&sys_user__memo=${this.form.memo}&sys_user__is_novalid=0&sys_user__dept_id=&sys_user__dept_level=${Number(this.level) + 1}&user_id=administrator&dataType= json`
          api.Crerte(data).then(data => {
            if (data.success) {
              this.getList()
              this.transitionTree()
              this.dialogFormVisible = false
              this.$refs.auditForm.$refs.form.resetFields()
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
      this.ids.push(row.sys_user__user_id)
      this.editDelete()
    },
    editDelete() {
      if (this.ids && this.ids.length > 0) {
        this.$confirm('确认删除员工？').then(() => {
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
      this.id = row.sys_user__user_id
      this.auditForm = row
      this.dialogEditVisible = true
    },
    auditFormChange(form) {
      this.saveFrom = form
    },
    save() {
      if (Object.keys(this.saveFrom).length === 0) {
        this.saveFrom = this.auditForm
      }
      this.$refs.auditForm.$refs.form.validate(valid => {
        if (valid) {
          const _form = `funid=sys_user&parentId=&levelCol=sys_dept.dept_level&keyid=${this.id}&pagetype=editgrid&eventcode=save_eg&sys_user__user_name=${this.saveFrom.sys_user__user_name}&sys_user__user_code=${this.saveFrom.sys_user__user_code}&sys_dept__dept_name=${this.saveFrom.sys_dept__dept_name}&sys_user__is_leader=${this.saveFrom.sys_user__is_leader}&sys_user__duty=${this.saveFrom.sys_user__duty}&sys_user__phone_code=${this.saveFrom.sys_user__phone_code}&sys_user__mob_code=${this.saveFrom.sys_user__mob_code}&sys_user__sex=${this.saveFrom.sys_user__sex}&sys_user__email=${this.saveFrom.sys_user__email}&sys_user__is_novalid=${this.saveFrom.sys_user__is_novalid}&sys_user__memo=${this.saveFrom.sys_user__memo}&sys_user__user_id=${this.id}&sys_user__dept_id=${this.saveFrom.sys_user__dept_id}&user_id=administrator&dataType=json`
          api.auditSave(_form).then(data => {
            if (data.success) {
              this.whereValue = ''
              this.getList()
              this.$message.success('保存成功！')
              this.dialogEditVisible = false
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    cellDblclick(row) {
      this.id = row.sys_user__user_id
      this.auditForm = row
      this.saveFrom = []
      this.dialogEditVisible = true
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
      this.ids = val.map(d => d.sys_user__user_id)
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.$refs.auditForm.$refs.form.resetFields()
      this.form = ''
    },
    closeEditDialog() {
      this.dialogEditVisible = false
    },
    closeUploadDialog() {
      this.dialogUploadVisible = false
    },
    handleNodeClick(data) {
      this.pager.pageNo = 0
      this.pager.pageSize = 10
      this.pager.total = 0
      this.whereValue = encodeURI(`\%${data.sys_dept__dept_id}\%`)
      this.whereSql = `where_sql=sys_dept.dept_id like ?&where_value=${this.whereValue}&where_type=String`
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
  .el-card {
    margin-top: 10px;
  }
  .tree{
    ::v-deep .el-card__body {
      padding: 0px;
    }
  }
  .tree_title{
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
    padding: 2px;
    line-height: 30px;
    color: #fff;
    font-weight: bold;
    background-color: #42b983;
    text-align: center;
  }
   .el-tree{
    height: 500px;
    overflow-x:auto;
    overflow-y:auto;
  }
</style>
