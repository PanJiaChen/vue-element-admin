<template>
  <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @blur="blur"
      @change="change">
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')"/>
    </el-select>
  </div>
</template>

<script>
import path from 'path'
import i18n from '@/lang'

export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      options: [],
      routersArr: [],
      show: false
    }
  },
  computed: {
    routers() {
      return this.$store.getters.permission_routers
    },
    lang() {
      return this.$store.getters.language
    }
  },
  watch: {
    lang() {
      this.routersArr = this.generateRouters(this.routers)
    },
    routers() {
      this.routersArr = this.generateRouters(this.routers)
    }
  },
  mounted() {
    this.routersArr = this.generateRouters(this.routers)
  },
  methods: {
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect.focus()
      }
    },
    blur() {
      this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change(val) {
      this.$router.push(val.path)
      this.search = ''
    },
    generateRouters(routers, basePath = '/') {
      const res = []

      for (const router of routers) {
        if (router.hidden) { continue }

        const data = {
          path: path.resolve(basePath, router.path),
          meta: { ...router.meta }
        }

        if (router.meta && router.meta.title) {
          const i18ntitle = i18n.t(`route.${router.meta.title}`)
          data.title = i18ntitle
        }
        if (router.children) {
          const tempRouters = this.generateRouters(router.children, router.path)
          if (tempRouters.length >= 1) {
            data.children = tempRouters
          }
        }
        res.push(data)
      }
      return res
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.matchRouters(this.routersArr, query)
        console.log(this.options)
      } else {
        this.options = []
      }
    },
    matchRouters(routers, query = query.trim().toLowerCase(), preTitle = []) {
      let options = []
      routers.forEach(router => {
        const data = {
          path: router.path,
          title: router.title ? [...preTitle, router.title] : [...preTitle]
        }
        if (router.title && router.title.toLowerCase().includes(query)) {
          options.push(data)
        }
        if (router.children) {
          const tempTags = this.matchRouters(router.children, query, data.title)
          if (tempTags.length >= 1) {
            options = [...options, ...tempTags]
          }
        }
      })
      return options
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.3s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
