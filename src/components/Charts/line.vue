<template>
    <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>
<script>
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    // 引入图
    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/markLine');
    require('echarts/lib/component/markPoint');
    require('echarts/lib/component/tooltip');
    export default {
      name: 'lineChart',
      props: {
        className: {
          type: String,
          default: 'line-chart'
        },
        id: {
          type: String,
          default: 'line-chart'
        },
        width: {
          type: String,
          default: '100%'
        },
        height: {
          type: String,
          default: '280px'
        },
        listData: {
          type: Array,
          require: true
        }
      },
      data() {
        return {
          chart: null
        };
      },
      watch: {
        listData(dataList) {
          this.setLine(dataList)
        }
      },
      mounted() {
        this.chart = echarts.init(document.getElementById(this.id));
        this.setLine(this.listData);
      },
      methods: {
        setLine(dataList) {
          const xAxisData = [];
          const data = [];
          for (let i = 0; i < dataList.length; i++) {
            const item = dataList[i]
            xAxisData.push(item.week.substring(item.week.length - 2) + '周');
            data.push(item.count)
          }
          const markLineData = [];
          for (let i = 1; i < data.length; i++) {
            markLineData.push([{
              xAxis: i - 1,
              yAxis: data[i - 1],
              value: data[i] - data[i - 1]
            }, {
              xAxis: i,
              yAxis: data[i]
            }]);
          }
          this.chart.setOption({
            title: {
              text: 'Awesome Chart'
            },
            grid: {
              left: 0,
              right: 0,
              bottom: 20,

              containLabel: true
            },
            tooltip: {
              trigger: 'axis'
            },
            animationDelay: 1000,
            xAxis: {
              data: xAxisData,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
//                        axisLabel:{
//                            show:false
//                        },
            },

            yAxis: {
              splitLine: {
                show: false
              },
              show: false
              // min: 90
            },
            series: [{
              name: '撸文数',
              type: 'line',
              data,
              markPoint: {
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                ]
              },
              itemStyle: {
                normal: {
                  color: '#30b08f'
                }
              },
              markLine: {
                silent: true,
                smooth: true,
                effect: {
                  show: true
                },
                animationDuration(idx) {
                  return idx * 100;
                },
                animationDelay: 1000,
                animationEasing: 'quadraticInOut',
                distance: 1,
                label: {
                  normal: {
                    position: 'middle'
                  }
                },
                symbol: ['none', 'none'],
                data: markLineData
              }
            }]
          })
        }
      }
    }
</script>
