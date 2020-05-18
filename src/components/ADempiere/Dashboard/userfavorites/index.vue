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
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              :metadata="scope"
              :placeholder="$t('table.dataTable.search')"
            />
          </template>
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
            <el-tag size="mini" class="action-tag">
              {{ $t(`views.${row.action}`) }}
            </el-tag>
            <br>
            <el-button-group class="actions-buttons">
              <el-tooltip :content="$t('quickAccess.newRecord')" placement="top">
                <el-button v-if="row.action === 'window'" size="mini" circle @click.stop="windowAction(row, 'create-new')"><i class="el-icon-circle-plus-outline" /></el-button>
              </el-tooltip>
              <el-tooltip :content="$t('quickAccess.listRecords')" placement="top">
                <el-button v-if="row.action === 'window'" size="mini" circle @click.stop="windowAction(row, 'listRecords')"><i class="el-icon-search" /></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import { getFavoritesFromServer } from '@/api/ADempiere/dashboard/dashboard'
import { convertAction } from '@/utils/ADempiere/dictionaryUtils'
import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

export default {
  name: 'Favorites',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      favorites: [],
      unsubscribe: () => {},
      isLoaded: true,
      search: '',
      accentRegexp: /[\u0300-\u036f]/g
    }
  },
  computed: {
    cachedViews() {
      return this.$store.getters.cachedViews
    },
    dataResult() {
      if (this.search.length) {
        return this.filterResult(this.search)
      }
      return this.favorites
    },
    permissionRoutes() {
      return this.$store.getters.permission_routes
    }
  },
  mounted() {
    this.getFavoritesList()

    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    showMessage,
    getFavoritesList() {
      const userUuid = this.$store.getters['user/getUserUuid']
      return new Promise(resolve => {
        getFavoritesFromServer({ userUuid })
          .then(response => {
            const favorites = response.favoritesList.map(favoriteElement => {
              const actionConverted = convertAction(favoriteElement.action)
              return {
                ...favoriteElement,
                uuid: favoriteElement.menuUuid,
                name: favoriteElement.menuName,
                description: favoriteElement.menuDescription,
                action: actionConverted.name,
                icon: actionConverted.icon
              }
            })
            this.favorites = favorites
            resolve(favorites)
          })
          .catch(error => {
            console.warn(`Error getting favorites: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.getFavoritesList()
        }
      })
    },
    handleClick(row) {
      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: row.referenceUuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        let recordUuid
        if (!this.isEmptyValue(row.uuidRecord)) {
          recordUuid = row.uuidRecord
        }
        let tabParent
        if (row.action === 'window') {
          tabParent = 0
        }

        this.$router.push({
          name: viewSearch.name,
          query: {
            action: recordUuid,
            tabParent
          }
        })
      } else {
        this.showMessage({
          type: 'error',
          message: this.$t('notifications.noRoleAccess')
        })
      }
    },
    filterResult(search) {
      return this.favorites.filter(item => this.ignoreAccent(item.name).toLowerCase().includes(this.ignoreAccent(search.toLowerCase())))
    },
    ignoreAccent(s) {
      if (!s) { return '' }
      return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    },
    windowAction(row, param) {
      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: row.referenceUuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        this.$router.push({
          name: viewSearch.name,
          query: {
            action: param,
            tabParent: 0
          }
        })
      } else {
        this.showMessage({
          type: 'error',
          message: this.$t('notifications.noRoleAccess')
        })
      }
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
  .actions-buttons {
    float: right;
  }
</style>
