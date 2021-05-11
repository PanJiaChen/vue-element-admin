<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-dialog
    :visible="isVisibleDialog || showRecordAccess"
    show-close
    :before-close="closeDialog"
    :width="width + '%'"
    custom-class="embedded-style"
    top="5vh"
    close-on-press-escape
    close-on-click-modal
  >
    <span slot="title">
      {{ $t('data.recordAccess.actions') }}
      <el-tooltip :content="lock ? $t('data.lockRecord') : $t('data.unlockRecord')" placement="top">
        <el-button type="text" @click="lock = !lock">
          <i :class="lock ? 'el-icon-unlock' : 'el-icon-lock'" style="font-size: 25px;color: black;" />
        </el-button>
      </el-tooltip>
    </span>
    <slot />
  </el-dialog>
</template>

<script>
import { showNotification } from '@/utils/ADempiere/notification'
export default {
  name: 'Embedded',
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
    },
    tableName: {
      type: String,
      default: undefined
    },
    recordId: {
      type: Object,
      default: undefined
    },
    visible: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      lock: false
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
      return 90
    },
    attributeEmbedded() {
      return this.$store.getters.getAttributeEmbedded
    },
    isVisibleDialog() {
      if (this.isMobile) {
        return false
      }
      return this.$store.state['process/index'].isVisibleDialog
    },
    modalMetadata() {
      return this.$store.state['process/index'].metadata
    },
    windowRecordSelected() {
      return this.$store.state['windowControl/index'].recordSelected
    },
    getterDataRecordsAndSelection() {
      return this.$store.getters.getDataRecordAndSelection(this.containerUuid)
    },
    showRecordAccess() {
      if (this.isMobile) {
        return false
      }
      return this.$store.getters.getShowRecordAccess
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
              .catch(error => {
                console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
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
        action: {
          name: ''
        }
      })
      this.$router.push({
        name: this.$route.name,
        query: {
          ...this.$route.query,
          typeAction: ''
        }
      }, () => {})
      this.$store.commit('setRecordAccess', false)
    },
    runAction(action) {
      this.$store.commit('setRecordAccess', false)
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
            ...this.$route.query,
            action: this.windowRecordSelected.UUID
          }
        }, () => {})
        this.closeDialog()
      } else if (!this.isEmptyValue(action)) {
        const fieldNotReady = this.$store.getters.isNotReadyForSubmit(action.uuid)
        if (this.panelType === 'From') {
          this.$store.dispatch('processPos', {
            action: action, // process metadata
            parentUuid: this.parentUuid,
            idProcess: this.$store.getters.posAttributes.currentOrder.id,
            containerUuid: this.containerUuid,
            panelType: this.panelType, // determinate if get table name and record id (window) or selection (browser)
            parametersList: this.$store.getters.getPosParameters
          })
            .catch(error => {
              console.warn(error)
            })
          this.closeDialog()
        } else {
          if (!fieldNotReady) {
            this.closeDialog()
            const porcesTabla = this.$store.getters.getProcessSelect.processTablaSelection
            const selection = this.$store.getters.getProcessSelect
            if (porcesTabla) {
              // manage excecute process with records selection
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
}
</script>

<style>
  .el-dialog__body {
    padding: 10px 20px;
    max-height: 90%;
    overflow: auto;
  }
  .el-dialog__header {
    padding: 20px;
    padding-bottom: 10px;
    background: #dae6f38c;
}
  .embedded-style {
    height: 77%;
  }
</style>
