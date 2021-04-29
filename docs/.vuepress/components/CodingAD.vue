<template>
  <a
    href="https://coding.net/?utm_source=panjiachen"
    target="_blank"
    @click="clickCoding('readme')"
    style="display: block;"
  >
    <img src="https://adempiere-vue.gitee.io/gitee-cdn//72dd4d11-8958-4690-8adb-cfdd3a3a30cc.png">
  </a>
</template>

<script>
export default {
  methods: {
    clickCoding(tag) {
      ga('send', 'click', 'e.coding', 'Action', tag)
    }
  }
}
</script>
