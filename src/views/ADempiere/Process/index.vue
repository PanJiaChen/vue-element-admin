<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
            <title-and-help
              :name="processMetadata.name"
              :help="processMetadata.help"
            />

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
    class="view-loading"
  />
</template>

<script>
// When supporting the processes, smart browser and reports,
// the ContextMenu and sticky must be placed in the layout
import ContextMenu from '@/components/ADempiere/ContextMenu'
import MainPanel from '@/components/ADempiere/Panel'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'

export default {
  name: 'ProcessView',
  components: {
    MainPanel,
    ContextMenu,
    TitleAndHelp
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
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
</style>
