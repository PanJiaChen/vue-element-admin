<template>
  <el-steps v-if="!isEmptyValue(gettersNodeList)" :active="getActive" finish-status="success" simple :style="styleSteps">
    <el-step
      v-for="(node, index) in listDocumentStatus"
      :key="index"
      :icon="index < getActive ? 'el-icon-finished' : ( index === getActive ? 'el-icon-s-flag' : 'el-icon-d-arrow-right')"
    >
      <template slot="title">
        <el-popover
          v-if="index === getActive"
          placement="top-start"
          width="400"
          trigger="click"
        >
          <el-select
            v-model="valueActionDocument"
            @change="documentActionChange"
            @visible-change="listActionDocument"
          >
            <el-option
              v-for="(item, key) in listDocumentActions"
              :key="key"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <el-tag
            v-if="isEmptyValue(valueActionDocument)"
            :type="tagStatus(getValueStatus)"
          >
            {{ getValue.displayColumn }}
          </el-tag>
          <el-tag
            v-else
            :type="tagStatus(valueActionDocument)"
          >
            {{ labelDocumentActions }}
          </el-tag>
          <p v-if="isEmptyValue(descriptionDocumentActions)"> {{ getValue.description }} </p>
          <p v-else> {{ descriptionDocumentActions }} </p>
          <el-link slot="reference" :autofocus="true" :underline="false" class="title"> {{ node.name }} </el-link>
        </el-popover>
        <span v-else> {{ node.name }} </span>
      </template>
    </el-step>
  </el-steps>
</template>
<script>
export default {
  name: 'WorkflowStatusBar',
  props: {
    styleSteps: {
      type: Object,
      default: () => {}
    },
    parentUuid: {
      type: String,
      default: ''
    },
    containerUuid: {
      type: String,
      default: ''
    },
    panelType: {
      type: String,
      default: 'window'
    }
  },
  data() {
    return {
      currentKey: 100,
      typeAction: 0,
      chatNote: '',
      documentStatusesList: [],
      valueActionDocument: ''
    }
  },
  computed: {
    getPanelRight() {
      return this.$store.getters.getPanelRight
    },
    getterPanel() {
      return this.$store.getters.getPanel(this.containerUuid)
    },
    getValueStatus() {
      const panel = this.getterPanel
      var status
      if (!this.isEmptyValue(panel)) {
        status = panel.fieldList.find(field => {
          if (field.columnName === 'DocStatus') {
            return field
          }
        })
      }
      if (!this.isEmptyValue(status)) {
        return status.value
      }
      return 'CL'
    },
    getValue() {
      if (!this.isEmptyValue(this.getterPanel)) {
        var value = this.getterPanel.fieldList.find(field => {
          if (field.columnName === 'DocStatus') {
            return field
          }
        })
        return value
      }
      return 'CL'
    },
    getActive() {
      const active = this.listDocumentStatus.findIndex(index => index.value === this.getValueStatus)
      return active
    },
    gettersNodeList() {
      var node = this.$store.getters.getNodeWorkflow
      if (!this.isEmptyValue(node.workflowsList)) {
        return node.workflowsList[0].workflowNodesList
      }
      return node.workflowsList
    },
    listDocumentStatus() {
      return this.$store.getters.getListDocumentStatus.documentActionsList
    },
    typeStatus() {
      if (this.getValueStatus === 'VO') {
        return 'error'
      } else {
        return 'success'
      }
    },
    documentActions() {
      return this.$store.getters.getListDocumentActions
    },
    listDocumentActions() {
      return this.documentActions.documentActionsList
    },
    labelDocumentActions() {
      const found = this.listDocumentActions.find(element => {
        if (element.value === this.valueActionDocument) {
          return element
        }
      })
      if (this.isEmptyValue(found)) {
        return this.valueActionDocument
      }
      return found.name
    },
    descriptionDocumentActions() {
      const found = this.listDocumentActions.find(element => {
        if (element.value === this.valueActionDocument) {
          return element
        }
      })
      if (this.isEmptyValue(found)) {
        return this.valueActionDocument
      }
      return found.description
    },
    processOrderUuid() {
      return this.$store.getters.getOrders
    }
  },
  created() {
    this.gettersNodeList
  },
  methods: {
    listActionDocument(isShowList) {
      if (isShowList) {
        if (!this.withoutRecord && this.$route.query.action !== this.documentActions.recordUuid) {
          this.$store.dispatch('listDocumentActionStatus', {
            recordUuid: this.$route.query.action,
            recordId: this.$route.params.recordId
          })
        }
      }
    },
    documentActionChange(value) {
      this.$store.dispatch('notifyFieldChange', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        columnName: 'DocAction',
        isSendToServer: true,
        newValue: value
      })
        .then(response => {
          const actionProcess = this.$store.getters.getOrders
          this.$store.dispatch('startProcess', {
            action: {
              uuid: actionProcess.uuid,
              id: actionProcess.id,
              name: actionProcess.name
            }, // process metadata
            tableName: this.$route.params.tableName,
            recordId: this.$route.params.recordId,
            recordUuid: this.$route.query.action,
            parametersList: [{
              columnName: 'DocStatus',
              value: this.valueActionDocument
            }],
            isActionDocument: true,
            parentUuid: this.parentUuid,
            panelType: this.panelType,
            containerUuid: this.containerUuid// determinate if get table name and record id (window) or selection (browser)
          })
          this.valueActionDocument = ''
        })
    }
  }
}
</script>

<style scoped>
  .el-button--text {
    border-color: transparent;
    color: #000000;
  }
</style>

<style>
  .scroll-window-log-change {
    max-height: 74vh !important;
  }
  .el-step.is-simple {
    display: -webkit-box;
    display: -ms-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 50%;
  }
  .el-step.is-simple .el-step__arrow {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    /* flex-grow: 1; */
    display: flex;
    display: -ms-flexbox;
    margin-top: -9px !important;
    /* margin-bottom: -7px; */
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .el-step.is-simple .el-step__main {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: inline-block;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    /* -webkit-box-flex: 1; */
    -ms-flex-positive: 1;
    -webkit-box-flex: 1;
    flex-grow: 1;
    width: 15vw;
  }
  .title {
    color: #000000;
    text-size-adjust: 14px;
    font-size: 100%;
    font-weight: 605!important;
  }
  .el-step.is-simple .el-step__title {
    font-size: 14px;
    line-height: 20px;
  }
  .el-step.is-simple:last-of-type .el-step__arrow {
    display: flex;
  }
  .el-step.is-simple .el-step__head {
    width: auto;
    font-size: 0;
    padding-right: 10px;
    margin-bottom: -5px !important;
  }
</style>
