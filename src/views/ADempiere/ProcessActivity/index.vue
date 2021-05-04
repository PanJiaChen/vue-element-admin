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
  <component
    :is="templateDevice"
  />
</template>

<script>
import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'MixinProcessActivity',
  data() {
    return {
      processActivity: [],
      recordCount: 0,
      pageToken: '',
      pageSize: 50
    }
  },
  computed: {
    // process local not sent
    getterAllInExecution() {
      return this.$store.getters.getAllInExecution
    },
    // process local and send with response
    getterAllFinishProcess() {
      return this.$store.getters.getAllFinishProcess
    },
    // session process from server
    getterAllSessionProcess() {
      return this.$store.getters.getAllSessionProcess
    },
    // all process
    getRunProcessAll() {
      var processAll = this.getterAllInExecution.concat(this.getterAllFinishProcess, this.getterAllSessionProcess)
      var processAllReturned = []

      processAll.forEach(element => {
        var processMetadataReturned = {}
        var infoMetadata = this.getProcessMetadata(element.processUuid)
        if (!infoMetadata) {
          infoMetadata = {}
        }
        Object.assign(processMetadataReturned, element, infoMetadata)
        processMetadataReturned.parametersList = element.parametersList
        var indexRepeat = processAllReturned.findIndex(item => item.instanceUuid === element.instanceUuid && !this.isEmptyValue(element.instanceUuid))
        if (indexRepeat > -1) {
          // update attributes in exists process to return
          // Object.assign(processAllReturned[indexRepeat], processMetadataReturned)
          var other = Object.assign(processMetadataReturned, processAllReturned[indexRepeat])
          processAllReturned[indexRepeat] = other
          return
        }

        // add new process to show
        processAllReturned.push(processMetadataReturned)
      })
      return processAllReturned.sort((a, b) => {
        // sort by date and reverse string to order by most recently
        return new Date(a.lastRun) - new Date(b.lastRun)
      }).reverse()
    },
    getProcessLog() {
      var log = this.getRunProcessAll.filter(element => {
        if (element.isError !== undefined && (element.isProcessing !== undefined)) {
          return element
        }
      })
      return log
    },
    language() {
      return this.$store.getters.language
    },
    permissionRoutes() {
      return this.$store.getters.permission_routes
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    templateDevice() {
      if (this.isMobile) {
        return () => import('@/views/ADempiere/ProcessActivity/modeMobile')
      }
      return () => import('@/views/ADempiere/ProcessActivity/modeDesktop')
    }
  },
  beforeMount() {
    this.$store.dispatch('getSessionProcessFromServer', {
      pageToken: this.pageToken,
      pageSize: this.pageSize
    })
      .then(response => {
        if (response.nextPageToken !== this.pageToken) {
          this.pageToken = response.nextPageToken
        }
      })
  },
  methods: {
    getProcessMetadata(uuid) {
      return this.$store.getters.getProcess(uuid)
    },
    handleCommand(activity) {
      if (activity.command === 'seeReport') {
        this.$router.push({
          name: 'Report Viewer',
          params: {
            processId: activity.processId,
            instanceUuid: activity.instanceUuid,
            fileName: activity.output.fileName
          }
        }, () => {})
      } else if (activity.command === 'zoomIn') {
        const viewSearch = recursiveTreeSearch({
          treeData: this.permissionRoutes,
          attributeValue: activity.uuid,
          attributeName: 'meta',
          secondAttribute: 'uuid',
          attributeChilds: 'children'
        })
        if (viewSearch) {
          this.$router.push({
            name: viewSearch.name,
            query: {
              ...this.$route.query,
              ...activity.parametersList
            }
          }, () => {})
        }
      }
    },
    checkStatus({ isError, isProcessing, isReport }) {
      const status = {
        text: this.$t('notifications.completed'),
        type: 'success',
        color: '#67C23A'
      }
      // if (isReport) {
      //   return status
      // }
      // is executing
      if (isProcessing) {
        status.text = this.$t('notifications.processing')
        status.type = 'info'
        status.color = '#909399'
        return status
      }
      if (isError) {
        status.text = this.$t('notifications.error')
        status.type = 'danger'
        status.color = '#F56C6C'
        return status
      }
      // is completed
      return status
    },
    generateTitle(title) {
      const hasKey = this.$te('table.ProcessActivity.' + title)
      if (hasKey) {
        // $t :this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = this.$t('table.ProcessActivity.' + title)
        return translatedTitle
      }
      return title
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    }
  }
}
</script>

<style scoped>
  a, a:focus, a:hover {
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    color: #409EFF;
  }
  .el-popover {
    position: absolute;
    background: #FFFFFF;
    overflow: auto;
    min-width: 84px;
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    padding: 12px;
    max-height: 174px;
    z-index: 2000;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    max-width: 600px;
    font-size: 14px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    word-break: break-all;
  }
  .loading-div {
    padding: 100px 100px;
    height: 100%;
  }
  .actions {
    float: right
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
</style>
<style>
  .popover-scroll {
    max-height: 200px !important;
  }
</style>
