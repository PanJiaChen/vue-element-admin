<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.accountId" :remote-method="getRemoteAccountList" filterable default-first-option remote placeholder="Search Accounts" loading-text="Loading...">
        <el-option v-for="(item,index) in accountListOptions" :key="item+index" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="Name" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.firstName }} {{ scope.row.lastName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Account" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.account.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Email" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Phone" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/users/edit/' + scope.row.id">
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
import { fetchList } from '@/api/user'
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
      accountListOptions: [],
      listQuery: {
        page: 1,
        limit: 20,
        accountId: ''
      }
    }
  },
  created() {
    // Set the type for the query
    // this.listQuery.type = this.$route.meta.type
    this.listQuery.platform = 'OLFDE'

    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.docs
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getRemoteAccountList(query) {
      query = {}
      query.platform = 'OLFDE'
      query.limit = 100
      fetchAccountList(query).then(response => {
        if (!response.data.docs) return
        this.accountListOptions = response.data.docs.map(v => { return { name: v.name, id: v._id } })
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
