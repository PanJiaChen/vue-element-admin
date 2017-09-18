<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts 主题
import { debounce } from '@/utils'

export default {
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          containLabel: true
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        yAxis: {},
        series: [{
          name: 'visitors',
          itemStyle: {
            normal: {
              areaStyle: {}
            }
          },
          smooth: true,
          type: 'line',
          data: [100, 120, 161, 134, 105, 160, 165],
          animationDuration: 2600,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'buyers',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: 'rgba(2, 197, 233, 0.2)',
              lineStyle: {
                color: 'rgba(2, 197, 233, 0.2)'
              },
              areaStyle: {
                color: 'rgba(99,194,255, 0.6)'
              }
            }
          },
          data: [120, 82, 91, 154, 162, 140, 130],
          animationDuration: 2000,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
