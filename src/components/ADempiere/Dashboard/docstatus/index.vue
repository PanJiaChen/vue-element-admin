<template>
  <el-collapse v-model="activeDocuments" accordion>
    <el-collapse-item name="documents">
      <template slot="title">
        <i class="el-icon-document" style="margin-right: 4px;margin-left: 10px;" /> {{ $t('profile.PendingDocuments') }}
      </template>
      <el-card class="box-card" :body-style="{ padding: '0px' }" shadow="never">
        <div class="recent-items">
          <el-table :data="search.length ? filterResult(search) : documents" max-height="455" @row-click="handleClick">
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
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { getPendingDocumentsFromServer } from '@/api/ADempiere'
export default {
  name: 'PendingDocuments',
  data() {
    return {
      activeDocuments: 'documents',
      documents: [],
      search: ''
    }
  },
  computed: {
    cachedViews() {
      return this.$store.getters.cachedViews
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
    getPendingDocuments() {
      const userUuid = this.$store.getters['user/getUserUuid']
      const roleUuid = this.$store.getters.getRoleUuid
      return new Promise((resolve, reject) => {
        getPendingDocumentsFromServer(userUuid, roleUuid)
          .then(response => {
            const documentsList = response.getPendingdocumentsList().map(document => {
              return {
                formUuid: document.getFormuuid(),
                name: document.getDocumentname(),
                description: document.getDocumentdescription(),
                criteria: {
                  type: document.getCriteria().getConditionsList(),
                  limit: document.getCriteria().getLimit(),
                  orderbyclause: document.getCriteria().getOrderbyclause(),
                  orderbycolumnList: document.getCriteria().getOrderbycolumnList(),
                  query: document.getCriteria().getQuery(),
                  referenceUuid: document.getCriteria().getReferenceuuid(),
                  tableName: document.getCriteria().getTablename(),
                  valuesList: document.getCriteria().getValuesList(),
                  whereClause: document.getCriteria().getWhereclause()
                },
                recordCount: document.getRecordcount(),
                sequence: document.getSequence(),
                windowUuid: document.getWindowuuid()
              }
            })
            this.documents = documentsList
            resolve(documentsList)
          })
          .catch(error => {
            reject(error)
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
      this.$store.dispatch('getWindowByUuid', { routes: this.permissionRoutes, windowUuid: row.windowUuid })
      var windowRoute = this.$store.getters.getWindowRoute(row.windowUuid)
      this.$router.push({
        name: windowRoute.name,
        params: {
          ...row.criteria
        },
        query: {
          action: 'criteria'
        }
      })
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
