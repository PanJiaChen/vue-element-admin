<template>
  <i :class="iconName" :style="appendStyle" />
</template>

<script>
export default {
  name: 'ElIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    iconColor: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    iconName() {
      return `sub-el-icon el-icon-${this.iconClass}`
    },
    appendStyle() {
      if (this.iconColor) {
        return 'color: ' + this.iconColor + ';'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.sub-el-icon {
  width: 1em;
  height: 1em;
}
</style>
