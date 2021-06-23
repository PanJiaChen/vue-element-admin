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
  <div v-if="isLoaded" key="window-loaded">
    <context-menu
      :menu-parent-uuid="$route.meta.parentUuid"
      :parent-uuid="windowUuid"
      :container-uuid="windowMetadata.currentTabUuid"
      :table-name="windowMetadata.currentTab.tableName"
      :panel-type="panelType"
      :is-insert-record="windowMetadata.currentTab.isInsertRecord"
    />

    <component
      :is="renderWindowComponent"
      :window-metadata="windowMetadata"
      :window-uuid="windowUuid"
    />
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

import ContextMenu from '@/components/ADempiere/ContextMenu'

export default defineComponent({
  name: 'WindowView',

  components: {
    ContextMenu
  },

  setup(props, { root }) {
    const panelType = 'window'
    const windowUuid = root.$route.meta.uuid
    const isLoaded = ref(false)
    const windowMetadata = ref({})

    const generateWindow = (window) => {
      windowMetadata.value = window
      isLoaded.value = true
    }

    const getterWindow = computed(() => {
      return root.$store.getters.getWindow(windowUuid)
    })

    // get window from vuex store or request from server
    const getWindow = () => {
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
      getterWindow,
      renderWindowComponent,
      isLoaded
    }
  }
})
</script>
