<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.accountName" placeholder="Account Name or Email" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="Name" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Email" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Order Confirmation Email" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.orderConfirmationEmail }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Phone" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/accounts/edit/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
const fetchAccountList = require('@/api/account').fetchList
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
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
    // Set the type for the query
    this.listQuery.type = this.$route.meta.type
    this.listQuery.platform = this.$store.state.settings.platform

    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAccountList(this.listQuery).then(response => {
        this.list = response.data.docs
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter(query) {
      this.listQuery.page = 1
      this.getList()
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
