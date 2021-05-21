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
  <el-col
    v-if="!isEmptyValue(items.children)"
    key="is-desktop-dropdown"
    :span="24"
  >
    <el-collapse v-model="activeNames" class="collapse-wrapper">
      <el-collapse-item :title="title" name="1" class="collapse-item">
        <el-row justify="space-around">
          <template v-for="(childItems, index) in items.children">
            <el-col :key="index" :span="isMobile">
              <menu-card :items="childItems" size="small" />
            </el-col>
          </template>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-col>
  <el-col v-else key="is-mobile-dropdown" :span="isMobile" class="column">
    <menu-card :items="items" size="medium" />
  </el-col>
</template>

<script>
import menuCard from './menuCard.vue'
export default {
  name: 'DropdownMenu',
  components: { menuCard },
  props: {
    items: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeNames: ['1']
    }
  },
  computed: {
    device() {
      return this.$store.state.app.device
    },
    isMobile() {
      if (this.device === 'mobile') {
        return 24
      }
      return 8
    }
  }
}
</script>

<style lang="scss">

.collapse-item {
  .el-collapse-item__header {
    height: 60px;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    margin-left: 16px;
  }
}
.collapse-wrapper {
  margin: 20px 0 30px 0;
}
</style>
