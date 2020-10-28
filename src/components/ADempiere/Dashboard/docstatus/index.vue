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
            >
              <svg-icon slot="prefix" icon-class="search" />
            </el-input>
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
import mixinDashboard from '@/components/ADempiere/Dashboard/mixinDashboard.js'

export default {
  name: 'PendingDocuments',
  mixins: [mixinDashboard],
  data() {
    return {
      documents: []
    }
  },
  computed: {
    dataResult() {
      if (this.search.length) {
        return this.filterResult(this.search)
      }
      return this.documents
    }
  },
  mounted() {
    this.getPendingDocuments()

    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
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
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'notifyDashboardRefresh') {
          this.getPendingDocuments()
        }
      })
    },
    handleClick(row) {
      const viewSearch = this.recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: row.windowUuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        let tabParent
        if (row.action === 'window') {
          tabParent = 0
        }

        this.$router.push({
          name: viewSearch.name,
          params: {
            ...row.criteria
          },
          query: {
            action: 'criteria',
            tabParent
          }
        }, () => {})
      } else {
        this.$message({
          type: 'error',
          message: this.$t('notifications.noRoleAccess')
        })
      }
      // conditions for the registration amount (operador: row.criteria.whereClause)
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
