<template>
  <div class="dashboard-editor-container">
    <github-corner></github-corner>
    <!-- <el-row class="btn-group">
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn blue-btn" to="/components/index">Components</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn light-blue-btn" to="/charts/index">Charts</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn pink-btn" to="/excel/download">Excel</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn green-btn" to="/example/table/complex-table">Table</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn tiffany-btn" to="/form/edit-form">Form</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn yellow-btn" to="/theme/index">Theme</router-link>
      </el-col>
    </el-row> -->
    <el-row class="panel-group" :gutter="40">
      <el-col :span="6">
        <div class='card-panel no-margin-left' @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class='card-panel-description'>
            <div class='card-panel-text'>New Visits</div>
            <count-to class="card-panel-num" :startVal='0' :endVal='102400' :duration='3600'></count-to>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class='card-panel' @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class='card-panel-description'>
            <div class='card-panel-text'>Messages</div>
            <count-to class="card-panel-num" :startVal='0' :endVal='81212' :duration='3600'></count-to>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class='card-panel' @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class='card-panel-description'>
            <div class='card-panel-text'>Purchases</div>
            <count-to class="card-panel-num" :startVal='0' :endVal='9280' :duration='3600'></count-to>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class='card-panel  no-margin-right' @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
          </div>
          <div class='card-panel-description'>
            <div class='card-panel-text'>Shoppings</div>
            <count-to class="card-panel-num" :startVal='0' :endVal='1299' :duration='3600'></count-to>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top:30px;background:#fff;padding:15px 15px 0;">
      <line-chart :chart-data='lineChartData'></line-chart>
    </el-row>

    <el-row style="margin-top:30px;">
      <el-col :span="8">
        <div class="chart-wrapper no-margin-left">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-wrapper no-margin-right">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top:30px;">
      <el-col :span="12" style="padding-right:8px;">
        <transaction-table></transaction-table>
      </el-col>
      <el-col :span="6">
        <todo-list style="margin:0 8px;"></todo-list>
      </el-col>
      <el-col :span="6">
        <box-card></box-card>
      </el-col>

    </el-row>

  </div>
</template>




<script>
import CountTo from 'vue-count-to'
import GithubCorner from '@/components/GithubCorner'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 101, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'dashboard-admin',
  components: {
    CountTo,
    GithubCorner,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
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

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 30px;
  background-color: rgb(240, 242, 245);
  .no-margin-left {
    margin-left: 0!important;
  }
  .no-margin-right {
    margin-right: 0!important;
  }
  .panel-group {
    margin-top: 20px;
  }
  .card-panel {
    // margin: 0 25px;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #36a3f7;
      }
      .icon-message {
        background: #f4516c;
      }
      .icon-money {
        background: #716aca;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #36a3f7;
    }
    .icon-message {
      color: #f4516c;
    }
    .icon-money {
      color: #716aca;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
  .chart-wrapper {
    background: #fff;
    margin: 0 15px;
    padding: 15px 15px 0;
  }
  .btn-group {
    margin-bottom: 60px;
  }
}
</style>
