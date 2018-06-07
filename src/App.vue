<template>
  <div id="app">
    <el-scrollbar class="pagescrollbar">
      <router-view></router-view>
    </el-scrollbar>
  </div>
</template>

<script>
  export default{
    name: 'App'
  }
</script>
