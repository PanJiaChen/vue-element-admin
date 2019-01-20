<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="执教班级" name="first">
        <complexTable :teacher-id="uid"/>
      </el-tab-pane>
      <el-tab-pane label="课程表" name="second">
        <scheduleTab :teacher-id="uid" :type="false" style="margin-top:-20px;"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './components/tabPane'
import complexTable from './components/complexTable'
import scheduleTab from '@/views/grade/scheduleTab'

export default {
  name: 'Tab',
  components: {
    tabPane,
    scheduleTab,
    complexTable
  },
  data() {
    return {
      classList: '',
      activeName: 'first',
      uid: this.$store.getters.user.uid,
      listQuery: {
        uid: this.$store.getters.user.uid
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 15px;
  }
</style>
