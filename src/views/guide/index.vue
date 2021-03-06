<template>
  <div class="app-container">
    <buttons funid="sys_dept" @editCreate="editCreate" @editDelete="editDelete" @editSave="editSave" @upload="upload" />
    <el-card>
      <el-table
        ref="deptTable"
        v-loading="loading"
        :data="data"
        style="width: 100%"
        @cell-dblclick="cellDblclick"
      >
        <template v-for="(d,i) in tableHeader">
          <el-table-column
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
  </div>
</template>

<script>
import api from './api'
import buttons from '@/components/Buttons'

export default {
  name: 'Guide',
  components: {
    buttons
  },
  data() {
    return {
      loading: false,
      data: [],
      pager: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableHeader: [{
        prop: 'sys_dept__dept_code',
        label: '组织编码'
      }, {
        prop: 'sys_dept__dept_name',
        label: '组织名称'
      }, {
        prop: 'sys_dept__memo',
        label: '备注'
      }, {
        prop: 'sys_dept__is_novalid',
        label: '是否注销'
      }]
    }
  },
  created() {
    this.getDate()
  },
  mounted() {
  },
  methods: {
    getDate() {
      this.loading = true
      api.getDept().then(data => {
        if (data.success) {
          console.log(data)
          this.data = data.data.root
          setTimeout(() => {
            this.loading = false
          }, 200)
        } else {
          this.$message.error(data.message)
        }
      })
    },
    editCreate() {
      console.log('editCreate')
    },
    editDelete() {
      console.log('editDelete')
    },
    editSave() {
      console.log('editSave')
    },
    upload() {
      console.log('upload')
    },
    cellDblclick() {}
  }
}
</script>
<style lang="scss" scoped>
  .el-card {
    margin-top: 10px;
  }
</style>
