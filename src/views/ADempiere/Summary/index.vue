<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <div v-if="isIndex" key="sumary" class="app-container">
    <title-and-help
      :name="$route.meta.title"
      :help="$route.meta.description"
    />

    <el-row :gutter="10">
      <template v-if="!isEmptyValue(optionList.children)">
        <template v-for="(item, key) in optionList.children">
          <dropdown-menu
            v-if="$route.name !== item.name"
            :key="key"
            :items="item"
            :title="item.meta.title"
          />
        </template>
      </template>
      <template v-else>
        <template v-for="(item, key) in optionList">
          <dropdown-menu
            v-if="$route.name !== item.name"
            :key="key"
            :items="item"
            :title="item.meta.title"
          />
        </template>
      </template>
    </el-row>
  </div>
  <div v-else key="view">
    <router-view />
  </div>
</template>

<script>
import DropdownMenu from '@/components/ADempiere/DropdownMenu'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'

export default {
  name: 'SummaryView',
  components: {
    DropdownMenu,
    TitleAndHelp
  },
  data() {
    return {
      routes: this.$store.state.permission.addRoutes,
      parentUuid: this.$route.meta.parentUuid,
      optionList: []
    }
  },
  computed: {
    isIndex() {
      return this.$route.meta.isIndex
    }
  },
  beforeMount() {
    this.generateRoutesPool()
  },
  methods: {
    generateRoutesPool() {
      if (this.$route.meta && this.$route.meta.childs.length) {
        this.optionList = this.$route.meta.childs
      }
    }
  }
}
</script>

<style>
  .description {
    text-align: center;
    cursor: default;
  }
</style>
