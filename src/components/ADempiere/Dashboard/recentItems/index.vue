<template>
  <el-card class="box-card" :body-style="{ padding: '0px' }" shadow="never">
    <div class="recent-items">
      <el-table :data="search.length ? filterResult(search) : recentItems" max-height="455" @row-click="handleClick">
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
            />
          </template>
          <template slot-scope="{row}">
            <span>{{ row.displayName }}</span>
            <el-tag class="action-tag">{{ $t(`views.${row.action}`) }}</el-tag>
            <br>
            <span class="time">{{ translateDate(row.updated) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import { getRecentItems as getRecentItemsFromServer } from '@/api/ADempiere'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils'
export default {
  name: 'RecentItems',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      recentItems: [],
      isLoaded: true,
      search: '',
      accentRegexp: /[\u0300-\u036f]/g
    }
  },
  computed: {
    getterRecentItems() {
      return this.$store.getters.getRecentItems
    },
    cachedViews() {
      return this.$store.getters.cachedViews
    }
  },
  mounted() {
    this.getRecentItems({ pageToken: undefined, pageSize: undefined })
    this.subscribeChanges()
  },
  methods: {
    checkOpened(uuid) {
      return this.cachedViews.includes(uuid)
    },
    getRecentItems({ pageToken, pageSize }) {
      return new Promise((resolve, reject) => {
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
    handleClick(row) {
      if (!this.isEmptyValue(row.uuidRecord)) {
        this.$router.push({ name: row.menuUuid, query: { action: row.uuidRecord, tabParent: 0 }})
      } else {
        this.$router.push({ name: row.menuUuid })
      }
    },
    subscribeChanges() {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.getRecentItems()
        }
      })
    },
    filterResult(search) {
      return this.recentItems.filter(item => this.ignoreAccent(item.displayName).toLowerCase().includes(this.ignoreAccent(search.toLowerCase())))
    },
    ignoreAccent(s) {
      if (!s) { return '' }
      return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    }
  }
}
</script>

<style scoped>
  .search_recent {
    width: 50%!important;
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
