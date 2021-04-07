<template>
  <div class="drawer-container">
    <div>
      <el-form label-position="top" :inline="true">
        <el-form-item
          :label="$t('settings.theme')"
        >
          <theme-picker @change="themeChange" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.fixedHeader')"
        >
          <el-switch v-model="fixedHeader" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.tagsView')"
        >
          <el-switch v-model="tagsView" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.fixedHeader')"
        >
          <el-switch v-model="showNavar" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.showContextMenu')"
        >
          <el-switch v-model="showContextMenu" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.isShowTitle')"
        >
          <el-switch v-model="isShowTitleForm" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.isShowMenu')"
        >
          <el-switch v-model="showMenu" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.sidebarLogo')"
        >
          <el-switch v-model="sidebarLogo" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data() {
    return {
      activeName: '1'
    }
  },
  computed: {
    isShowTitleForm: {
      get() {
        return this.$store.getters.getIsShowTitleForm
      },
      set(val) {
        this.$store.commit('changeShowTitleForm', val)
      }
    },
    isShowJob() {
      return this.$store.getters.language === 'zh'
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    showNavar: {
      get() {
        return this.$store.state.settings.showNavar
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showNavar',
          value: val
        })
      }
    },
    showMenu: {
      get() {
        return this.$store.state.settings.showMenu
      },
      set(val) {
        this.$store.dispatch('app/toggleSideBar')
        this.$store.dispatch('settings/changeSetting', {
          key: 'showMenu',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    showContextMenu: {
      get() {
        return this.$store.state.settings.showContextMenu
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showContextMenu',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    },
    supportPinyinSearch: {
      get() {
        return this.$store.state.settings.supportPinyinSearch
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'supportPinyinSearch',
          value: val
        })
      }
    },
    lang() {
      return this.$store.getters.language
    }
  },
  methods: {
    changeDisplatedTitle() {
      this.$store.commit('changeShowTitleForm', !this.isShowTitleForm)
    },
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }

  .job-link{
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
