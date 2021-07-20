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
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <el-tooltip :content="$t('route.guide')" placement="top-start">
          <el-button icon="el-icon-info" type="text" style="color: black;font-size: larger" @click.prevent.stop="guide" />
        </el-tooltip>
        <search id="header-search" class="right-menu-item" />
        <badge id="badge-navar" />
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
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css

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
      isMenuMobile: false,
      driver: null
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isShowedPOSKeyLaout() {
      return this.$store.getters.getShowPOSKeyLayout
    },
    showCollection() {
      return this.$store.getters.getShowCollectionPos
    },
    showGuide() {
      const typeViews = this.$route.meta.type
      if (!this.isEmptyValue(typeViews) && typeViews !== 'window') {
        return true
      }
      return false
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
    },
    fieldPanel() {
      return this.$store.getters.getFieldsListFromPanel(this.$route.meta.uuid).filter(field => field.isShowedFromUser)
    },
    fieldWindow() {
      const windowUuid = this.$store.getters.getWindow(this.$route.meta.uuid).currentTab.uuid
      const list = this.$store.getters.getFieldsListFromPanel(windowUuid)
      if (!this.isEmptyValue(list)) {
        return list.filter(field => field.isShowedFromUserDefault)
      }
      return []
    },
    getForm() {
      return this.$store.getters.getForm(this.$route.meta.uuid)
    },
    formSteps() {
      let form
      switch (this.getForm.fileName) {
        case 'WFActivity':
          form = require('@/components/ADempiere/Form/WorkflowActivity/Guide/steps')
          break
        case 'VPOS':
          form = require('@/components/ADempiere/Form/VPOS/Guide/steps')
          break
        default:
          form = {
            default: []
          }
          break
      }
      return form.default
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      const value = this.formatGuide(this.$route.meta.type)
      this.driver.defineSteps(value)
      this.driver.start()
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
    },
    formatGuide(type) {
      let field
      switch (type) {
        case 'report':
          field = this.fieldPanel.map(steps => {
            return {
              element: '#' + steps.columnName,
              popover: {
                title: steps.name,
                description: steps.description,
                position: 'top'
              }
            }
          })
          break
        case 'process':
          field = this.fieldPanel.map(steps => {
            return {
              element: '#' + steps.columnName,
              popover: {
                title: steps.name,
                description: steps.description,
                position: 'top'
              }
            }
          })
          break
        case 'window':
          field = this.fieldWindow.map(steps => {
            return {
              element: '#' + steps.columnName,
              popover: {
                title: steps.name,
                description: steps.description,
                position: 'top'
              }
            }
          })
          break
        case 'form':
          field = this.formSteps
          break
      }
      return field
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
