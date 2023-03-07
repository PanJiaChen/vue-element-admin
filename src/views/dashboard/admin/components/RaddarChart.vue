<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
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
          text: '云龙区农机使用统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '拖拉机', max: 10000 },
            { name: '推土机', max: 20000 },
            { name: '挖掘机', max: 20000 },
            { name: '无人机', max: 20000 },
            { name: '收割机', max: 20000 },
            { name: '抽水机', max: 20000 }
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['全市使用时长', '该区使用时长']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            // {
            //   value: [5000, 7000, 12000, 11000, 15000, 14000],
            //   name: 'Allocated Budget'
            // },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: '全市使用时长'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: '该区使用时长'
            }
          ],
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
