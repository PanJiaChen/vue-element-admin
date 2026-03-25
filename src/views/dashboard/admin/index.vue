<template>
  <div class="dashboard-home">
    <el-row :gutter="24">
      <el-col :xs="24" :md="16">
        <el-card shadow="never" class="hero-card">
          <div class="eyebrow">ADMIN HOME</div>
          <h2>竞赛管理后台已接入现有认证与菜单系统</h2>
          <p>
            当前登录账号为 <strong>{{ name }}</strong>，角色为 <strong>{{ roleLabel }}</strong>。
            登录后使用后端返回的 JWT 完成鉴权，并根据 `/api/admin/auth/menu` 动态生成左侧导航。
          </p>
          <div class="endpoint-list">
            <span>登录接口：`/api/admin/auth/login`</span>
            <span>菜单接口：`/api/admin/auth/menu`</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-label">已加载菜单</div>
          <div class="summary-value">{{ menuItems.length }}</div>
          <div class="summary-hint">来自后端动态菜单，不再依赖 mock 数据。</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="menu-card">
      <div slot="header" class="clearfix">
        <span>当前可访问菜单</span>
      </div>
      <el-row :gutter="16">
        <el-col v-for="item in menuItems" :key="item.path" :xs="24" :sm="12" :lg="8">
          <div class="menu-item">
            <div class="menu-title">{{ item.title }}</div>
            <div class="menu-path">{{ item.path }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'DashboardAdmin',
  computed: {
    name() {
      return this.$store.getters.name || '管理员'
    },
    roleLabel() {
      const roles = this.$store.getters.roles || []
      return roles.join(', ') || 'ADMIN'
    },
    menuItems() {
      return (this.$store.getters.permission_routes || [])
        .filter(route => route.path && !route.hidden && route.path !== '*')
        .map(route => ({
          path: route.path,
          title: route.meta && route.meta.title ? route.meta.title : route.name || route.path
        }))
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-home {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.hero-card,
.summary-card,
.menu-card {
  border-radius: 12px;
}

.hero-card {
  min-height: 220px;
}

.eyebrow {
  color: #409eff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}

h2 {
  margin: 0 0 16px;
  color: #1f2d3d;
  font-size: 28px;
}

p {
  margin: 0;
  color: #4a5568;
  line-height: 1.7;
}

.endpoint-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
  color: #606266;
  font-size: 13px;
}

.summary-card {
  min-height: 220px;
  display: flex;
  align-items: center;
}

.summary-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 12px;
}

.summary-value {
  color: #303133;
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}

.summary-hint {
  margin-top: 12px;
  color: #606266;
  line-height: 1.6;
}

.menu-card {
  margin-top: 24px;
}

.menu-item {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fff;
}

.menu-title {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.menu-path {
  margin-top: 8px;
  color: #909399;
  font-size: 13px;
}
</style>
