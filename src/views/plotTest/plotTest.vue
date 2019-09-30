<template>
  <div>
    <div class="dashboard-editor-container">
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <!-- <line-chart :chart-data="{xAxisData, yAxisData, label}" /> -->
        <h2>History Plot</h2>
        <line-chart :chart-data="past" />
        <h2>Prediction Plot</h2>
        <line-chart :chart-data="future" />
      </el-row>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import LineChart from '@/views/dashboard/admin/components/LineChart'
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from '@/views/dashboard/admin/components/PanelGroup'
import RaddarChart from '@/views/dashboard/admin/components/RaddarChart'
import PieChart from '@/views/dashboard/admin/components/PieChart'
import BarChart from '@/views/dashboard/admin/components/BarChart'
import TransactionTable from '@/views/dashboard/admin/components/TransactionTable'
import TodoList from '@/views/dashboard/admin/components/TodoList'
import BoxCard from '@/views/dashboard/admin/components/BoxCard'

import router from '@/router'

const lineChartData = {
  newVisitis: {
    xAxisData: [120, 82, 91, 154, 162, 140, 145,230],
    yAxisData: ['120', '82', '91', '154', '162', '140', '145','230'],
    label: 'Future'
  },
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  props: {
    past: {
      xAxisData: {
        default: [120, 82, 91, 154, 162, 140, 145,230]
      },
      yAxisData: {
        default: ['a', 'x', 'c', 'd', 'e', 'f', 'g', 'h']
      },
      label: {
        default: 'Future'
      },
      colorPicked: {
        default: '#999997'
      }
    },
    future: {
      xAxisData: {
        default: [120, 82, 91, 154, 162, 140, 145,230]
      },
      yAxisData: {
        default: ['a', 'x', 'c', 'd', 'e', 'f', 'g', 'h']
      },
      label: {
        default: 'Future'
      },
      colorPicker: {
        default: '#999997'
      }
    }

  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
