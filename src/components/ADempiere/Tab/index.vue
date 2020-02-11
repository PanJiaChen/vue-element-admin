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
        <main-panel
          :parent-uuid="windowUuid"
          :container-uuid="tabAttributes.uuid"
          :metadata="tabAttributes"
          :group-tab="tabAttributes.tabGroup"
          :panel-type="panelType"
        />
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
import { tabMixin } from '@/components/ADempiere/Tab/tabMixin'
import MainPanel from '@/components/ADempiere/Panel'

export default {
  name: 'TabParent',
  components: {
    MainPanel
  },
  mixins: [tabMixin],
  computed: {
    getWindow() {
      return this.$store.getters.getWindow(this.windowUuid)
    },
    // if tabs children is showed or closed
    isShowedTabsChildren() {
      return this.getWindow.isShowedTabsChildren
    },
    tabParentStyle() {
      if (this.isShowedTabsChildren) {
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
    // TODO: Remove watchers of action, and pased as props from window
    '$route.query.action'(actionValue) {
      if (this.isEmptyValue(actionValue) || actionValue === 'create-new') {
        this.currentTab = '0'
      }
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
        })
        this.$route.meta.tabUuid = this.tabUuid
      }
    }
  }
}
</script>
