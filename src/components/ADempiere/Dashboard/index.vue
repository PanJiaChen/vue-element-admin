<template>
  <component
    :is="renderDashboard"
    :ref="dashboard.dashboardName"
    :metadata="dashboard"
  />
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
      dashboard: this.metadata
    }
  },
  computed: {
    // load the component that is indicated in the attributes of received property
    renderDashboard() {
      // TODO: Add support to this list of currently unsupported dashboards
      const unsupportedDashboards = ['activities', 'views', 'calendar', 'performance']
      if (unsupportedDashboards.includes(this.metadata.fileName)) {
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
