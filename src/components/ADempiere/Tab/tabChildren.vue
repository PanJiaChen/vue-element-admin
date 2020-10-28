<template>
  <el-tabs v-model="currentTabChild" type="border-card" @tab-click="handleClick">
    <template v-for="(tabAttributes, key) in tabsList">
      <el-tab-pane
        :key="key"
        :label="tabAttributes.name"
        :windowuuid="windowUuid"
        :tabuuid="tabAttributes.uuid"
        :name="String(key)"
        lazy
        :disabled="isCreateNew"
      >
        <el-col :span="24">
          <data-table
            v-if="isLoadedFieldsTabParent"
            key="data-tables-lodaded"
            :parent-uuid="windowUuid"
            :container-uuid="tabAttributes.uuid"
            :panel-type="panelType"
          />
          <div
            v-else
            key="data-tables-loading"
            v-loading="!isLoadedFieldsTabParent"
            :element-loading-text="$t('notifications.loading')"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            class="loading-panel"
          />
        </el-col>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
import tabMixin from './tabMixin.js'
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
    isReadyFromGetData() {
      const { isLoaded, isLoadedContext } = this.getterDataParentTab
      return !this.getDataSelection.isLoaded && isLoaded && isLoadedContext
    },
    // load the child tabs only after loading the parent tab
    isLoadedFieldsTabParent() {
      const panel = this.$store.getters.getPanel(this.firstTabUuid)
      if (panel) {
        return panel.isLoadFieldsList
      }
      return false
    }
  },
  watch: {
    '$route.query.tabChild'(actionValue) {
      if (this.isEmptyValue(actionValue)) {
        this.currentTabChild = '0'
        return
      }
      this.currentTabChild = actionValue
    },
    // Current TabChildren
    currentTabChild(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$router.push({
          query: {
            ...this.$route.query,
            tabChild: String(newValue)
          },
          params: {
            ...this.$route.params
          }
        }, () => {})
      }
    },
    // Refrest the records of the TabChildren
    isReadyFromGetData(value) {
      if (value) {
        this.getDataTable()
      }
    }
  },
  created() {
    this.setCurrentTabChild()
    const currentIndex = parseInt(this.currentTabChild, 10)
    this.tabUuid = this.tabsList[currentIndex].uuid
  },
  mounted() {
    if (this.isReadyFromGetData) {
      this.getDataTable()
    }
  },
  methods: {
    setCurrentTabChild() {
      let activeTab = this.$route.query.tabChild
      if (activeTab === undefined) {
        activeTab = String(0)
      }
      this.currentTabChild = activeTab
    }
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
