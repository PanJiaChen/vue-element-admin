<template>
	<div :class="classes" @mousedown="onMouseDown"></div>
</template>

<script>
  export default {
    props: {
      split: {
        validator(value) {
          return ['vertical', 'horizontal'].indexOf(value) >= 0
        },
        required: true
      },
      onMouseDown: {
        type: Function,
        required: true
      }
    },
    data() {
      const classes = ['Resizer', this.split, 'className'];
      return {
        classes: classes.join(' ')
      }
    }
  }
</script>

<style scoped>
.Resizer {
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	background: #000;
	position: absolute;
	opacity: .2;
	z-index: 1;
	/*-moz-background-clip: padding;*/
	/*-webkit-background-clip: padding;*/
	/*background-clip: padding-box;*/
}
/*.Resizer:hover {*/
/*-webkit-transition: all 2s ease;*/
/*transition: all 2s ease;*/
/*}*/

.Resizer.horizontal {
	height: 11px;
	margin: -5px 0;
	border-top: 5px solid rgba(255, 255, 255, 0);
	border-bottom: 5px solid rgba(255, 255, 255, 0);
	cursor: row-resize;
	width: 100%;
}

.Resizer.horizontal:hover {
	border-top: 5px solid rgba(0, 0, 0, 0.5);
	border-bottom: 5px solid rgba(0, 0, 0, 0.5);
}

.Resizer.vertical {
	width: 11px;
	height: 100%;
	border-left: 5px solid rgba(255, 255, 255, 0);
	border-right: 5px solid rgba(255, 255, 255, 0);
	cursor: col-resize;
}

.Resizer.vertical:hover {
	border-left: 5px solid rgba(0, 0, 0, 0.5);
	border-right: 5px solid rgba(0, 0, 0, 0.5);
}
</style>
