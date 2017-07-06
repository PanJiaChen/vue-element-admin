<template>
	<div :class="classes">
		<slot></slot>
	</div>
</template>

<script>
	export default {
	  name: 'Pane',
	  data() {
	    const classes = ['Pane', this.$parent.split, 'className'];
    return {
	      classes: classes.join(' '),
	      percent: 50
    }
  }
	}
</script>

<style scoped>
.splitter-pane.vertical.splitter-paneL {
    position: absolute;
    left: 0px;
    height: 100%;
}

.splitter-pane.vertical.splitter-paneR {
    position: absolute;
    right: 0px;
    height: 100%;
}

.splitter-pane.horizontal.splitter-paneL {
    position: absolute;
    top: 0px;
    width: 100%;
}

.splitter-pane.horizontal.splitter-paneR {
    position: absolute;
    bottom: 0px;
    width: 100%;
}
</style>
