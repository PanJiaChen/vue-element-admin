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
  <el-tabs
    v-model="currentTab"
    type="border-card"
    @tab-click="handleClick"
  >
    <template v-for="(tabAttributes, key) in tabsList">
      <el-tab-pane
        :key="key"
        :label="tabAttributes.name"
        :windowuuid="windowUuid"
        :tabuuid="tabAttributes.uuid"
        :name="String(key)"
        :tabindex="String(key)"
        lazy
        :disabled="isDisabledTab(key)"
        :style="tabStyle"
      >
        <lock-record
          slot="label"
          :tab-position="key"
          :tab-uuid="tabAttributes.uuid"
          :table-name="tabAttributes.tableName"
          :tab-name="tabAttributes.name"
        />

        <panel-definition
          :parent-uuid="windowUuid"
          :container-uuid="tabAttributes.uuid"
          :panel-metadata="tabAttributes"
          :group-tab="tabAttributes.tabGroup"
        />
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import PanelDefinition from '@/components/ADempiere/PanelDefinition'
import LockRecord from '@/components/ADempiere/ContainerOptions/LockRecord'

export default defineComponent({
  name: 'TabManager',

  components: {
    PanelDefinition,
    LockRecord
  },

  props: {
    windowUuid: {
      type: String,
      default: ''
    },
    windowMetadata: {
      type: Object,
      default: () => {}
    },
    tabsList: {
      type: Array,
      default: () => []
    }
  },

  setup(props, { root }) {
    // if tabParent is present in path set this
    const tabNo = root.$route.query.tab || '0'
    const currentTab = ref(tabNo)

    const tabUuid = ref(props.tabsList[0].uuid)

    const tabStyle = computed(() => {
      return {
        height: '75vh',
        overflow: 'auto'
      }
    })

    const isCreateNew = computed(() => {
      return Boolean(root.$route.query.action === 'create-new')
    })

    const isDisabledTab = (key) => {
      return key > 0 && isCreateNew.value
    }

    const setCurrentTab = () => {
      root.$store.dispatch('setCurrentTab', {
        parentUuid: props.windowUuid,
        containerUuid: tabUuid.value,
        window: props.windowMetadata
      })
    }

    /**
     * @param {object} tabHTML DOM HTML the tab clicked
     */
    const handleClick = (tabHTML) => {
      const { tabuuid, tabindex } = tabHTML.$attrs
      if (tabUuid.value !== tabuuid) {
        tabUuid.value = tabuuid
        setCurrentTab()
      }
      if (currentTab.value !== tabindex) {
        setTabNumber(tabindex)
      }
    }

    const setTabNumber = (tabNumber = '0') => {
      if (root.isEmptyValue(tabNumber)) {
        tabNumber = '0'
      }
      if (tabNumber !== currentTab.value) {
        currentTab.value = tabNumber
      }

      root.$router.push({
        query: {
          ...root.$route.query,
          tab: currentTab.value
        },
        params: {
          ...root.$route.params
        }
      }, () => {})

      // TODO: Delete this to production
      console.log('Click tab number ', tabNumber)
      return tabNumber
    }

    const getData = () => {
      root.$store.dispatch('getDataListTab', {
        parentUuid: props.windowUuid,
        containerUuid: tabUuid.value
      })
        .catch(error => {
          console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
        })
    }

    getData()

    setTabNumber(currentTab.value)

    return {
      currentTab,
      tabUuid,
      // computed
      tabStyle,
      // meyhods
      handleClick,
      isDisabledTab
    }
  }

})
</script>
