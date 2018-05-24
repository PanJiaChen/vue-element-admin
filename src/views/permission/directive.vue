<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />

    <div :key="key" style="margin-top:30px;">
      <span v-permission="['admin']" class="permission-alert">
        Only <el-tag class="permission-tag" size="small">admin</el-tag> can see this
      </span>
      <span v-permission="['editor']" class="permission-alert">
        Only <el-tag class="permission-tag" size="small">editor</el-tag> can see this
      </span>
      <span v-permission="[]" class="permission-alert">
        Both <el-tag class="permission-tag" size="small">admin</el-tag> and <el-tag class="permission-tag" size="small">editor</el-tag> can see this
      </span>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import SwitchRoles from './components/SwitchRoles'

export default{
  name: 'directivePermission',
  components: { SwitchRoles },
  directives: { permission },
  data() {
    return {
      key: 1 // 为了能每次切换权限的时候重新初始化指令
    }
  },
  methods: {
    handleRolesChange() {
      this.key++
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ .permission-alert {
    width: 320px;
    margin-top: 30px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: block;
  }
  /deep/ .permission-tag{
    background-color: #ecf5ff;
  }
}
</style>

