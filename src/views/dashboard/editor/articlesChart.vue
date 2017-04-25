<template>
    <div class="articlesChart-container">
        <span class="articlesChart-container-title">每天撸文</span>
        <line-chart :listData='listData' ></line-chart>
    </div>
</template>
<script>
    import LineChart from 'components/Charts/line';
    export default {
      name: 'articlesChart',
      components: { LineChart },
      props: {
        listData: {
          type: Array,
          default: [],
          require: true
        }
      },
      data() {
        return {}
      }
    }
</script>
<style>
    .articlesChart-container {
        width: 100%;
    }
    .articlesChart-container-title {
        color: #7F8C8D;
        font-size: 16px;
        display: inline-block;
        margin-top: 10px;
    }
</style>
