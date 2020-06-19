<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <template v-if="levelList.length > 3">
        <el-breadcrumb-item key="0">
          <span v-if="firstItem.redirect==='noRedirect'" class="no-redirect">
            {{ generateTitle(firstItem.meta.title) }}
          </span>
          <a v-else @click.prevent="handleLink(firstItem)">
            {{ generateTitle(firstItem.meta.title) }}
          </a>
        </el-breadcrumb-item>
        <el-breadcrumb-item key="1">
          <el-popover placement="bottom" trigger="hover" class="breadcrumb-popover">
            <el-dropdown-item v-for="(item, index) in dropdownList" :key="index" @click.native="handleLink(item)">
              {{ generateTitle(item.meta.title) }}
            </el-dropdown-item>
            <i slot="reference" class="el-icon-more" />
          </el-popover>
        </el-breadcrumb-item>
        <el-breadcrumb-item key="2">
          <span v-if="lastItem.redirect==='noRedirect'" class="no-redirect">
            {{ generateTitle(lastItem.meta.title) }}
          </span>
          <a v-else @click.prevent="handleLink(lastItem)">
            {{ generateTitle(lastItem.meta.title) }}
          </a>
        </el-breadcrumb-item>
      </template>
      <el-breadcrumb-item v-for="(item,index) in levelList" v-else :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">
          {{ generateTitle(item.meta.title) }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null,
      dropdownList: null,
      firstItem: null,
      lastItem: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', name: 'Dashboard', meta: { title: 'dashboard' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
      if (this.levelList.length > 3) {
        this.dropdownList = [...this.levelList]
        this.lastItem = this.dropdownList.pop()
        this.firstItem = this.dropdownList.shift()
      }
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      if (this.$route.name !== item.name) {
        this.$router.push({ name: item.name, params: { childs: item.meta.childs }})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
  .breadcrumb-popover {
    cursor: pointer;
    .el-icon-more {
      transform: none;
    }
  }
}
</style>
