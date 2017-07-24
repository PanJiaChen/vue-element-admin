<template>
	<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<sidebar class="sidebar-container"></sidebar>
		<div class="main-container">
			<navbar></navbar>
			<app-main></app-main>
		</div>
	</div>
</template>

<script>
  import { Navbar, Sidebar, AppMain } from 'views/layout';

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.app-wrapper {
		@include clearfix;
		position: relative;
		height: 100%;
		width: 100%;
		&.hideSidebar {
			.sidebar-container{
				width:56px;
			}
			.main-container {
				margin-left: 56px;
			}
			// .sidebar-wrapper {
			// 	transform: translate(-140px, 0);
			// 	.sidebar-container {
			// 		transform: translate(132px, 0);
			// 	}
			// 	&:hover {
			// 		transform: translate(0, 0);
			// 		.sidebar-container {
			// 			transform: translate(0, 0);
			// 		}
			// 	}
			// }

		}
		.sidebar-container {
			transition: all .28s ease-out;
			width: 180px;
			height: 1000px;
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			z-index: 1001;
			background: red;
		}
		.main-container {
			min-height: 100%;
			transition: all .28s ease-out;
			margin-left: 180px;
		}
	}
</style>
