import { parseContext } from '@/utils/ADempiere/contextUtils'

export const tabMixin = {
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
  data() {
    return {
      tabUuid: '',
      panelType: 'window'
    }
  },
  computed: {
    isCreateNew() {
      return Boolean(this.$route.query.action === 'create-new')
    }
  },
  created() {
    this.tabUuid = this.tabsList[0].uuid
  },
  methods: {
    getDataTable() {
      this.$store.dispatch('getDataListTab', {
        parentUuid: this.windowUuid,
        containerUuid: this.tabUuid
      })
    },
    /**
     * @param {object} tabHTML DOM HTML the tab clicked
     */
    handleClick(tabHTML) {
      if (this.tabUuid !== tabHTML.$attrs.tabuuid) {
        this.tabUuid = tabHTML.$attrs.tabuuid
      }
    },
    handleBeforeLeave(activeName) {
      const metadataTab = this.tabsList.find(tab => tab.index === parseInt(activeName, 10))
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
