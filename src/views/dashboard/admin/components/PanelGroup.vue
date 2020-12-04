<template>
  <el-row :gutter="40" class="panel-group">
    <el-col v-for="(panelData,index) in panelGroupData" :key="index" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData(panelData.name)">
        <div :class="panelData.divClass" class="card-panel-icon-wrapper">
          <svg-icon :icon-class="panelData.iconClass" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ panelData.text }}
          </div>
          <count-to :start-val="panelData.countTo.startVal" :end-val="panelData.countTo.endVal" :duration="panelData.countTo.duration" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      panelGroupData: [
        {
          name: 'newVisitors',
          divClass: 'icon-people',
          iconClass: 'peoples',
          text: 'New Visitors',
          countTo: {
            startVal: 0,
            endVal: 102400,
            duration: 2600
          }
        },
        {
          name: 'messages',
          divClass: 'icon-message',
          iconClass: 'message',
          text: 'Messages',
          countTo: {
            startVal: 0,
            endVal: 81212,
            duration: 3000
          }
        },
        {
          name: 'purchases',
          divClass: 'icon-money',
          iconClass: 'money',
          text: 'Purchases',
          countTo: {
            startVal: 0,
            endVal: 9280,
            duration: 3200
          }
        },
        {
          name: 'shoppings',
          divClass: 'icon-shopping',
          iconClass: 'shopping',
          text: 'Shoppings',
          countTo: {
            startVal: 0,
            endVal: 13600,
            duration: 3600
          }
        }
      ]
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
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
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
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
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
