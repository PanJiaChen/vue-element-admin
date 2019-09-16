<!-- <template>
	<div class="progress">
	 <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
	  <span>hhahahahahahah</span>
	</div>
</template>


<script>
    export default {
        
        data () {
            return {
                msg: 'Hey Nic Raboy'
            }
        }
    }
</script> -->

<template>
    <div class="vue-spinner">
      <Circle9></Circle9>
      <h1>Analyzing....</h1>
    </div>
</template>
 
<script>
  import Circle9 from 'vue-loading-spinner/src/components/Circle9'
  
  export default {
  	name: 'analyze',
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
