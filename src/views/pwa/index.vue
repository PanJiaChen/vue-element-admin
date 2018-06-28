<template>
  <div class="app-container">
    <p>首先你先保证你的浏览器支持PWA,具体可以查看<el-tag style="margin-bottom:20px;"><a href="https://developer.mozilla.org/en-US/Apps/Progressive" target="_blank">MDN</a></el-tag></p>
    <p>在此以chrome67.0.3396.99（正式版本） （32 位）举例</p>
    <p>点击右上角自定义及控制(也就是打开设置那个按钮)</p>
    <p>你会发现有一个'安装VUE-ELEMENT-ADMIN...'</p>
    <p>如果你想卸载，请在浏览器地址栏输入chrome://apps，右击安装的PWA图标卸载</p>
    <p>建议在开发环境注释掉PWA相关文件</p>
  </div>
</template>

<script>
	/**
	 Auth: Lei.j1ang
	 Created: 2018/6/26-18:33
	 */
	export default {
	  name: 'pwa'
	}
</script>

<style scoped>

</style>
