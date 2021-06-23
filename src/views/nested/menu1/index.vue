<template>
  <div style="padding:30px;">
    <el-input v-model="input" />
    <router-view />
  </div>
</template>
<script>

export default {
  name: 'Menu1',
  data() {
    return {
      input: 'Menu1'
    }
  }
}
</script>
