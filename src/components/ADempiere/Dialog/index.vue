<template>
  <el-dialog
    :title="modalMetadata.name"
    :visible="isVisibleDialog"
    show-close
    :before-close="closeDialog"
    :width="width + '%'"
    top="5vh"
    close-on-press-escape
    close-on-click-modal
  >
    {{ modalMetadata.description }}<br><br>
    <sequence-order
      v-if="modalMetadata.isSortTab"
      key="order"
      :parent-uuid="parentUuid"
      :container-uuid="modalMetadata.uuid"
      :order="modalMetadata.sortOrderColumnName"
      :included="modalMetadata.sortYesNoColumnName"
      :identifiers-list="modalMetadata.identifierColumns"
      :key-column="modalMetadata.keyColumn"
    />
    <template v-else>
      <main-panel
        v-if="!isEmptyValue(modalMetadata.uuid)"
        key="main-panel"
        :parent-uuid="parentUuid"
        :container-uuid="modalMetadata.uuid"
        :metadata="modalMetadata"
        :panel-type="modalMetadata.panelType"
      />
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button
        @click="closeDialog"
      >
        {{ $t('components.dialogCancelButton') }}
      </el-button>
      <el-button
        type="primary"
        @click="runAction(modalMetadata)"
      >
        {{ $t('components.dialogConfirmButton') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import MainPanel from '@/components/ADempiere/Panel'
import SequenceOrder from '@/components/ADempiere/SequenceOrder'
import { showNotification } from '@/utils/ADempiere/notification'

export default {
  name: 'ModalProcess',
  components: {
    MainPanel,
    SequenceOrder
  },
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: ''
    },
    panelType: {
      type: String,
      default: 'window'
    },
    reportExportType: {
      type: String,
      default: ''
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    width() {
      if (this.isMobile) {
        return 80
      }
      return 50
    },
    isVisibleDialog() {
      return this.$store.state.processControl.isVisibleDialog
    },
    modalMetadata() {
      return this.$store.state.processControl.metadata
    },
    windowRecordSelected() {
      return this.$store.state.window.recordSelected
    },
    getterDataRecordsAndSelection() {
      return this.$store.getters.getDataRecordAndSelection(this.containerUuid)
    },
    getDataSelection() {
      return this.getterDataRecordsAndSelection.selection
    }
  },
  watch: {
    isVisibleDialog(value) {
      if (value) {
        if (this.modalMetadata.isSortTab) {
          const data = this.$store.getters.getDataRecordAndSelection(this.modalMetadata.containerUuid)
          if (!data.isLoaded && !data.record.length) {
            this.$store.dispatch('getDataListTab', {
              parentUuid: this.modalMetadata.parentUuid,
              containerUuid: this.modalMetadata.containerUuid,
              isAddRecord: true
            })
          }
        }
      }
    }
  },
  methods: {
    showNotification,
    closeDialog() {
      this.$store.dispatch('setShowDialog', {
        type: this.modalMetadata.panelType,
        action: undefined
      })
    },
    runAction(action) {
      if (action.isSortTab) {
        this.$store.dispatch('updateSequence', {
          parentUuid: this.modalMetadata.parentUuid,
          containerUuid: this.modalMetadata.containerUuid
        })
        return
      }
      if (action === undefined && this.windowRecordSelected !== undefined) {
        this.$router.push({
          name: this.$route.name,
          query: {
            action: this.windowRecordSelected.UUID,
            ...this.$route.query
          }
        })
        this.closeDialog()
      } else if (action !== undefined) {
        const fieldNotReady = this.$store.getters.isNotReadyForSubmit(action.uuid)
        if (!fieldNotReady) {
          this.closeDialog()
          const porcesTabla = this.$store.getters.getProcessSelect.processTablaSelection
          const selection = this.$store.getters.getProcessSelect
          if (porcesTabla) {
            // selection.forEach(element => {
            this.$store.dispatch('selectionProcess', {
              action: action, // process metadata
              parentUuid: this.parentUuid,
              containerUuid: this.containerUuid,
              panelType: this.panelType, // determinate if get table name and record id (window) or selection (browser)
              reportFormat: this.reportExportType,
              recordUuidSelection: selection,
              isProcessTableSelection: true,
              routeToDelete: this.$route
            })
            // })
          } else {
            this.$store.dispatch('startProcess', {
              action: action, // process metadata
              parentUuid: this.parentUuid,
              isProcessTableSelection: false,
              containerUuid: this.containerUuid,
              panelType: this.panelType, // determinate if get table name and record id (window) or selection (browser)
              reportFormat: this.reportExportType,
              routeToDelete: this.$route
            })
              .catch(error => {
                console.warn(error)
              })
          }
        } else {
          this.showNotification({
            type: 'warning',
            title: this.$t('notifications.emptyValues'),
            name: '<b>' + fieldNotReady.name + '.</b> ',
            message: this.$t('notifications.fieldMandatory')
          })
        }
      }
    }
  }
}
</script>

<style>
  .el-dialog__body {
    padding: 10px 20px;
    max-height: 65vh;
    overflow: auto;
  }
</style>
