<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Leonel Matos lmatos@erpya.com www.erpya.com
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
  <el-card class="box-card" :body-style="{ padding: '0px' }" shadow="never">
    <div class="recent-items">
      <el-table :data="dataResult" max-height="455" @row-click="handleClick">
        <el-table-column width="40">
          <template slot-scope="{row}">
            <svg-icon :icon-class="row.icon" class="icon-window" />
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope" class="clearfix">
            <el-input
              v-model="search"
              size="mini"
              :metadata="scope"
              :placeholder="$t('table.dataTable.search')"
            >
              <svg-icon slot="prefix" icon-class="search" />
            </el-input>
          </template>
          <template slot-scope="{row}">
            <span>{{ row.displayName }}</span>
            <el-tag class="action-tag">
              {{ $t(`views.${row.action}`) }}
            </el-tag>
            <br>
            <span class="time">
              {{ translateDate(row.updated) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import { requestListRecentItems } from '@/api/ADempiere/dashboard/user'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils'
import mixinDashboard from '@/components/ADempiere/Dashboard/mixinDashboard.js'

export default {
  name: 'RecentItems',
  mixins: [
    mixinDashboard
  ],
  data() {
    return {
      recentItems: [],
      isLoaded: true
    }
  },
  computed: {
    dataResult() {
      if (this.search.length) {
        return this.filterResult(this.search, this.recentItems)
      }
      return this.recentItems
    },
    userUuid() {
      return this.$store.getters['user/getUserUuid']
    },
    roleUuid() {
      return this.$store.getters['user/getRole'].uuid
    }
  },
  mounted() {
    this.getRecentItems({})

    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    getRecentItems({ pageToken, pageSize }) {
      return new Promise(resolve => {
        requestListRecentItems({
          userUuid: this.userUuid,
          roleUuid: this.roleUuid,
          pageToken,
          pageSize
        })
          .then(response => {
            const recentItems = response.recentItemsList.map(item => {
              const actionConverted = convertAction(item.action)

              return {
                ...item,
                action: actionConverted.name,
                icon: actionConverted.icon,
                uuidRecord: item.recordUuid,
                updated: new Date(item.updated),
                uuid: item.menuUuid,
                name: item.menuName,
                description: item.menuDescription
              }
            })
            this.recentItems = recentItems
            this.isLoaded = false
            resolve(recentItems)
          })
          .catch(error => {
            console.warn(`Error getting recent items: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.getRecentItems()
        }
      })
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    }
  }
}
</script>

<style scoped>
  .el-table {
    background-color: #FFFFFF;
  }
  .search_recent {
    width: 50% !important;
    float: right;
  }
  .header {
    padding-bottom: 10px;
  }
  .recent-items {
    height: 455px;
    overflow: auto;
  }
  .time {
    float: left;
    font-size: 11px;
    color: #999;
  }
  .card-box {
    cursor: pointer;
  }
  .card-content {
    font-size: 15px;
  }
  .icon-window {
    font-size: x-large;
    color: #36a3f7;
  }
  .action-tag {
    float: right;
  }
</style>
<style>
  .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
  }
</style>
