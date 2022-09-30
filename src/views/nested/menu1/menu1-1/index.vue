<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 1-1" type="success">
      <router-view />
    </el-alert>
  </div>
</template>

<script>
export default {
  name: 'Menu11',
  created() {
    console.log('Menu-1-1 created')
  }
}

</script>
