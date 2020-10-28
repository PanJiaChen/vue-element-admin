<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link sidebar-logo-link-close" to="/">
        <el-tooltip placement="right">
          <div slot="content">{{ getRole.name }} | {{ getRole.clientName }}</div>
          <img v-if="logo" :src="logo" class="sidebar-logo">
          <h1 v-else class="sidebar-title">{{ title }} </h1>
        </el-tooltip>
      </router-link>
      <div v-else key="expand" class="sidebar-logo-link">
        <img v-if="logo" :src="logo" class="sidebar-logo" @click="dashboard()">
        <h1 class="sidebar-title" @click="dashboard()">{{ title }}</h1><br>
        <el-tooltip placement="right">
          <div slot="content">{{ getRole.name }} | {{ getRole.clientName }}</div>
          <p class="sidebar-sub-title" @click="profile()">
            {{ getRole.name }} | {{ getRole.clientName }}
          </p>
        </el-tooltip>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // title: 'Vue Element Admin',
      title: 'ADempiere Vue',
      // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
      logo: 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4?imageView2/1/w/80/h/80'
    }
  },
  computed: {
    getRole() {
      return this.$store.getters['user/getRole']
    }
  },
  methods: {
    profile() {
      this.$router.push({
        path: '/profile/index?'
      }, () => {})
    },
    dashboard() {
      this.$router.push({
        path: '/'
      }, () => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  // line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
      cursor: pointer;
    }

    & .sidebar-title {
      display: inline-block;
      cursor: pointer;
      margin: 0;
      color: #fff;
      font-weight: 600;
      // line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }

    & .sidebar-sub-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      // display: inline-block;
      cursor: pointer;
      margin: 0;
      color: #fff;
      font-size: 12px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
  & .sidebar-logo-link-close {
    line-height: 50px;
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
