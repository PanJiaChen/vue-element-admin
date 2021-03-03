<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <el-button
      v-if="isMenuMobile && isMobile"
      type="text"
      icon="el-icon-close"
      style="padding-top: 13px; color: #000000;font-size: 121%;font-weight: 615!important;"
      @click="isMenuOption()"
    />
    <breadcrumb v-show="!isMenuMobile || device!=='mobile'" id="breadcrumb-container" class="breadcrumb-container" :style="isMobile ? { width: '40%' } : { width: 'auto' } " />
    <div v-show="isMenuMobile && isMobile" style="display: inline-flex; float: right;">
      <search id="header-search" class="right-menu-item" style="padding-top: 10px;" />
      <badge style="padding-top: 6px;" />
    </div>
    <!--
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      -->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <badge />
        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <lang-select class="right-menu-item hover-effect" />

      </template>
      <el-button v-show="!isMenuMobile && isMobile" type="text" icon="el-icon-more" @click="isMenuOption()" />
      <el-popover
        placement="bottom"
        width="245"
        trigger="click"
      >
        <div>
          <profile-preview
            :user="user"
            :avatar="avatar"
          />
          <el-button type="text" style="float: left;" @click="handleClick">{{ $t('navbar.profile') }}</el-button>
          <el-button type="text" style="float: right;" @click="logout">{{ $t('navbar.logOut') }}</el-button>
        </div>
        <el-button slot="reference" type="text" style="padding-top: 0px;">
          <img :src="avatarResize" class="user-avatar">
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import ProfilePreview from '@/layout/components/ProfilePreview'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import Badge from '@/components/ADempiere/Badge'
import { getImagePath } from '@/utils/ADempiere/resource.js'

export default {
  components: {
    Breadcrumb,
    Badge,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ProfilePreview,
    Search
  },
  data() {
    return {
      user: {},
      isMenuMobile: false
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    avatarResize() {
      if (this.isEmptyValue(this.avatar)) {
        return 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4?imageView2/1/w/80/h/80'
      }

      const { uri } = getImagePath({
        file: this.avatar,
        width: 40,
        height: 40
      })

      return uri
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    isMenuOption() {
      this.isMenuMobile = !this.isMenuMobile
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push({
        path: '/login'
      }, () => {})
    },
    handleClick() {
      this.$router.push({
        name: 'Profile'
      }, () => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown {
  display: inline-block;
  position: relative;
  color: #606266;
  font-size: 14px;
  width: 50px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    display: flex;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
