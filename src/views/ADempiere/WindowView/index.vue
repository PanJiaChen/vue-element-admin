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
  <div v-if="isLoaded" key="window-loaded" class="view-base">
    <el-container style="min-height: calc(100vh - 84px)">
      <el-aside width="100%">

        <!-- // TODO: Add header window component for auxiliary menu and worflow status -->

        <component
          :is="renderWindowComponent"
          :window-metadata="windowMetadata"
          :window-uuid="windowUuid"
        />
      </el-aside>
    </el-container>
  </div>

  <div
    v-else
    key="window-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import { generateWindow as generateWindowRespose } from './windowUtils'

export default defineComponent({
  name: 'WindowView',

  props: {
    // implement by test view
    uuid: {
      type: String,
      default: ''
    },
    metadata: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, { root }) {
    const panelType = 'window'
    const isLoaded = ref(false)
    const windowMetadata = ref({})

    let windowUuid = root.$route.meta.uuid
    // set uuid from test
    if (!root.isEmptyValue(props.uuid)) {
      windowUuid = props.uuid
    }

    const generateWindow = (window) => {
      windowMetadata.value = window
      isLoaded.value = true
    }

    const getterWindow = computed(() => {
      return root.$store.getters.getWindow(windowUuid)
    })

    // get window from vuex store or request from server
    const getWindow = () => {
      // metadata props use for test
      if (!root.isEmptyValue(props.metadata)) {
        return new Promise(resolve => {
          const windowResponse = generateWindowRespose(props.metadata)
          generateWindow(windowResponse)
          resolve(windowResponse)
        })
      }

      const window = getterWindow.value
      if (!root.isEmptyValue(window)) {
        generateWindow(window)
        return
      }

      root.$store.dispatch('getWindowFromServer', {
        windowUuid,
        routeToDelete: root.$route
      })
        .then(windowResponse => {
          generateWindow(windowResponse)
        })
    }

    const isDocumentTab = computed(() => {
      const panel = root.$store.getters.getPanel(windowMetadata.value.currentTabUuid)
      if (!root.isEmptyValue(panel)) {
        return panel.isDocument
      }

      return windowMetadata.value.firstTab.isDocument
    })

    const renderWindowComponent = computed(() => {
      let windowComponent = () => import('@/views/ADempiere/WindowView/StandardWindow')

      // documents have workflow
      if (isDocumentTab.value) {
        windowComponent = () => import('@/views/ADempiere/WindowView/DocumentWindow')
      }

      return windowComponent
    })

    // load metadata and generate window
    getWindow()

    return {
      panelType,
      windowUuid,
      windowMetadata,
      // computed
      getterWindow,
      renderWindowComponent,
      isLoaded
    }
  }
})
</script>
