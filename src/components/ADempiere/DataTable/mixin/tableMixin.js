export default {
  name: 'TableMixin',
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    panelType: {
      type: String,
      default: 'window'
    },
    // is used in root view with primary records
    isParent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isCreateNewRoute() {
      return this.$route.query.action === 'create-new'
    },
    isPanelWindow() {
      return Boolean(this.panelType === 'window')
    },
    isReadOnlyParent() {
      if (this.isPanelWindow) {
        if (!this.$store.getters.getContainerIsActive(this.parentUuid)) {
          return true
        }
        if (this.$store.getters.getContainerProcessing(this.parentUuid)) {
          return true
        }
        if (this.$store.getters.getContainerProcessed(this.parentUuid)) {
          return true
        }
      }
      return false
    },
    isDisabledAddNew() {
      if (this.isParent) {
        return true
      }
      if (this.isCreateNewRoute) {
        return true
      }
      const panelMetadata = this.panelMetadata
      if (panelMetadata && !panelMetadata.isInsertRecord) {
        return true
      }
      if (this.isReadOnlyParent) {
        return true
      }
      if (this.getterNewRecords) {
        return true
      }
      return false
    },
    // records, selection, record count
    getterDataRecordsAndSelection() {
      return this.$store.getters.getDataRecordAndSelection(this.containerUuid)
    },
    recordsData() {
      return this.getterDataRecordsAndSelection.record
    },
    getDataSelection() {
      return this.getterDataRecordsAndSelection.selection
    },
    newRecordsQuantity() {
      if (this.isPanelWindow && !this.isParent) {
        const newRecordTable = this.getterDataRecordsAndSelection.record.filter(recordItem => {
          return recordItem.isNew
        })
        return newRecordTable.length
      }
      return 0
    }
  },
  methods: {
    closeMenu() {
      // TODO: Validate to dispatch one action
      this.$store.dispatch('showMenuTable', {
        isShowedTable: false
      })
      this.$store.dispatch('showMenuTabChildren', {
        isShowedTabChildren: false
      })
    },
    deleteSelection() {
      this.$store.dispatch('deleteSelectionDataList', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid
      })
        .then(() => {
          this.$store.dispatch('setRecordSelection', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            panelType: this.panelType
          })
        })
    }
  }
}
