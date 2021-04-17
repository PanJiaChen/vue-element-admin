<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Leonel Matos lmatos@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
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
        <span class="custom-title">
          {{ dashboard.dashboardName }}
        </span>
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

      let dashboard
      switch (this.metadata.fileName) {
        case 'recentItems':
          dashboard = () => import('@/components/ADempiere/Dashboard/recentItems')
          break
        case 'userfavorites':
          dashboard = () => import('@/components/ADempiere/Dashboard/userfavorites')
          break
        case 'docstatus':
          dashboard = () => import('@/components/ADempiere/Dashboard/docstatus')
          break
        default:
          dashboard = () => import('@/components/ADempiere/Dashboard/calendar')
          break
      }
      return dashboard
      // return () => import(`@/components/ADempiere/Dashboard/${this.metadata.fileName}`)
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
