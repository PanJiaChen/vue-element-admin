<template>
  <div class="qa-text">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'QaText',
  props: {
    text: {
      type: String,
      default: '用来输入文字'
    }
  },
  data() {
    return {
      defaultStyle: {
        height: 40
      }
    }
  }
}
</script>

<style lang="scss">

</style>
