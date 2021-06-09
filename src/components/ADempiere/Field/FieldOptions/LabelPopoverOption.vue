<template>
  <div :style="textStyle">
    <i v-if="!option.svg" :class="option.icon" style="font-weight: bolder;" />
    <svg-icon v-else :icon-class="option.icon" :style="iconWrapperStyle" />
    <span>
      <b class="label">
        {{ option.name }}
      </b>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconWrapperStyle() {
      if (this.isMobile) {
        return { 'margin-right': '6px' }
      }
      return {
        'margin-left': '5px',
        'margin-right': '13px'
      }
    },
    textStyle() {
      if (!this.isMobile) {
        return ''
      }
      return { 'font-size': '130%', 'margin': '7px' }
    }
  }
}
</script>

<style >
.svg-icon-wrapper {
    margin-left: 5px;
    margin-right: 13px;
}
</style>
