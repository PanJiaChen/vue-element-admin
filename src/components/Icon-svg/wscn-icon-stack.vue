<template>
  <div class="icon-container" :style="containerStyle">
    <slot class="icon"></slot>
  </div>
</template>

<script>
  export default {
    name: 'wscn-icon-stack',
    props: {
      width: {
        type: Number,
        default: 20
      },
      shape: {
        type: String,
        default: 'circle',
        validator: val => {
          const validShapes = ['circle', 'square']
          return validShapes.indexOf(val) > -1
        }
      }
    },
    computed: {
      containerStyle() {
        return {
          width: `${this.width}px`,
          height: `${this.width}px`,
          fontSize: `${this.width * 0.6}px`,
          borderRadius: `${this.shape === 'circle' && '50%'}`
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon-container {
    display: inline-block;
    position: relative;
    overflow: hidden;
    background: #1482F0;

    .icon {
      position: absolute;
      color: #ffffff;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
