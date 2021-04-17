<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
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
