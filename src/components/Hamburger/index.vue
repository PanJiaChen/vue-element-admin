<template>
  <div style="padding: 0 15px" @click="toggleClick">
    <i class="el-icon-arrow-left hamburger" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  background: #1f71bc;
  color: white;
  font: normal normal normal 12px/14px FontAwesome;
  border-radius: 4px 0px 0px 4px;
  width: 18px;
  height: 45px;
  padding: 13px 3px;
  position: absolute;
  bottom: 90px;
  right: 0;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
