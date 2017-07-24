<template>
<div>
	<el-menu mode="vertical" theme="dark" :default-active="$route.path" :collapse="isCollapse">
		 <sidebar-item :routes='permission_routers'></sidebar-item>
	</el-menu>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import SidebarItem from './SidebarItem';
  export default {
    components: { SidebarItem },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.el-menu {
			min-height: 100%;
	}
</style>
