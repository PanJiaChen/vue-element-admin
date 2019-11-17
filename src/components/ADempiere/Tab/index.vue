<template>
  <el-tabs v-model="currentTab" type="border-card" :before-leave="handleBeforeLeave" @tab-click="handleClick">
    <template v-for="(item, key) in tabsList">
      <el-tab-pane
        :key="key"
        :label="item.name"
        :windowuuid="windowUuid"
        :tabuuid="item.uuid"
        :position-tab="key"
        :name="String(item.index)"
        :lazy="true"
        :disabled="Boolean(key > 0 && isCreateNew)"
        :style="isShowedDetail ? { height: '100%', overflow: 'hidden' } : { height: '75vh', overflow: 'auto' }"
      >
        <main-panel
          :parent-uuid="windowUuid"
          :container-uuid="item.uuid"
          :metadata="item"
          :group-tab="item.tabGroup"
          :panel-type="panelType"
          :is-re-search="Boolean(key == 0 || (key > 0 && firstTableName != item.tableName))"
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
    // if tabs children is showed or closed
    isShowedDetail() {
      const window = this.$store.getters.getWindow(this.windowUuid)
      if (window) {
        return window.isShowedDetail
      }
      return undefined
    }
  },
  watch: {
    // TODO: Remove watchers of action, and pased as props from window
    '$route.query.action'(actionValue) {
      if (actionValue === 'create-new') {
        this.currentTab = '0'
      }
    },
    currentTab(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$router.push({
          query: {
            ...this.$route.query,
            tabParent: String(newValue)
          }
        })
        this.$route.meta.tabUuid = this.tabUuid
      }
    }
  }
}
</script>
