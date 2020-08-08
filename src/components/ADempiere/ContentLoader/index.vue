<script>
import VueContentLoading from 'vue-content-loading'

export default {
  name: 'ContentLoader',
  components: {
    VueContentLoading
  },
  props: {
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    }
  }
}
</script>

<template>
  <vue-content-loading :width="width" :height="height">
    <rect cx="50" cy="20" :width="width" :height="height" />
  </vue-content-loading>
</template>
