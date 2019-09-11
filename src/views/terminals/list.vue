<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="terminalName" placeholder="Terminal Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="filteredList" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="Name" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="FullName" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="$store.state.settings.platform === 'OLFUK'" align="center" label="Identifier" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.identifier }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="$store.state.settings.platform === 'OLFDE'" align="center" label="Region Id" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.region_id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="$store.state.settings.platform === 'OLFDE'" align="center" label="Phone" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.contactNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="$store.state.settings.platform === 'OLFDE'" align="center" label="Meta" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.meta }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/terminals/edit/' + scope.row._id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
          <deletePopUp
            :item="scope.row"
            :type="'terminal'"
            @success="successfullyDeleted"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>

<script>
import { fetchList } from '@/api/terminal'
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import DeletePopUp from '@/components/PopUps/Delete'

export default {
  name: 'ArticleList',
  components: { DeletePopUp },
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
      terminalName: '',
      originaList: null,
      filteredList: null,
      total: 0,
      listLoading: true
    }
  },
  created() {
    // Set the type for the query
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.originaList = response.data.terminals
        this.filteredList = this.originaList
        console.log(this.originaList)
        this.total = response.data.terminals.length
        this.listLoading = false
      })
    },
    handleFilter() {
      const searchQuery = this.terminalName.toLowerCase()
      this.filteredList = this.originaList.filter(function(terminal) {
        return terminal.name.toLowerCase().includes(searchQuery)
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
