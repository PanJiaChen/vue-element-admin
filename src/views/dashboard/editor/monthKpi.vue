<template>
    <div class="monthKpi-container">
        <span class="monthKpi-container-title">{{month}}月</span>
        <BarPercent class="monthKpi-container-chart" :dataNum='articlesComplete'></BarPercent>
        <span class="monthKpi-container-text">文章完成比例</span>
        <span class="monthKpi-container-count">{{articlesComplete}}<b>篇</b></span>
    </div>
</template>

<script>
    import BarPercent from 'components/Charts/barPercent';
    export default {
      name: 'monthKpi',
      components: { BarPercent },
      props: {
        articlesComplete: {
          type: Number
        }
      },
      data() {
        return {
          month: new Date().getMonth() + 1
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .monthKpi-container{
        width: 100%;
    }
    .monthKpi-container-title {
        color: #7F8C8D;
        font-size: 16px;
        display: inline-block;
        margin-top: 10px;
    }

    .monthKpi-container-chart {
        margin-left: 100px;
        margin-bottom: 4px;
    }

    .monthKpi-container-text {
        margin-left: 112px;
        color: #9EA7B3;
        font-size: 12px;
    }

    .monthKpi-container-count {
        color: #30B08F;
        font-size: 34px;
        position: absolute;
        left: 260px;
        top: 60px;
        b {
            padding-left: 10px;
            color: #9EA7B3;
            font-size: 12px;
        }
    }
</style>
