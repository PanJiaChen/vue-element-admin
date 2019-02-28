<template>
  <div class="app-container wrapper">
    <el-button type="primary" @click="handleaddRole">{{ $t('permission.addRole') }}</el-button>

    <el-table :data="rolesData" style="width: 100%" class="roles-table">
      <el-table-column label="Role Id" width="220">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="Role Name" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="Description">
        <template slot-scope="scope">{{ scope.row.describe }}</template>
      </el-table-column>
      <el-table-column label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">{{ $t('permission.editPermission') }}</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">{{ $t('permission.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="addRoleDialogVisible" title="New Role">
      <el-form :model="addRole" class="new-role-form">
        <el-form-item label="Role Name">
          <el-input v-model="addRole.name" placeholder="role name"/>
        </el-form-item>
        <el-form-item label="Role Description">
          <el-input v-model="addRole.describe" placeholder="role Description"/>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="confirmaddRole">{{ $t('permission.confirm') }}</el-button>
      <el-button type="danger" @click="cancleaddRole">{{ $t('permission.cancel') }}</el-button>
    </el-dialog>

    <el-dialog :visible.sync="permissionDialogVisible" :title="$t('permission.editPermission')">
      <el-form label-width="100px">
        <el-form-item label="Role Name">
          <span>{{ checkedRole.data.name }}</span>
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="MapRoutesData" :props="defaultProps" :filter-node-method="filterNode" show-checkbox node-key="id" class="permission-tree"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmPermission">{{ $t('permission.confirm') }}</el-button>
          <el-button type="danger" @click="canclePermission">{{ $t('permission.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { deepClone } from '@/utils'
import { generateTitle } from '@/utils/i18n'
import { addRole, deleteRole, updateRole, getRoles } from '@/api/role'
import { fetchAsyncRoutes } from '@/api/routes'

export default {
  data() {
    return {
      checkStrictly: false,
      routesData: [],
      addRoleDialogVisible: false,
      permissionDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      addRole: {
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
          route.name = this.generateTitle((route.meta && route.meta.title) || route.name)
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
    getRoles().then(res => {
      console.log(res)
      this.rolesData = res.data
    })
  },
  methods: {
    generateTitle,
    // filter out the hidden route menu
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
    handleaddRole() {
      this.addRoleDialogVisible = true
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
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          return deleteRole(scope.row.id)
        })
        .then(res => {
          this.rolesData.splice(scope.$index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => {
          console.error(err)
          this.$message({
            type: 'info',
            message: 'Delete canceled'
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
          message: 'Edit succed',
          type: 'success'
        })
        this.permissionDialogVisible = false
      })
    },
    canclePermission() {
      this.permissionDialogVisible = false
    },
    resetaddRole() {
      this.addRole = {
        id: '',
        name: '',
        describe: '',
        accessibleRoutes: []
      }
    },
    confirmaddRole() {
      addRole(this.addRole).then(res => {
        this.addRole.id = res.data.id
        this.rolesData.push(deepClone(this.addRole))
        this.resetaddRole()
        this.addRoleDialogVisible = false
      })
    },
    cancleaddRole() {
      this.resetaddRole()
      this.addRoleDialogVisible = false
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
