<template>
  <div class="components-container" style='height:100vh'>
    <div class='chart-container'>
      <keyboard-chart height='100%' width='100%'></keyboard-chart>
    </div>
  </div>
</template>

<script>
import keyboardChart from '@/components/Charts/keyboard'

export default {
  components: { keyboardChart }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: 90%;
}
</style>

