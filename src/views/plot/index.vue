<template>
  <!-- <div class="vue-spinner">
    <Circle9 />
    <h1>Analyzing....</h1>
  </div> -->
    <iframe src="http://localhost:808" width=1300 height=600></iframe>
</template>

<script>
import Circle9 from 'vue-loading-spinner/src/components/Circle9'
export default {
  name: 'plot',
  components: {
    Circle9
  }
}
</script>

<style scoped>
	.vue-spinner{
		margin: 100px;
		width: 50%;
		height: 50%;
		/*overflow: hidden;*/
	}
</style>
