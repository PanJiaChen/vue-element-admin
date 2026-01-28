<template>
  <div class="app-container">
    <!-- 高级搜索面板 -->
    <div class="filter-container">
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="toggleAdvancedSearch"
      >
        {{ advancedSearchVisible ? '收起高级搜索' : '展开高级搜索' }}
      </el-button>

      <el-collapse-transition>
        <div v-show="advancedSearchVisible" class="advanced-search-panel">
          <el-form ref="searchForm" :model="searchForm" label-width="100px" size="small">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="手机号：" prop="phone">
                  <el-input
                    v-model="searchForm.phone"
                    placeholder="请输入手机号"
                    clearable
                    @keyup.enter.native="handleSearch"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="角色：" prop="role">
                  <el-select v-model="searchForm.role" placeholder="请选择角色" clearable style="width: 100%">
                    <el-option label="超级管理员" value="super_admin" />
                    <el-option label="普通管理员" value="admin" />
                    <el-option label="普通用户" value="user" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="创建时间：" prop="dateRange">
                  <el-date-picker
                    v-model="searchForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="用户状态：" prop="status">
                  <el-checkbox-group v-model="searchForm.status">
                    <el-checkbox label="enabled">启用</el-checkbox>
                    <el-checkbox label="disabled">禁用</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item class="search-buttons">
                  <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                  <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-transition>

      <!-- 导出按钮 -->
      <div v-show="advancedSearchVisible" class="export-buttons">
        <el-button
          type="success"
          icon="el-icon-download"
          size="small"
          :loading="exportLoading"
          @click="handleExportSelected"
        >
          导出选中
        </el-button>
        <el-button
          type="warning"
          icon="el-icon-download"
          size="small"
          :loading="exportLoading"
          @click="handleExportAll"
        >
          导出全部
        </el-button>
      </div>

      <!-- 当前筛选条件提示 -->
      <div v-if="filterText" class="filter-text">
        <el-alert
          :title="filterText"
          type="info"
          show-icon
          :closable="false"
        />
      </div>
    </div>

    <!-- 用户列表 -->
    <el-table
      v-loading="listLoading"
      :data="userList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户ID" prop="id" align="center" width="80" />
      <el-table-column label="姓名" prop="name" align="center" width="120" />
      <el-table-column label="手机号" prop="phone" align="center" width="150" />
      <el-table-column label="角色" prop="role" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="getRoleType(row.role)">
            {{ getRoleLabel(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" width="180">
        <template slot-scope="{row}">
          {{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" prop="status" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status === 'enabled' ? 'success' : 'danger'">
            {{ row.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button
            :type="row.status === 'enabled' ? 'danger' : 'success'"
            size="mini"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'enabled' ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getUserList"
    />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserList',
  components: { Pagination },
  filters: {
    parseTime
  },
  data() {
    return {
      // 高级搜索相关
      advancedSearchVisible: false,
      searchForm: {
        phone: '',
        role: '',
        dateRange: null,
        status: []
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近30天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },

      // 列表相关
      listLoading: false,
      userList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },

      // 导出相关
      exportLoading: false,
      selectedUsers: [],

      // 筛选条件文本
      filterText: ''
    }
  },
  computed: {
    // 计算筛选条件文本
    computedFilterText() {
      const conditions = []

      if (this.searchForm.phone) {
        conditions.push(`手机号：${this.searchForm.phone}`)
      }

      if (this.searchForm.role) {
        const roleLabel = this.getRoleLabel(this.searchForm.role)
        conditions.push(`角色：${roleLabel}`)
      }

      if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
        conditions.push(`创建时间：${this.searchForm.dateRange[0]} 至 ${this.searchForm.dateRange[1]}`)
      }

      if (this.searchForm.status && this.searchForm.status.length > 0) {
        const statusLabels = this.searchForm.status.map(status => status === 'enabled' ? '启用' : '禁用')
        conditions.push(`用户状态：${statusLabels.join('、')}`)
      }

      return conditions.length > 0 ? `当前筛选条件：${conditions.join('，')}` : ''
    }
  },
  watch: {
    computedFilterText: {
      handler(newVal) {
        this.filterText = newVal
      },
      immediate: true
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 切换高级搜索面板显示
    toggleAdvancedSearch() {
      this.advancedSearchVisible = !this.advancedSearchVisible
    },

    // 获取用户列表
    async getUserList() {
      this.listLoading = true
      try {
        // 模拟API调用，实际项目中应该调用真实的API
        const response = await this.fetchUserList(this.listQuery, this.searchForm)
        this.userList = response.data.items
        this.total = response.data.total
      } catch (error) {
        this.$message.error('获取用户列表失败')
        console.error('获取用户列表失败:', error)
      } finally {
        this.listLoading = false
      }
    },

    // 模拟API调用
    fetchUserList(query, searchForm) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // 模拟数据
          const mockData = this.generateMockData(query, searchForm)
          resolve({
            data: {
              items: mockData.items,
              total: mockData.total
            }
          })
        }, 500)
      })
    },

    // 生成模拟数据
    generateMockData(query, searchForm) {
      const allData = []
      for (let i = 1; i <= 100; i++) {
        allData.push({
          id: i,
          name: `用户${i}`,
          phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          role: ['super_admin', 'admin', 'user'][Math.floor(Math.random() * 3)],
          createTime: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          status: Math.random() > 0.3 ? 'enabled' : 'disabled'
        })
      }

      // 根据搜索条件过滤数据
      const filteredData = allData.filter(item => {
        // 手机号筛选
        if (searchForm.phone && !item.phone.includes(searchForm.phone)) {
          return false
        }

        // 角色筛选
        if (searchForm.role && item.role !== searchForm.role) {
          return false
        }

        // 创建时间筛选
        if (searchForm.dateRange && searchForm.dateRange.length === 2) {
          const startTime = new Date(searchForm.dateRange[0]).getTime()
          const endTime = new Date(searchForm.dateRange[1]).getTime() + 24 * 60 * 60 * 1000
          const itemTime = item.createTime.getTime()
          if (itemTime < startTime || itemTime > endTime) {
            return false
          }
        }

        // 用户状态筛选
        if (searchForm.status && searchForm.status.length > 0) {
          if (!searchForm.status.includes(item.status)) {
            return false
          }
        }

        return true
      })

      // 分页
      const start = (query.page - 1) * query.limit
      const end = start + query.limit

      return {
        items: filteredData.slice(start, end),
        total: filteredData.length
      }
    },

    // 搜索
    handleSearch() {
      this.listQuery.page = 1
      this.getUserList()
    },

    // 重置搜索条件
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.status = []
      this.listQuery.page = 1
      this.getUserList()
    },

    // 表格选择变化
    handleSelectionChange(val) {
      this.selectedUsers = val
    },

    // 导出选中数据
    handleExportSelected() {
      if (this.selectedUsers.length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }

      this.exportData(this.selectedUsers, '选中用户')
    },

    // 导出全部数据
    handleExportAll() {
      if (this.total === 0) {
        this.$message.warning('当前无符合条件的数据可导出')
        return
      }

      this.exportLoading = true
      // 模拟获取全部数据
      this.fetchAllUserData().then(allData => {
        this.exportData(allData, '全部用户')
      }).catch(error => {
        this.$message.error('导出失败')
        console.error('导出失败:', error)
      }).finally(() => {
        this.exportLoading = false
      })
    },

    // 获取全部用户数据
    fetchAllUserData() {
      return new Promise((resolve) => {
        // 模拟获取全部数据
        const allData = this.generateMockData({ page: 1, limit: 1000 }, this.searchForm)
        resolve(allData.items)
      })
    },

    // 导出数据
    exportData(data, type) {
      this.exportLoading = true

      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户ID', '姓名', '手机号', '角色', '创建时间', '用户状态']
        const filterVal = ['id', 'name', 'phone', 'role', 'createTime', 'status']

        const list = data.map(item => {
          return {
            ...item,
            role: this.getRoleLabel(item.role),
            createTime: parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}'),
            status: item.status === 'enabled' ? '启用' : '禁用'
          }
        })

        const filename = `用户列表_${parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')}`

        excel.export_json_to_excel({
          header: tHeader,
          data: this.formatJson(filterVal, list),
          filename: filename,
          autoWidth: true,
          bookType: 'xlsx'
        })

        this.$message.success(`${type}数据导出成功`)
      }).catch(error => {
        this.$message.error('导出失败')
        console.error('导出失败:', error)
      }).finally(() => {
        this.exportLoading = false
      })
    },

    // 格式化JSON数据
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

    // 获取角色标签
    getRoleLabel(role) {
      const roleMap = {
        super_admin: '超级管理员',
        admin: '普通管理员',
        user: '普通用户'
      }
      return roleMap[role] || role
    },

    // 获取角色类型
    getRoleType(role) {
      const typeMap = {
        super_admin: 'danger',
        admin: 'warning',
        user: 'info'
      }
      return typeMap[role] || 'info'
    },

    // 编辑用户
    handleEdit(row) {
      this.$message.info(`编辑用户: ${row.name}`)
      // 实际项目中应该跳转到编辑页面或打开编辑对话框
    },

    // 切换用户状态
    handleToggleStatus(row) {
      const action = row.status === 'enabled' ? '禁用' : '启用'
      this.$confirm(`确定要${action}用户「${row.name}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟API调用
        row.status = row.status === 'enabled' ? 'disabled' : 'enabled'
        this.$message.success(`${action}用户成功`)
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.advanced-search-panel {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.search-buttons {
  text-align: right;
}

.export-buttons {
  margin-top: 20px;
  text-align: right;
}

.filter-text {
  margin-top: 20px;
}

.meta-item__icon {
  margin-right: 4px;
}

.pagination-container {
  margin-top: 20px;
}
</style>
