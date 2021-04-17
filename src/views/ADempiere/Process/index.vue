<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
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
  <el-container
    v-if="isLoadedMetadata"
    key="process-loaded"
    class="view-base"
    style="height: 84vh;"
  >
    <el-header
      v-if="showContextMenu"
      style="height: 39px;"
    >
      <context-menu
        :menu-parent-uuid="$route.meta.parentUuid"
        :container-uuid="processUuid"
        :panel-type="panelType"
        :is-report="processMetadata.isReport"
      />
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="content-collapse">
            <h3 v-show="!isEmptyValue(processTitle)" class="warn-content text-center">
              <el-popover
                v-if="!isEmptyValue(processMetadata.help)"
                ref="helpTitle"
                placement="top-start"
                :title="processTitle"
                width="400"
                trigger="hover"
              >
                <div v-html="processMetadata.help" />
              </el-popover>
              <el-button
                v-popover:helpTitle
                type="text"
                class="title text-center"
              >
                {{ processMetadata.name }}
              </el-button>
            </h3>
            <main-panel
              :position-tab="processMetadata.accesLevel"
              :container-uuid="processUuid"
              :metadata="processMetadata"
              :is-edit="isEdit"
              :panel-type="panelType"
            />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <div
    v-else
    key="process-loading"
    v-loading="!isLoadedMetadata"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="loading-process"
  />
</template>

<script>
// When supporting the processes, smart browser and reports,
// the ContextMenu and sticky must be placed in the layout
import ContextMenu from '@/components/ADempiere/ContextMenu'
import MainPanel from '@/components/ADempiere/Panel'

export default {
  name: 'ProcessView',
  components: {
    MainPanel,
    ContextMenu
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      processMetadata: {},
      processUuid: this.$route.meta.uuid,
      isLoadedMetadata: false,
      panelType: 'process'
    }
  },
  computed: {
    showContextMenu() {
      return this.$store.state.settings.showContextMenu
    },
    getterProcess() {
      return this.$store.getters.getPanel(this.processUuid)
    },
    processTitle() {
      return this.processMetadata.name || this.$route.meta.title
    }
  },
  created() {
    this.getProcess()
    this.$store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })
  },
  methods: {
    getProcess() {
      const process = this.getterProcess
      if (process) {
        this.processMetadata = process
        this.isLoadedMetadata = true
      } else {
        this.$store.dispatch('getPanelAndFields', {
          containerUuid: this.processUuid,
          panelType: this.panelType,
          routeToDelete: this.$route
        }).then(processResponse => {
          this.processMetadata = processResponse
        }).finally(() => {
          this.isLoadedMetadata = true
        })
      }
    }
  }
}
</script>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
  }
</style>
<style scoped >
  .view-base {
    height: 100%;
    min-height: calc(100vh - 84px);
  }

  .loading-process {
    padding: 100px 100px;
    height: 100%;
  }

  .title {
    color: #000000;
    text-size-adjust: 20px;
    font-size: 100%;
    font-weight: 605!important;
  }
  .warn-content {
    margin: 0px 0px !important;
    padding-top: 0px !important;
  }
  .content-help {
    width: 100%;
    height: 100%;
    padding-left: 39px !important;
  }
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
  .sticky-submenu {
    position: absolute !important;
    right: 0;
    top: 0;
  }
  .content-collapse {
    padding-left: 20 px !important;
    padding-top: 50 px !important;
  }
</style>
