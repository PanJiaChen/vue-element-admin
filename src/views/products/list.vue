<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="Name" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Description" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="$store.state.settings.platform === 'OLFUK'" align="center" label="Type" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column v-else align="center" label="Type" width="200">
        <template slot-scope="scope">
          <span>{{ scope.meta.category }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Duty" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.duty }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="LPT" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.lpt }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/products/edit/' + scope.row._id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
          <deletePopUp
            :item="scope.row"
            :type="'product'"
            @success="successfullyDeleted"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import DeletePopUp from '@/components/PopUps/Delete'

export default {
  name: 'ProductList',
  components: { Pagination, DeletePopUp },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.listQuery.platform = this.$store.state.settings.platform

    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.fuels
        console.log(this.list)
        this.total = response.data.fuels.length
        this.listLoading = false
      })
    },
    successfullyDeleted: function(val) {
      if (val) {
        this.getList()
      }
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
