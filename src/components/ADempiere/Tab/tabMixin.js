import { parseContext } from '@/utils/ADempiere/contextUtils'

export const tabMixin = {
  props: {
    windowUuid: {
      type: String,
      default: ''
    },
    tabsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentTab: this.$route.query.tabParent,
      tabUuid: '',
      panelType: 'window',
      firstTableName: this.tabsList[0].tableName
    }
  },
  computed: {
    isCreateNew() {
      return Boolean(this.$route.query.action === 'create-new')
    },
    getterDataRecords() {
      return this.$store.getters.getDataRecordsList(this.tabUuid)
    },
    getTabsList() {
      return this.tabsList.filter(tab => !tab.isSortTab)
    }
  },
  watch: {
    // Refrest the records of the TabChildren
    getDataSelection(value) {
      if (!value.isLoaded && this.getterIsLoadContextParent && this.getterIsLoadRecordParent) {
        this.getDataTable()
      }
    },
    // Load parent tab context
    getterIsLoadContextParent(value) {
      if (value && !this.getDataSelection.isLoaded && this.getterIsLoadRecordParent) {
        this.getDataTable()
      }
    }
  },
  created() {
    const tabs = this.tabsList.filter(item => !item.isSortTab)
    this.tabUuid = tabs[0].uuid
  },
  methods: {
    parseContext,
    //
    getDataTable() {
      this.$store.dispatch('getDataListTab', {
        parentUuid: this.windowUuid,
        containerUuid: this.tabUuid
      })
    },
    setCurrentTab() {
      this.$store.dispatch('setCurrentTab', {
        parentUuid: this.windowUuid,
        containerUuid: this.tabUuid
      })
      this.$route.meta.tabUuid = this.tabUuid
    },
    /**
     * @param {object} tabHTML DOM HTML the tab clicked
     */
    handleClick(tabHTML) {
      if (this.tabUuid !== tabHTML.$attrs.tabuuid) {
        this.tabUuid = tabHTML.$attrs.tabuuid
        this.setCurrentTab()
      }
    },
    handleBeforeLeave(activeName) {
      const metadataTab = this.tabsList
        .filter(tab => !tab.isSortTab)
        .find(tab => tab.index === parseInt(activeName))
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
