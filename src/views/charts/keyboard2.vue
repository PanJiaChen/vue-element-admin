<template>
  <div class="components-container" style='height:100vh'>
    <div class='chart-container'>
      <keyboard-chart2 id='apple' height='100%' width='100%'></keyboard-chart2>
    </div>
  </div>
</template>

<script>
  import keyboardChart2 from 'components/Charts/keyboard2';

  export default {
    components: { keyboardChart2 }
  };
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: 90%;
}
</style>

