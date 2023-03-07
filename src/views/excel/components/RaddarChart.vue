<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'

const animationDuration = 3000

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
      const option = {
      // color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
        title: {
          text: '2023年3月'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['全市使用时长', '该区使用时长']
        },
        radar: {
          splitNumber: 4,
          indicator: [
            { name: '拖拉机', max: 500 },
            { name: '推土机', max: 500 },
            { name: '挖掘机', max: 500 },
            { name: '无人机', max: 500 },
            { name: '收割机', max: 500 },
            { name: '抽水机', max: 500 }
          ],
          center: ['50%', '50%'],
          radius: '66%',
          axisName: {
            color: '#fff',
            backgroundColor: '#666',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        series: [{
          type: 'radar',
          data: [
            {
              value: [420, 470, 490, 460, 390, 470],
              name: '全市使用时长',
              symbol: 'rect',
              symbolSize: 12,
              lineStyle: {
                type: 'dashed'
              },
              label: {
                show: true,
                formatter: function(params) {
                  return params.value
                }
              }
            },
            {
              value: [40, 170, 110, 430, 210, 300],
              name: '该区使用时长',
              areaStyle: {
                color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                  {
                    color: 'rgba(255, 145, 124, 0.1)',
                    offset: 0
                  },
                  {
                    color: 'rgba(255, 145, 124, 0.9)',
                    offset: 1
                  }
                ])
              },
              label: {
                show: true,
                formatter: function(params) {
                  return params.value
                }
              }
            }
          ],
          animationDuration: animationDuration
        }]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
