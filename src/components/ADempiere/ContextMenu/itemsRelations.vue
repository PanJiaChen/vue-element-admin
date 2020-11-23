<template>
  <!-- summary elememts view -->
  <el-submenu
    v-if="item.meta.type === 'summary'"
    key="is-summary"
    :index="item.meta.title"
    popper-append-to-body
  >
    <template slot="title">
      <svg-icon v-if="isMobile" icon-class="nested" />
      {{ item.meta.title }}
    </template>
    <el-scrollbar wrap-class="scroll-child">
      <el-menu-item
        v-for="(child, subKey) in getChilds(item)"
        :key="subKey"
        :index="child.meta.uuid"
      >
        {{ child.meta.title }}
      </el-menu-item>
    </el-scrollbar>
  </el-submenu>

  <!-- item menu views -->
  <el-menu-item
    v-else
    v-show="item.meta.uuid !== $route.meta.uuid"
    key="not-summary"
    :index="item.meta.uuid"
    @click="handleClick(item)"
  >
    <svg-icon v-if="isMobile" :icon-class="classIconMenuRight" />
    {{ item.meta.title }}
  </el-menu-item>
</template>

<script>
import { icon } from '@/components/ADempiere/ContextMenu/icon'

export default {
  name: 'ItemsContextMenu',
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
      iconMenu = icon.find(element => {
        return element.type === this.item.meta.type
      })
      return iconMenu.icon
    }
  },
  methods: {
    handleClick(item) {
      this.$router.push({
        name: item.name,
        query: {
          tabParent: 0
        }
      }, () => {})
    },
    getChilds(item) {
      if (!this.isEmptyValue(item.children)) {
        return item.children
      }
      if (item.meta && !this.isEmptyValue(item.meta.childs)) {
        return item.meta.childs
      }
      return []
    }
  }
}
</script>

<style>
	.scroll {
    max-height: 400px;
  }
</style>
