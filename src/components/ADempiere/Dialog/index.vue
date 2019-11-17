<template>
  <el-dialog
    :title="modalMetadata.name"
    :visible="isVisibleDialog"
    :show-close="false"
    :width="width + '%'"
    top="5vh"
    :close-on-press-escape="true"
    :close-on-click-modal="true"
  >
    {{ modalMetadata.description }}
    <main-panel
      v-if="(modalMetadata.panelType === 'process' || modalMetadata.panelType === 'report') && !isEmptyValue(modalMetadata.uuid)"
      :parent-uuid="parentUuid"
      :container-uuid="modalMetadata.uuid"
      :metadata="modalMetadata"
      :is-view="false"
      panel-type="process"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">
        {{ $t('components.dialogCancelButton') }}
      </el-button>
      <el-button type="primary" @click="runAction(modalMetadata)">
        {{ $t('components.dialogConfirmButton') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import MainPanel from '@/components/ADempiere/Panel'
import { showNotification } from '@/utils/ADempiere/notification'

export default {
  name: 'ModalProcess',
  components: {
    MainPanel
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
  data() {
    return {
      processMetadata: {}
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
          this.$store.dispatch('startProcess', {
            action: action, // process metadata
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            panelType: this.panelType, // determinate if get table name and record id (window) or selection (browser)
            reportFormat: this.reportExportType,
            routeToDelete: this.$route
          })
            .catch(error => {
              console.warn(error)
            })
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
