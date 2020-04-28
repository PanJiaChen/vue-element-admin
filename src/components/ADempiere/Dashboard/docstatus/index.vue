<template>
  <el-card class="box-card" :body-style="{ padding: '0px' }" shadow="never">
    <div class="recent-items">
      <el-table :data="dataResult" max-height="455" @row-click="handleClick">
        <el-table-column
          prop="recordCount"
          width="60"
        />
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
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import { getPendingDocumentsFromServer } from '@/api/ADempiere/dashboard/dashboard'
import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

export default {
  name: 'PendingDocuments',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      documents: [],
      search: ''
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
      return this.documents
    },
    permissionRoutes() {
      return this.$store.getters.permission_routes
    }
  },
  mounted() {
    this.getPendingDocuments()
    this.subscribeChanges()
  },
  methods: {
    showMessage,
    getPendingDocuments() {
      const userUuid = this.$store.getters['user/getUserUuid']
      const roleUuid = this.$store.getters.getRoleUuid
      return new Promise(resolve => {
        getPendingDocumentsFromServer({ userUuid, roleUuid })
          .then(response => {
            const documentsList = response.pendingDocumentsList.map(documentItem => {
              return {
                ...documentItem,
                name: documentItem.documentName,
                description: documentItem.documentDescription
              }
            })
            this.documents = documentsList
            resolve(documentsList)
          })
          .catch(error => {
            console.warn(`Error getting pending documents: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    subscribeChanges() {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.getPendingDocuments()
        }
      })
    },
    handleClick(row) {
      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: row.windowUuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })
      if (viewSearch) {
        this.$router.push({
          name: viewSearch.name,
          params: {
            ...row.criteria
          },
          query: {
            action: 'criteria'
          }
        })
      } else {
        this.showMessage({
          type: 'error',
          message: this.$t('notifications.noRoleAccess')
        })
      }
      // conditions for the registration amount (operador: row.criteria.whereClause)
    },
    filterResult(search) {
      return this.documents.filter(item => this.ignoreAccent(item.name).toLowerCase().includes(this.ignoreAccent(search.toLowerCase())))
    },
    ignoreAccent(s) {
      if (!s) { return '' }
      return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
