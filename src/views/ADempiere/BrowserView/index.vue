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
    v-if="isLoaded"
    key="browser-loaded"
    class="view-base"
    style="height: 86vh;"
  >
    <modal-dialog
      :parent-uuid="browserUuid"
      :container-uuid="browserUuid"
      :panel-type="panelType"
    />

    <el-header v-if="isShowContextMenu">
      <context-menu
        :menu-parent-uuid="$route.meta.parentUuid"
        :container-uuid="browserUuid"
        :panel-type="panelType"
      />

      <div class="center" style="width: 100%">
        <title-and-help
          :name="browserMetadata.name"
          :help="browserMetadata.help"
        />
      </div>
    </el-header>

    <el-main>
      <el-collapse
        v-model="openedCriteria"
        class="container-collasep-open"
      >
        <el-collapse-item :title="$t('views.searchCriteria')" name="opened-criteria">
          <panel-definition
            :container-uuid="browserUuid"
            :metadata="browserMetadata"
            :panel-type="panelType"
          />
        </el-collapse-item>
      </el-collapse>

      <!-- result of records in the table -->
      <default-table
        :container-uuid="browserUuid"
      />
    </el-main>
  </el-container>

  <div
    v-else
    key="browser-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

import ContextMenu from '@/components/ADempiere/ContextMenu'
import ModalDialog from '@/components/ADempiere/Dialog'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import PanelDefinition from '@/components/ADempiere/PanelDefinition'
import DefaultTable from '@/components/ADempiere/DefaultTable'

export default defineComponent({
  name: 'BrowserView',

  components: {
    ContextMenu,
    DefaultTable,
    ModalDialog,
    PanelDefinition,
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
    const panelType = 'browser'
    const isLoaded = ref(false)
    const browserMetadata = ref({})

    let browserUuid = root.$route.meta.uuid
    // set uuid from test
    if (!root.isEmptyValue(props.uuid)) {
      browserUuid = props.uuid
    }

    const browserDefinition = computed(() => {
      return root.$store.getters.getBrowser(browserUuid)
    })

    // by default enable context menu and title
    root.$store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    const isShowContextMenu = computed(() => {
      return root.$store.state.settings.showContextMenu
    })

    const isLoadedRecords = computed(() => {
      return root.$store.getters.getDataRecordAndSelection(browserUuid).isLoaded
    })

    const isReadyToSearch = computed(() => {
      // TODO: Add timer to await
      if (browserMetadata.value.awaitForValuesToQuery) {
        return false
      }
      return !root.$store.getters.isNotReadyForSubmit(browserUuid)
    })

    const openedCriteria = computed({
      get() {
        // by default criteria if closed
        const openCriteria = []
        const browser = browserDefinition.value
        if (!root.isEmptyValue(browser)) {
          if (browser.isShowedCriteria) {
            // open criteria
            openCriteria.push('opened-criteria')
          }
        }
        return openCriteria
      },
      set(value) {
        let showCriteria = false
        if (value.length) {
          showCriteria = true
        }

        root.$store.dispatch('changeBrowserAttribute', {
          containerUuid: browserUuid,
          attributeName: 'isShowedCriteria',
          attributeValue: showCriteria
        })
      }
    })

    const getBrowserDefinition = () => {
      const browser = browserDefinition.value
      if (browser) {
        browserMetadata.value = browser
        isLoaded.value = true
        defaultSearch()
        return
      }
      root.$store.dispatch('getPanelAndFields', {
        containerUuid: browserUuid,
        panelType,
        routeToDelete: root.$route
      })
        .then(browserResponse => {
          browserMetadata.value = browserResponse
          defaultSearch()
        })
        .finally(() => {
          isLoaded.value = true
        })
    }

    const defaultSearch = () => {
      if (isLoadedRecords.value) {
        // not research
        return
      }

      if (isReadyToSearch.value) {
        // first search by default
        root.$store.dispatch('getBrowserSearch', {
          containerUuid: browserUuid
        })
        return
      }

      // set default values into data
      root.$store.dispatch('setRecordSelection', {
        containerUuid: browserUuid,
        panelType
      })
    }

    getBrowserDefinition()

    return {
      isLoaded,
      browserUuid,
      browserMetadata,
      panelType,
      // computed
      openedCriteria,
      isShowContextMenu
    }
  }
})
</script>

<style>
/* removes the title link effect on collapse */
.el-collapse-item__header:hover {
  background-color: #fcfcfc;
}
</style>
<style scoped>
.el-main {
  padding-bottom: 0px;
  padding-top: 0px;
}

.el-header {
  height: 50px !important;
}

.center {
  text-align: center;
}
</style>
