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
import { getRecentItems as getRecentItemsFromServer } from '@/api/ADempiere/dashboard/dashboard'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils'
import mixinDashboard from '@/components/ADempiere/Dashboard/mixinDashboard.js'

export default {
  name: 'RecentItems',
  mixins: [mixinDashboard],
  data() {
    return {
      recentItems: [],
      isLoaded: true
    }
  },
  computed: {
    dataResult() {
      if (this.search.length) {
        return this.filterResult(this.search)
      }
      return this.recentItems
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
        getRecentItemsFromServer({ pageToken, pageSize })
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
