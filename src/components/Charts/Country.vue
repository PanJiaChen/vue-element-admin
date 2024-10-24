vue
<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china'
import resize from './mixins/resize'
// import 'echarts/map/js/province/*' // 如果需要绘制省份地图

export default {
  mixins: [resize],
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
    return {
      defaultProvince: '北京', // 设置默认展示的省份
      mapData: [
        { name: '北京', value: 100 },
        { name: '天津', value: 200 },
        { name: '河北', value: 300 },
        { name: '山西', value: 400 },
        { name: '内蒙古', value: 500 },
        { name: '辽宁', value: 600 },
        { name: '吉林', value: 700 },
        { name: '黑龙江', value: 800 },
        { name: '上海', value: 900 },
        { name: '江苏', value: 1000 },
        { name: '浙江', value: 1100 },
        { name: '安徽', value: 1200 },
        { name: '福建', value: 1300 },
        { name: '江西', value: 1400 },
        { name: '山东', value: 1500 },
        { name: '河南', value: 1600 },
        { name: '湖北', value: 1700 },
        { name: '湖南', value: 1800 },
        { name: '广东', value: 1900 },
        { name: '广西', value: 2000 },
        { name: '海南', value: 2100 },
        { name: '重庆', value: 2200 },
        { name: '四川', value: 2300 },
        { name: '贵州', value: 2400 },
        { name: '云南', value: 2500 },
        { name: '西藏', value: 2600 },
        { name: '陕西', value: 2700 },
        { name: '甘肃', value: 2800 },
        { name: '青海', value: 2900 },
        { name: '宁夏', value: 3000 },
        { name: '新疆', value: 3100 },
        { name: '台湾', value: 3200 },
        { name: '香港', value: 3300 },
        { name: '澳门', value: 3400 }
      ],
      chart: null
    }
  },
  mounted() {
    this.initChart()
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
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        title: {
          text: '中国地图疫情数据分布', // 设置地图标题
          left: 'center',
          top: '40px',
          textStyle: {
            color: '#fff',
            fontSize: 30 // 设置标题字体大小
          }
        },
        backgroundColor: '#424255', // 设置整个地图的背景颜色
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: 0,
          max: 3500,
          left: 'left',
          top: 'bottom',
          text: ['High', 'Low'],
          calculable: true,
          inRange: {
            color: ['#FFA07A', '#20B2AA'] // 设置颜色范围为根据判断调整的颜色
          },          
          itemHeight: 200, // 调整进度条高度
          itemWidth: 20, // 调整进度条宽度
          textStyle: {
            color: '#fff' // 设置文字颜色
          }
        },
        series: [
          {
            name: '疫情数据',
            type: 'map',
            map: 'china',
            itemStyle: {
              normal: {
                areaColor: '#424255', // 设置省份颜色与背景颜色一致
                borderColor: '#fff',
                label: {
                  show: true, // 显示省份名称
                  textStyle: {
                    // color: '#ccc'
                  }
                }
              },
              emphasis: {
                label: {
                  color: '#fff' // 设置省份名称颜色与背景颜色一致
                }
              }
            },
            data: this.mapData,
          }
        ]
      })
    }
  }
}
</script>
