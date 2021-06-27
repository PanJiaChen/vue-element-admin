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
  <el-tabs v-model="currentTab" type="border-card" :before-leave="handleBeforeLeave" @tab-click="handleClick">
    <template v-for="(tabAttributes, key) in tabsList">
      <el-tab-pane
        :key="key"
        :label="tabAttributes.name"
        :windowuuid="windowUuid"
        :tabuuid="tabAttributes.uuid"
        :name="String(key)"
        lazy
        :disabled="Boolean(key > 0 && isCreateNew)"
        :style="tabParentStyle"
      >
        <lock-record
          slot="label"
          :tab-position="key"
          :tab-uuid="tabAttributes.uuid"
          :table-name="tabAttributes.tableName"
          :tab-name="tabAttributes.name"
        />

        <main-panel
          :parent-uuid="windowUuid"
          :container-uuid="tabAttributes.uuid"
          :metadata="tabAttributes"
          :group-tab="tabAttributes.tabGroup"
          :panel-type="panelType"
          :is-showed-record-navigation="windowMetadata.isShowedRecordNavigation"
        />
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
import tabMixin from './tabMixin.js'
import MainPanel from '@/components/ADempiere/Panel'
import LockRecord from '@/components/ADempiere/ContainerOptions/LockRecord'
import { parseContext } from '@/utils/ADempiere/contextUtils'

export default {
  name: 'TabParent',
  components: {
    LockRecord,
    MainPanel
  },
  mixins: [tabMixin],
  data() {
    return {
      currentTab: this.$route.query.tabParent,
      lock: false
    }
  },
  computed: {
    tabParentStyle() {
      // if tabs children is showed or closed
      if (this.windowMetadata.isShowedTabsChildren) {
        return {
          height: '100%',
          overflow: 'hidden'
        }
      }
      return {
        height: '75vh',
        overflow: 'auto'
      }
    }
  },
  watch: {
    '$route.query.tabParent'(actionValue) {
      if (this.isEmptyValue(actionValue) || actionValue === 'create-new') {
        this.currentTab = '0'
        return
      }
      this.currentTab = actionValue
    },
    currentTab(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$router.push({
          query: {
            ...this.$route.query,
            tabParent: String(newValue)
          },
          params: {
            ...this.$route.params
          }
        }, () => {})

        this.$route.meta.tabUuid = this.tabUuid
      }
    },
    tabUuid(value) {
      this.setCurrentTab()
    }
  },
  methods: {
    setCurrentTab() {
      this.$store.dispatch('setCurrentTab', {
        parentUuid: this.windowUuid,
        containerUuid: this.tabUuid,
        window: this.windowMetadata
      })
      this.$route.meta.tabUuid = this.tabUuid
    },
    handleBeforeLeave(activeName) {
      const tabIndex = parseInt(activeName, 10)
      const metadataTab = this.tabsList.find(tab => tab.tabParentIndex === tabIndex)
      if (!this.isEmptyValue(metadataTab.whereClause) && metadataTab.whereClause.includes('@')) {
        metadataTab.whereClause = parseContext({
          parentUuid: metadataTab.parentUuid,
          containerUuid: metadataTab.uuid,
          value: metadataTab.whereClause,
          isBooleanToString: true
        }).value
      }
    }
  }
}
</script>
