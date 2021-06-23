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
      style="height: 30px;"
    >
      <context-menu
        :menu-parent-uuid="$route.meta.parentUuid"
        :container-uuid="processUuid"
        :panel-type="panelType"
        :is-report="processMetadata.isReport"
      />
    </el-header>

    <el-main>
      <el-card class="content-collapse">
        <title-and-help
          :name="processMetadata.name"
          :help="processMetadata.help"
        />

        <el-scrollbar wrap-class="scroll-child">
          <panel-definition
            :container-uuid="processUuid"
            :metadata="processMetadata"
            :panel-type="panelType"
          />
        </el-scrollbar>
      </el-card>
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
import { defineComponent, computed, ref } from '@vue/composition-api'

import ContextMenu from '@/components/ADempiere/ContextMenu'
import PanelDefinition from '@/components/ADempiere/PanelDefinition'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'

export default defineComponent({
  name: 'ProcessView',

  components: {
    PanelDefinition,
    ContextMenu,
    TitleAndHelp
  },

  props: {
    // implement by test view
    uuid: {
      type: String,
      default: ''
    }
  },

  setup(props, { root }) {
    const isLoadedMetadata = ref(false)
    const processMetadata = ref({})
    const panelType = 'process'

    let processUuid = root.$route.meta.uuid
    // set uuid from test
    if (!root.isEmptyValue(props.uuid)) {
      processUuid = props.uuid
    }

    const showContextMenu = computed(() => {
      return root.$store.state.settings.showContextMenu
    })

    const getterProcess = computed(() => {
      return root.$store.getters.getPanel(processUuid)
    })

    root.$store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    const getProcess = async() => {
      const process = getterProcess.value
      if (process) {
        processMetadata.value = process
        isLoadedMetadata.value = true
        return
      }

      root.$store.dispatch('getPanelAndFields', {
        containerUuid: processUuid,
        panelType,
        routeToDelete: root.$route
      }).then(processResponse => {
        processMetadata.value = processResponse
      }).finally(() => {
        isLoadedMetadata.value = true
      })
    }

    getProcess()

    return {
      processUuid,
      panelType,
      isLoadedMetadata,
      processMetadata,
      // computeds
      showContextMenu,
      getterProcess,
      // methods
      getProcess
    }
  }
})
</script>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    height: 100%;
  }
</style>
<style scoped >
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
</style>
