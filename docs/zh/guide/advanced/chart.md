# 图表

管理后台图表也是常见得需求。这里图表就只推荐 ECharts，功能齐全，社区 demo 也丰富 [gallery](http://gallery.echartsjs.com/explore.html)。

我还是那个观点，大部分插件建议大家还是自己用 vue 来封装就好了，真的很简单。ECharts 支持 webpack 引入，图省事可以将 ECharts 整个引入 `var echarts = require('echarts')` 不过 ECharts 还是不小的，如果只使用它小部分功能或者图表类型的话建议按需引入。

```js
// 按需引入 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

//全部引入
var echarts = require('echarts')
```

[webpack 中使用 ECharts 文档](http://echarts.baidu.com/tutorial.html#%E5%9C%A8%20webpack%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20ECharts)

[ECharts 按需引入模块文档](https://github.com/ecomfe/echarts/blob/master/index.js)

接下来我们就要在 vue 中声明初始化 ECharts 了。因为 ECharts 初始化必须绑定 dom，所以我们只能在 vue 的 mounted 生命周期里进行初始化。

```js
mounted() {
  this.initCharts();
},
methods: {
  initCharts() {
    this.chart = echarts.init(this.$el);
    this.setOptions();
  },
  setOptions() {
    this.chart.setOption({
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    })
  }
}
```

就这样简单，ECharts 就配置完成了，这时候你想说我的 data 是远程获取的，或者说我动态改变 ECharts 的配置该怎么办呢？我们可以通过 watch 来触发 setOptions 方法

```js
//第一种 watch options变化 利用vue的深度 watcher，options 一有变化就重新setOption
watch: {
  options: {
    handler(options) {
      this.chart.setOption(this.options)
    },
    deep: true
  },
}
//第二种 只watch 数据的变化 只有数据变化时触发ECharts
watch: {
  seriesData(val) {
    this.setOptions({series:val})
  }
}
```

其实都差不多，还是要结合自己业务来封装。后面就和平时使用 ECharts 没有什么区别了。题外话 ECharts 的可配置项真心多，大家使用的时候可能要花一点时间了解它的 api 的。知乎有个问题：百度还有什么比较良心的产品？答案：ECharts，可见 ECharts 的强大与好用。

## Demo

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/137aeadd-ad0e-4b21-badd-c53f96b7482b.gif)

::: tip
具体实例可参照 `@/views/dashboard/admin/components/` 文件下几个 chart 文件
:::

## ECharts 图表宽度显示不正确？

有的时候你将 ECharts 放到 `el-tab`或者 `el-dialog`之中，会发现图表的宽度会显示的不那么正确。如下图：

<img :src="$withBase('/images/ECharts-width.png')" alt="ECharts-width.png" width="500px">

因为 ECharts 本身并不是自适应的，当你父级容器的宽度发生变化的时候需要手动调用它的 `.resize()` 方法。
所有比如 `el-tab`，你可以监听 `change` 事件，当变化时找到这个图表之后调用它的 `.resize()` 方法。

```html
<template>
  <el-tabs v-model="active" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="first">
      <Chart ref="Chart" />
    </el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        active: 'second'
      };
    },
    watch: {
      active(val) {
        this.$nextTick(() => {
          this.$refs.Chart.resize();
        }
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
```

如果是 `el-dialog`之中放图表就比较简单了，只要在 dialog 出现之后再 init 图表就可以了。

## 其它

当然社区里的其它图表如 [d3](https://github.com/d3/d3) , [Chart.js](https://github.com/chartjs/Chart.js) , [chartist-js](https://github.com/gionkunz/chartist-js) 等封装方法都是大同小异差不多的，这里就不再展开了。
