<template>
  <div :style="labelStyle">
    <span>
      {{ label }}
    </span>
    <span v-if="isMandatory" :style="'color: #f34b4b'">*</span>
    <i class="el-icon-info" :style="iconStyle" />
  </div>
</template>

<script>
export default {
  props: {
    isMandatory: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    labelStyle() {
      let displayStyle
      this.isMobile ? displayStyle = 'display: flex;width: auto;' : 'display: block;'
      return displayStyle + ' margin-left: 3px;'
    },
    iconStyle() {
      if (this.isMobile) {
        return 'margin-left: 5px; margin-top: 7px;'
      }
      return 'margin-left: -5px; padding-bottom: 6px;'
    }
  }
}
</script>
<style scoped>
.el-icon-info {
    font-size: 11px;
    color: #008fd3;
}
</style>

