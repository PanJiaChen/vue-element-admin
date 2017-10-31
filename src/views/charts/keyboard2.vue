<template>
  <div class="components-container" style='height:100vh'>
    <div class='chart-container'>
      <chart height='100%' width='100%'></chart>
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Charts/keyboard2'

export default {
  name: 'keyboardChart2',
  components: { Chart }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: 90%;
}
</style>

