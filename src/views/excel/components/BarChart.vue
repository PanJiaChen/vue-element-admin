<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'

const animationDuration = 6000

export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '2023年3月'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          // Try 'horizontal'
          orient: 'vertical',
          right: 10,
          top: 'center'
        },
        grid: {
          top: 30,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        yAxis: [{
          type: 'category',
          data: ['拖拉机', '抽水机', '无人机', '挖掘机', '收割机'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        series: [{
          name: '使用量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [179, 92, 200, 334, 390],
          animationDuration
        }, {
          name: '闲置量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [80, 12, 200, 334, 390],
          animationDuration
        }, {
          name: '故障量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [30, 2, 10, 24, 30],
          animationDuration
        }]
      })
    }
  }
}
</script>
