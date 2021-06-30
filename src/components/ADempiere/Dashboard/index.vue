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
  <el-card
    v-if="!unsupportedDashboards.includes(dashboard.fileName)"
    style="height: auto;"
  >
    <div class="clearfix">
      <el-row :gutter="2">
        <el-col :span="isEmptyValue(title) ? 22 : 23">
          <el-button type="text" class="label-dashboard" @click="metadata.isCollapsible = !metadata.isCollapsible">
            {{ labelDashboard }}
          </el-button>
        </el-col>
        <el-col v-if="isEmptyValue(title)" :span="1">
          <el-button type="text" icon="el-icon-files" @click="sendMain(metadata)" />
        </el-col>
        <el-col :span="1">
          <el-button type="text" :icon="!metadata.isCollapsible ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="metadata.isCollapsible = !metadata.isCollapsible" />
        </el-col>
      </el-row>
    </div>
    <transition name="el-zoom-in-top">
      <div v-show="metadata.isCollapsible" class="dashboard-transitio">
        <component
          :is="renderDashboard"
          :ref="dashboard.name"
          :metadata="metadata"
          :height="'450px'"
        />
      </div>
    </transition>
  </el-card>
</template>

<script>
export default {
  name: 'Dashboard',
  props: {
    metadata: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dashboard: this.metadata,
      unsupportedDashboards: ['activities', 'views', 'performance'],
      activeDashboard: this.metadata.isOpenByDefault ? this.metadata.name : undefined
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
      if (this.metadata.dashboardType === 'dashboard') {
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
      } else {
        switch (this.metadata.chartType) {
          //  Bar Chart
          case 'BC':
            dashboard = () => import('@/components/ADempiere/Dashboard/charts/BarChart')
            break
          //  Area Chart
          case 'AC':
            dashboard = () => import('@/components/ADempiere/Dashboard/charts/AreaChart')
            break
          //  Line Chart
          case 'LC':
            dashboard = () => import('@/components/ADempiere/Dashboard/charts/LineChart')
            break
          //  Pie Chart
          case 'PC':
            dashboard = () => import('@/components/ADempiere/Dashboard/charts/PieChart')
            break
          //  Ring Chart
          case 'RC':
            dashboard = () => import('@/components/ADempiere/Dashboard/charts/PieChart')
            break
          //  Waterfall Chart
          case 'WC':
            dashboard = () => import('@/components/ADempiere/Dashboard/charts/WaterfallChart')
            break
          default:
            dashboard = () => import('@/components/ADempiere/Dashboard/charts/LineChart')
            break
        }
      }
      return dashboard
      // return () => import(`@/components/ADempiere/Dashboard/${this.metadata.fileName}`)
    },
    labelDashboard() {
      if (this.isEmptyValue(this.title)) {
        return this.dashboard.name
      }
      return this.title
    }
  },
  methods: {
    sendMain(dashboard) {
      this.$store.commit('setMainDashboard', dashboard)
      this.$forceUpdate()
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
  .el-card__header {
    border: 1px solid #36a3f7;
    padding: 0px;
    margin: 0px;
    box-sizing: border-box;
  }
  .dashboard-transitio {
    margin: 0px;
    width: 100%;
    padding-right: 2%;
    border-radius: 4px;
    text-align: center;
    color: #fff;
    box-sizing: border-box;
    height: 500px;
    overflow: auto;
  }
  .label-dashboard{
    color: black;
    width: 95%;
    text-align: inherit;
    font-weight: 500;
    font-size: large;
    padding-left: 1%;
  }
</style>
<style>
  .el-card__body {
    padding: 5px;
  }
</style>
