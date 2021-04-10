<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <el-card>
          <el-tree :data="treeData" default-expand-all :props="defaultProps" highlight-current="true" expand-on-click-node="false" @node-click="handleNodeClick" />
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <el-table
            ref="deptTable"
            v-loading="loading"
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
                  <div v-if="d.label==='是否注销'">
                    {{
                      scope.row.sys_dept__is_novalid == 0 ? '否' : '是'
                    }}
                  </div>
                  <div v-else-if="d.label === '操作'">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from './api'
export default {
  name: 'SelDept',
  props: {
    selective: {
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
        pageSize: 10,
        total: 0
      },
      tableHeader: [
        {
          prop: 'selection',
          type: 'selection',
          fixed: 'left'
        }, {
          prop: 'sys_dept__dept_code',
          label: '组织编码'
        }, {
          prop: 'sys_dept__dept_name',
          label: '组织名称'
        }, {
          prop: 'sys_dept__memo',
          label: '备注'
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
      Dpets: ''
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
      this.loading = true
      let pageNo = this.pager.pageNo * this.pager.pageSize - this.pager.pageSize
      if (pageNo < 0) {
        pageNo = 0
      }
      api.getDept(
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
        console.log(this.treeData, 'this.treeData')
      }
    },
    editCreate() {
      if (this.ids === null) {
        this.$message.warning('请选择一个组织再添加下属组织')
      } else if (this.ids.length !== 1) {
        this.$message.warning('请选择一个组织再添加下属组织')
      } else {
        this.dialogFormVisible = true
        this.dept_id = this.ids[0]
        this.level = this.levels[0]
      }
    },
    create() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const data = `funid=sys_dept&parentId=${this.dept_id}&levelCol=sys_dept.dept_level&keyid=&pagetype=editgrid&eventcode=save_eg&sys_dept__dept_code=${this.form.dept_code}&sys_dept__dept_name=${this.form.dept_name}&sys_dept__memo=${this.form.memo}&sys_dept__is_novalid=0&sys_dept__dept_id=&sys_dept__dept_level=${Number(this.level) + 1}&user_id=administrator&dataType= json`
          api.Crerte(data).then(data => {
            if (data.success) {
              this.getList()
              this.transitionTree()
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
      this.ids.push(row.sys_dept__dept_id)
      this.editDelete()
    },
    editDelete() {
      if (this.ids && this.ids.length > 0) {
        this.$confirm('确认删除部门？').then(() => {
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
      this.id = row.sys_dept__dept_id
      this.parent_id = this.id.substring(0, this.id.length - 4)
      console.log(this.parent_id, this.id)
      this.auditForm = row
      this.dialogEditVisible = true
    },
    auditFormChange(form) {
      this.saveFrom = form
    },
    save() {
      console.log(this.saveFrom, 'this.saveFrom')
      console.log(this.auditForm, 'this.auditForm')
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
              this.dialogEditVisible = false
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    cellDblclick(row) {
      this.$emit('updateDept', row)
    },
    sizeChange(size) {
      this.pager.pageSize = size
      this.getList()
    },
    pageChange(page) {
      this.pager.pageNo = page
      this.getList()
    },
    handleSelectionChange(row) {
      if (this.selective) {
        this.$emit('updateDepts', row)
      } else {
        this.Dpets = row
      }
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
      this.form.dept_name = ''
      this.form.dept_code = ''
    },
    handleNodeClick(data) {
      this.pager.pageNo = 0
      this.pager.pageSize = 10
      this.pager.total = 0
      this.whereValue = encodeURI(`${data.sys_dept__dept_id}\%`)
      this.whereSql = true
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-card {
    margin-top: 0px;
    ::v-deep.el-table__row{
      font-size: 14px;
    }
  }
  .app-container{
    padding: 0px;
  }
  .el-tree{
    height: 500px;
    overflow-x:auto;
    overflow-y:auto;
  }
</style>
