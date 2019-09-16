<template>
  <div class="app-container">

    <div class="filter-container">
      <input v-model="substring" placeholder="Search Accounts" class="filter-item">
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

      <el-table-column align="center" label="Username" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
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

      <el-table-column v-if="$store.state.settings.platform === 'OLFDE'" align="center" label="Type" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.type_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Status" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.status_id===100">Active</span>
          <span v-if="scope.row.status_id===200">Inactive</span>
          <span v-if="scope.row.status_id===300">Locked</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="250">
        <template slot-scope="scope">
          <router-link :to="'/users/edit/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
          <el-button type="primary" size="small" icon="el-icon-message" @click="sendPasswordResetConfirm(scope.row.email)">
            Send PW Reset
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
const fetchSubstringList = require('@/api/user').fetchSubstringList
import { fetchList, sendPasswordReset } from '@/api/user'
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
      substring: '',
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
    this.listQuery.platform = this.$store.state.settings.platform

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
    getSubstring() {
      fetchSubstringList(this.substring, this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.docs
        this.total = response.data.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      if (this.substring === '') {
        this.getList
      } else {
        this.getSubstring()
      }
    },
    sendPasswordResetConfirm(email) {
      this.$confirm(`This will send an email to <b>${email}</b>, prompting them to reset their password with the provided link. Are you sure you want to do this?`, 'Warning', {
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        sendPasswordReset(email, 'RESET').then(() => {
          // Send the request
          this.$message({
            type: 'success',
            message: 'Password Reset Sent'
          })
        }).catch(() => {
          // Send the request
          this.$message({
            type: 'danger',
            message: 'Password Reset Failed'
          })
        })
      }).catch(() => {
        // Do nothing, we don't care that they clicked cancel, but if we don't catch it, we get a console error
      })
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
