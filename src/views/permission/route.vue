<template>
  <div class="app-container">
    <el-button type="primary" style="margin:0 0 20px 0;" @click="handleImport">Import Routes</el-button>

    <el-table :data="routes" style="width: 100%;margin-bottom: 20px;" border row-key="path">
      <el-table-column v-for="key in keys" :key="key" :prop="key" :label="key" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row[key] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as Route from '@/api/route'
import { routes } from '../../../mock/route'

export default {
  name: 'Route',
  data() {
    return {
      keys: ['name', 'path', 'redirect', 'hidden', 'component', 'meta'],
      routes: []
    }
  },
  created() {
    this.getRoutes()
  },
  methods: {
    getRoutes() {
      Route.getRoutes().then(res => {
        const { data: routes } = res
        this.routes = routes
      })
    },
    handleImport() {
      Route.importRoutes({ routes }).then(res => {
        this.$message({
          type: 'success',
          message: 'Import Success'
        })
        this.getRoutes()
      })
    }
  }
}
</script>

