<template>
  <div>
    <el-card>
      <el-table
        ref="deptTable"
        :data="data"
        style="width: 100%"
        @cell-dblclick="cellDblclick"
      >
        <el-table-column type="index" width="35px" />
        <template v-for="(d,i) in tableHeader">
          <el-table-column v-if="d.type && d.type === 'selection'" :key="i" :type="d.type" :fixed="d.fixed" />
          <el-table-column
            v-else
            :key="i"
            :prop="d.prop"
            :label="d.label"
          />
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

  </div>
</template>

<script>
import api from './api'
export default {
  name: 'SafeIdsp',
  data() {
    return {
      data: [],
      ids: [],
      pager: {
        pageNo: 0,
        pageSize: 10,
        total: 0
      },
      tableHeader: [
        {
          prop: 'insp_name__insp_name',
          label: '巡检表名称'
        }],
      id: '',
      dialogFormVisible: false,
      dialogEditVisible: false,
      formLabelWidth: '120px',
      whereSql: false,
      whereValue: ''
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
        this.whereSql,
        this.whereValue
      ).then(data => {
        if (data.success) {
          this.data = data.data.root
          this.pager.total = data.data.total
        } else {
          this.$message.error(data.message)
        }
      })
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
    cellDblclick(row) {
      this.$emit('updateInspName', row)
    },
    sizeChange(size) {
      this.pager.pageSize = size
      this.getList()
    },
    pageChange(page) {
      this.pager.pageNo = page
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-card {
    margin-top: 10px;
  }
  ::v-deep .el-table .cell {
    line-height: 33px;
  }
</style>
