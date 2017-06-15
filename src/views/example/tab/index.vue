<template>
  <div class="tab-container">
    <el-tag type="primary">mounted times ：{{createdTimes}}</el-tag>
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <keep-alive>
          <tab-pane v-if='activeName==item.key' :type='item.key' @create='showCreatedTimes'></tab-pane>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import tabPane from './components/tabPane'

  export default {
    name: 'tabDemo',
    components: { tabPane },
    data() {
      return {
        tabMapOptions: [
          { label: '中国', key: 'CN' },
          { label: '美国', key: 'US' },
          { label: '日本', key: 'JP' },
          { label: '欧元区', key: 'EU' }
        ],
        activeName: 'CN',
        createdTimes: 0
      }
    },
    methods: {
      showCreatedTimes() {
        this.createdTimes = this.createdTimes + 1;
      }
    }
  }
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
