<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="8">
      <template v-for="(dashboardAttributes, index) in dashboardList">
        <el-col :key="index" :xs="{ span: 24 }" :sm="{ span: 24 }" :md="{ span: 24 }" :lg="{ span: 12 }" :xl="{ span: 12 }" style="padding-right:8px;margin-bottom:30px;">
          <dashboard :metadata="dashboardAttributes" />
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>

import Dashboard from '@/components/ADempiere/Dashboard'

export default {
  name: 'DashboardAdmin',
  components: {
    Dashboard
  },
  data() {
    return {
      roleUuid: this.$store.getters.getRoleUuid,
      dashboardList: []
    }
  },
  computed: {
    getterDashboard() {
      return this.$store.getters.getDashboardByRole(this.roleUuid)
    }
  },
  mounted() {
    this.getDashboardListFromServer()
  },
  methods: {
    getDashboardListFromServer() {
      if (this.getterDashboard) {
        this.dashboardList = this.getterDashboard.dashboardList
      } else {
        this.$store.dispatch('listDashboard', this.roleUuid)
          .then(response => {
            this.dashboardList = response.dashboardsList
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
