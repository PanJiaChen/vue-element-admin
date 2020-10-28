<template>
  <el-steps :active="getActive" finish-status="success" simple :style="styleSteps">
    <el-step
      v-for="(node, index) in listDocumentStatus"
      :key="index"
      :icon="index < getActive ? 'el-icon-finished' : (index === getActive ? 'el-icon-s-flag' : 'el-icon-d-arrow-right')"
    >
      <template slot="title">
        <el-popover
          v-if="index === getActive"
          index="popver-active"
          placement="top-start"
          width="400"
          trigger="click"
        >
          <el-select
            v-model="value"
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
            v-if="!isEmptyValue(value)"
            index="tag-with-value"
            :type="tagStatus(value)"
          >
            {{ displayedValue }}
          </el-tag>
          <el-tag
            v-else
            index="tag-without-value"
            :type="tagStatus(value)"
          >
            {{ infoDocumentAction.name }}
          </el-tag>

          <p v-if="!isEmptyValue(infoDocumentAction.description)" index="with-description">
            {{ infoDocumentAction.description }}
          </p>
          <p v-else index="without-description">
            {{ fieldDocStatus.description }}
          </p>

          <el-link slot="reference" :autofocus="true" :underline="false" class="title">
            {{ node.name }}
          </el-link>
        </el-popover>
        <span v-else index="node-name">
          {{ node.name }}
        </span>
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
    // TODO: See 'DocAction'
    const columnName = 'DocStatus'

    return {
      currentKey: 100,
      typeAction: 0,
      chatNote: '',
      columnName,
      displayColumnName: `DisplayColumn_${columnName}`,
      documentStatusesList: []
    }
  },
  computed: {
    value: {
      get() {
        return this.$store.getters.getValueOfField({
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          columnName: this.columnName
        })
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          columnName: this.columnName,
          value
        })
      }
    },
    displayedValue() {
      return this.$store.getters.getValueOfField({
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: this.displayColumnName
      })
    },
    fieldDocStatus() {
      const panel = this.$store.getters.getPanel(this.containerUuid)
      if (!this.isEmptyValue(panel)) {
        const field = panel.fieldsList.find(fieldItem => {
          return fieldItem.columnName === this.columnName
        })
        return field
      }
      return undefined
    },
    getActive() {
      const valueStatus = this.value
      return this.listDocumentStatus.findIndex(index => index.value === valueStatus)
    },
    listDocumentStatus() {
      return this.$store.getters.getListDocumentStatus.documentActionsList
    },
    documentActions() {
      return this.$store.getters.getListDocumentActions
    },
    listDocumentActions() {
      // TODO: Add current value in disabled
      return this.documentActions.documentActionsList
    },
    infoDocumentAction() {
      const value = this.value
      const found = this.listDocumentActions.find(element => {
        return element.value === value
      })

      if (this.isEmptyValue(found)) {
        return value
      }
      return found
    },
    processOrderUuid() {
      return this.$store.getters.getOrders
    }
  },
  methods: {
    listActionDocument(isShowList) {
      if (isShowList) {
        if (!this.withoutRecord && this.$route.query.action !== this.documentActions.recordUuid) {
          this.$store.dispatch('listDocumentActionStatus', {
            recordUuid: this.$route.query.action,
            tableName: this.$route.params.tableName,
            recordId: this.$route.params.recordId
          })
        }
      }
    },
    documentActionChange(value) {
      // this.$store.dispatch('notifyFieldChange', {
      //   parentUuid: this.parentUuid,
      //   containerUuid: this.containerUuid,
      //   columnName: 'DocAction',
      //   isSendToServer: true,
      //   newValue: value
      // })
      //   .then(response => {
      //     const actionProcess = this.$store.getters.getOrders
      //     this.$store.dispatch('startProcess', {
      //       action: {
      //         uuid: actionProcess.uuid,
      //         id: actionProcess.id,
      //         name: actionProcess.name
      //       }, // process metadata
      //       tableName: this.$route.params.tableName,
      //       recordId: this.$route.params.recordId,
      //       recordUuid: this.$route.query.action,
      //       parametersList: [{
      //         columnName: 'DocAction',
      //         value: this.value
      //       }],
      //       isActionDocument: true,
      //       parentUuid: this.parentUuid,
      //       panelType: this.panelType,
      //       containerUuid: this.containerUuid// determinate if get table name and record id (window) or selection (browser)
      //     })
      //     this.value = ''
      //   })
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
