<template>
  <div class="app-container wrapper">
    <el-button type="primary" @click="handleNewRole">新增角色</el-button>

    <el-table :data="rolesData" style="width: 100%" class="roles-table">
      <el-table-column label="角色名称" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="角色描述">
        <template slot-scope="scope">{{ scope.row.describe }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="newRoleDialogVisible" title="新增角色">
      <el-form :model="newRole" class="new-role-form">
        <el-form-item label="角色名称">
          <el-input v-model="newRole.name" placeholder="角色名称"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="newRole.describe" placeholder="角色描述"/>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="confirmNewRole">确定</el-button>
      <el-button type="danger" @click="cancleNewRole">取消</el-button>
    </el-dialog>

    <el-dialog :visible.sync="permissionDialogVisible" title="修改权限">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          <span>{{ checkedRole.data.name }}</span>
        </el-form-item>
        <el-form-item label="菜单列表">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="MapRoutesData" :props="defaultProps" :filter-node-method="filterNode" show-checkbox node-key="id" class="permission-tree"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmPermission">确定</el-button>
          <el-button type="danger" @click="canclePermission">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { deepClone } from '@/utils'
import { generateTitle } from '@/utils/i18n'
import { newRole, deleteRole, updateRole, fetchRoles } from '@/api/role'
import { fetchAsyncRoutes } from '@/api/routes'

export default {
  data() {
    return {
      checkStrictly: false,
      routesData: [],
      newRoleDialogVisible: false,
      permissionDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      newRole: {
        id: '',
        name: '',
        describe: '',
        accessibleRoutes: []
      },
      checkedRole: {
        index: null,
        data: {
          id: '',
          name: '',
          describe: '',
          accessibleRoutes: []
        }
      },
      rolesData: []
    }
  },
  computed: {
    MapRoutesData() {
      const traverseRoutes = routes => {
        return routes.map(route => {
          if (route.children && this.onlyOneShowingChild(route.children, route) && !route.alwaysShow) {
            route = this.onlyOneShowingChild(route.children, route)
          }
          route.children && (route.children = traverseRoutes(route.children))
          route.name = this.generateTitle((route.meta && route.meta.title) || route.name || route.path || Math.random() + '')
          return route
        })
      }
      return traverseRoutes(this.routesData)
    }
  },
  created() {
    fetchAsyncRoutes().then(res => {
      this.routesData = res.data
    })
    fetchRoles().then(res => {
      console.log(res)
      this.rolesData = res.data
    })
  },
  methods: {
    generateTitle,
    // 过滤掉隐藏的菜单
    filterNode(value, data) {
      return !data.hidden
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children, parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        return onlyOneChild
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    handleNewRole() {
      this.newRoleDialogVisible = true
    },
    handleEdit(scope) {
      this.checkedRole.index = scope.$index
      // 修复setCheckedKeys leaf only情况下, none-leaf node不会被check的bug
      this.checkStrictly = true
      this.checkedRole.data = deepClone(scope.row)
      this.permissionDialogVisible = true
      this.$nextTick(() => {
        this.$refs.tree.filter()
        this.$refs.tree.setCheckedKeys(
          this.checkedRole.data.accessibleRoutes,
          true
        )
        this.checkStrictly = false
      })
      // this.checkStrictly = false
    },
    handleDelete(scope) {
      this.$confirm('此操作将删除角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return deleteRole(scope.row.id)
        })
        .then(res => {
          this.rolesData.splice(scope.$index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => {
          console.error(err)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    confirmPermission() {
      let routeIds = this.$refs.tree
        .getCheckedNodes(false, true).reduce((result, node) => {
          // 如果父菜单被隐藏(onlyOneShowingChild),需要把父菜单的id也添加进去
          return result.concat(node.id, node.parentId)
        }, [])
      routeIds = Array.from(new Set(routeIds))
      updateRole(this.checkedRole.data.id, {
        ...this.rolesData[this.checkedRole.index],
        accessibleRoutes: routeIds
      }).then(res => {
        this.rolesData[this.checkedRole.index].accessibleRoutes = routeIds
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.permissionDialogVisible = false
      })
    },
    canclePermission() {
      this.permissionDialogVisible = false
    },
    resetNewRole() {
      this.newRole = {
        id: '',
        name: '',
        describe: '',
        accessibleRoutes: []
      }
    },
    confirmNewRole() {
      newRole(this.newRole).then(res => {
        this.newRole.id = res.data.id
        this.rolesData.push(deepClone(this.newRole))
        this.resetNewRole()
        this.newRoleDialogVisible = false
      })
    },
    cancleNewRole() {
      this.resetNewRole()
      this.newRoleDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 40px;
  }
  .permission-tree {
    margin-bottom: 40px;
  }
}
</style>
