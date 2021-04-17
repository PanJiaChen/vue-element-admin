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
  <div v-if="!isEmptyValue(getProcessLog)" key="with-process" class="app-container">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in getProcessLog"
        :key="index"
        :timestamp="translateDate(activity.lastRun)"
        placement="top"
        type="primary"
        size="large"
        :color="checkStatus(activity).color"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <span><b>{{ activity.name }}</b></span>
            <div class="actions">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ $t('components.contextMenuActions') }}<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="activity.isReport" :command="{ ...activity, command: 'seeReport' }">
                    {{ $t('views.seeReport') }}
                  </el-dropdown-item>
                  <el-dropdown-item :command="{ ...activity, command: 'zoomIn' }">
                    {{ $t('table.ProcessActivity.zoomIn') }}
                  </el-dropdown-item>
                  <!-- TODO: add more actions -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-form label-position="top">
            <el-form-item v-if="activity.description" :label="generateTitle('Description')">
              <span><b>{{ activity.description }}</b></span>
              <span v-if="activity.isReport">{{ activity.output.description }}</span>
            </el-form-item>
            <el-form-item :label="generateTitle('Status')">
              <!-- show only when it is error -->
              <el-popover
                v-if="activity.isError && !activity.summary && !activity.isReport"
                :key="index + 'is-error'"
                placement="right"
                width="700"
                trigger="hover"
              >
                <div>
                  {{ activity.message }}
                </div>
                <el-tag slot="reference" :type="checkStatus(activity).type">
                  {{ checkStatus(activity).text }}
                </el-tag>
              </el-popover>
              <!-- show only when bring logs -->
              <el-popover
                v-else-if="!isEmptyValue(activity.logsList) || !isEmptyValue(activity.summary)"
                :key="index + 'is-summary'"
                placement="right"
                width="500"
                trigger="hover"
              >
                <b>{{ $t('table.ProcessActivity.Logs') }}</b><br>
                <ul>
                  <li @click="handleCommand({ ...activity, command: 'zoomIn' })"> {{ activity.summary }} </li>
                  <el-scrollbar wrap-class="popover-scroll">
                    <li v-for="(logItem, key) in activity.logsList" :key="key" @click="zoomIn(activity)">
                      {{ logItem.log }}
                    </li>
                  </el-scrollbar>
                </ul>
                <el-tag slot="reference" :type="checkStatus(activity).type">
                  {{ checkStatus(activity).text }}
                </el-tag>
              </el-popover>
              <!-- show only when bring output -->
              <el-popover
                v-else-if="activity.isReport"
                :key="index + 'is-output'"
                placement="right"
                width="700"
                trigger="hover"
              >
                <div>
                  <span> {{ $t('table.ProcessActivity.Output') }} </span><br>
                  <span>{{ $t('table.ProcessActivity.Name') }}: {{ activity.output.name }}</span><br>
                  <span>{{ $t('table.ProcessActivity.Description') }}: {{ activity.output.description }}</span><br>
                  <span>{{ $t('table.ProcessActivity.FileName') }}: {{ activity.output.fileName }}</span><br>
                  <a type="text" :href="activity.url" :download="activity.download">
                    {{ $t('components.contextMenuDownload') }} <i class="el-icon-download" />
                  </a>
                </div>
                <el-tag slot="reference" :type="checkStatus(activity).type">
                  {{ checkStatus(activity).text }}
                </el-tag>
              </el-popover>
              <el-popover
                v-else
                :key="index + 'is-other'"
                placement="top-start"
                :title="$t('table.ProcessActivity.Logs')"
                width="200"
                trigger="hover"
                :content="activity.summary"
              >
                <el-tag slot="reference" :type="checkStatus(activity).type">
                  {{ checkStatus(activity).text }}
                </el-tag>
              </el-popover>
            </el-form-item>
          </el-form>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
  <div v-else key="without-process">
    <h1 class="text-center">{{ $t('views.noProcess') }}</h1>
  </div>
</template>

<script>
import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'ProcessActivity',
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
