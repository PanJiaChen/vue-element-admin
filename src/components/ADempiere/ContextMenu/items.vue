<template>
  <el-menu-item
    v-if="item.meta.type !== 'summary'"
    v-show="item.meta.uuid!==$route.meta.uuid"
    :index="item.meta.uuid"
    @click="handleClick(item)"
  >
    <svg-icon v-if="isMobile" :icon-class="classIconMenuRight" /> {{ item.meta.title }}
  </el-menu-item>
  <el-submenu v-else :index="item.meta.title" popper-append-to-body>
    <template slot="title">
      <svg-icon v-if="isMobile" icon-class="nested" /> {{ item.meta.title }}
    </template>
    <item v-for="(child, key) in item.children" :key="key" :item="child">
      {{ child.meta.title }}
    </item>
  </el-submenu>
</template>

<script>
import { icon } from '@/components/ADempiere/ContextMenu/icon'

export default {
  name: 'Item',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    classIconMenuRight(iconMenu) {
      var typeMenu = this.item.meta.type
      iconMenu = icon.find(function(element) {
        return element.type === typeMenu
      })
      return iconMenu.icon
    }
  },
  methods: {
    handleClick(item) {
      this.$router.push({ name: item.name, query: { tabParent: 0 }})
    }
  }
}
</script>

<style>
	.scroll {
    max-height: 400px;
  }
</style>
