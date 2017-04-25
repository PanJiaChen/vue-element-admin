<template>
    <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>
<script>
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');

    require('echarts/lib/component/visualMap');
    export default {
      name: 'barPercent',
      props: {
        className: {
          type: String,
          default: 'chart'
        },
        id: {
          type: String,
          default: 'chart'
        },
        width: {
          type: String,
          default: '200px'
        },
        height: {
          type: String,
          default: '200px'
        }
      },
      data() {
        return {};
      },
      mounted() {
        this.initBar();
      },
      methods: {
        initBar() {
          this.chart = echarts.init(document.getElementById(this.id));

          const xAxisData = [];
          const data = [];
          const data2 = [];
          for (let i = 0; i < 50; i++) {
            xAxisData.push(i);
            data.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
            data2.push((Math.sin(i / 5) * (i / 5 + 10) + i / 6) * 3);
          }
          this.chart.setOption(
            {
              backgroundColor: '#08263a',
              xAxis: [{
                show: false,
                data: xAxisData
              }, {
                show: false,
                data: xAxisData
              }],
              visualMap: {
                show: false,
                min: 0,
                max: 50,
                dimension: 0,
                inRange: {
                  color: ['#4a657a', '#308e92', '#b1cfa5', '#f5d69f', '#f5898b', '#ef5055']
                }
              },
              yAxis: {
                axisLine: {
                  show: false
                },
                axisLabel: {
                  textStyle: {
                    color: '#4a657a'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#08263f'
                  }
                },
                axisTick: {
                  show: false
                }
              },
              series: [{
                name: 'back',
                type: 'bar',
                data: data2,
                z: 1,
                itemStyle: {
                  normal: {
                    opacity: 0.4,
                    barBorderRadius: 5,
                    shadowBlur: 3,
                    shadowColor: '#111'
                  }
                }
              }, {
                name: 'Simulate Shadow',
                type: 'line',
                data,
                z: 2,
                showSymbol: false,
                animationDelay: 0,
                animationEasing: 'linear',
                animationDuration: 1200,
                lineStyle: {
                  normal: {
                    color: 'transparent'
                  }
                },
                areaStyle: {
                  normal: {
                    color: '#08263a',
                    shadowBlur: 50,
                    shadowColor: '#000'
                  }
                }
              }, {
                name: 'front',
                type: 'bar',
                data,
                xAxisIndex: 1,
                z: 3,
                itemStyle: {
                  normal: {
                    barBorderRadius: 5
                  }
                }
              }],
              animationEasing: 'elasticOut',
              animationEasingUpdate: 'elasticOut',
              animationDelay(idx) {
                return idx * 20;
              },
              animationDelayUpdate(idx) {
                return idx * 20;
              }
            })
        }
      }
    }
</script>
