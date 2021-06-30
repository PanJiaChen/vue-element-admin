<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
import { getPendingDocumentsFromServer } from '@/api/ADempiere/dashboard/tasks'
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
        return this.filterResult(this.search, this.documents)
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
  .el-table {
    cursor: pointer;
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
