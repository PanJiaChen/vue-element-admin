<template>
  <el-collapse
    v-if="!unsupportedDashboards.includes(dashboard.fileName)"
    v-model="activeDashboard"
    accordion
  >
    <el-collapse-item
      :name="dashboard.dashboardName"
      :disabled="!dashboard.isCollapsible"
      class="custom-collapse-item"
    >
      <template slot="title">
        <span class="custom-title"> {{ dashboard.dashboardName }}</span>
      </template>
      <component
        :is="renderDashboard"
        :ref="dashboard.dashboardName"
        :metadata="dashboard"
      />
    </el-collapse-item>
  </el-collapse>
</template>

<script>

export default {
  name: 'Dashboard',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dashboard: this.metadata,
      unsupportedDashboards: ['activities', 'views', 'performance'],
      activeDashboard: this.metadata.isOpenByDefault ? this.metadata.dashboardName : undefined
    }
  },
  computed: {
    // load the component that is indicated in the attributes of received property
    renderDashboard() {
      // TODO: Add support to this list of currently unsupported dashboards
      if (this.unsupportedDashboards.includes(this.metadata.fileName)) {
        return
      }
      if (this.metadata.fileName === 'userfavorites') {
        return () => import('@/components/ADempiere/Dashboard/favourites')
      }
      return () => import(`@/components/ADempiere/Dashboard/${this.metadata.fileName}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-title {
    padding: 10px;
  }
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
  .custom-collapse-item.is-disabled {
    .custom-title {
      color: #303133;
    }
  }
</style>
