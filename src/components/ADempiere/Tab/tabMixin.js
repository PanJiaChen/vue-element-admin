export default {
  name: 'MixinTab',
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
        .catch(error => {
          console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
        })
    },
    /**
     * @param {object} tabHTML DOM HTML the tab clicked
     */
    handleClick(tabHTML) {
      if (this.tabUuid !== tabHTML.$attrs.tabuuid) {
        this.tabUuid = tabHTML.$attrs.tabuuid
      }
    }
  }
}
