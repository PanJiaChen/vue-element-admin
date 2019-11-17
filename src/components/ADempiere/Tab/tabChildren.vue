<template>
  <el-tabs v-model="currentTabChild" type="border-card" @tab-click="handleClick">
    <template v-for="(item, key) in tabsList">
      <!-- TODO: Add support to tabs isSortTab (sequence) -->
      <el-tab-pane
        :key="key"
        :label="item.name"
        :windowuuid="windowUuid"
        :tabuuid="item.uuid"
        :position-tab="key"
        :name="String(item.index)"
        :lazy="true"
        :disabled="isCreateNew"
      >
        <el-col :span="24">
          <data-table
            :parent-uuid="windowUuid"
            :container-uuid="item.uuid"
            :panel-type="panelType"
          />
        </el-col>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
import { tabMixin } from '@/components/ADempiere/Tab/tabMixin'
import DataTable from '@/components/ADempiere/DataTable'

export default {
  name: 'TabChildren',
  components: {
    DataTable
  },
  mixins: [tabMixin],
  props: {
    firstTabUuid: {
      type: String,
      default: undefined
    },
    firstIndex: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      currentTabChild: this.$route.query.tabChild
    }
  },
  computed: {
    // data this current tab
    getDataSelection() {
      return this.$store.getters.getDataRecordAndSelection(this.tabUuid)
    },
    // data parent tab
    getterDataParentTab() {
      return this.$store.getters.getDataRecordAndSelection(this.firstTabUuid)
    },
    getterIsLoadRecordParent() {
      return this.getterDataParentTab.isLoaded
    },
    getterIsLoadContextParent() {
      return this.getterDataParentTab.isLoadedContext
    }
  },
  mounted() {
    this.setCurrentTabChild()
  }
}
</script>

<style>
  .el-tabs__content {
    overflow: hidden;
    position: relative;
    padding-top: 0px !important;
    padding-right: 15px !important;
    padding-bottom: 0px !important;
    padding-left: 15px !important;
  }
</style>
