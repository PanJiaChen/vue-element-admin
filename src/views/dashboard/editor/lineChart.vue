<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>
<script>
  import echarts from 'echarts';
  require('echarts/theme/macarons'); // echarts 主题

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
        default: '300px'
      }
    },
    data() {
      return {
        chart: null
      };
    },
    mounted() {
      this.initChart();
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');

        this.chart.setOption({
          xAxis: {
            data: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            boundaryGap: false
          },
          grid: {
            left: 0,
            right: 0,
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
            name: 'vistor',
            itemStyle: {
              normal: {
                areaStyle: {}
              }
            },
            smooth: true,
            type: 'line',
            data: [100, 120, 161, 134, 105, 160, 165]
          },
          {
            name: 'buyer',
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
            data: [120, 82, 91, 154, 162, 140, 130]
          }]
        })
      }
    }
}
</script>
