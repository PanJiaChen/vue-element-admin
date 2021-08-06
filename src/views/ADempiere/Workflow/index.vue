<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <el-container class="panel_main">
    <el-header>
      <title-and-help
        :name="workflowFileName"
        :help="$route.meta.description"
      />
    </el-header>
    <el-main v-if="isLoadedMetadata">
      <workflow
        v-if="!isEmptyValue(node)"
        :node-transition-list="listWorkflowTransition"
        :node-list="node"
        :current-node="currentNode"
      />
    </el-main>
    <div
      v-else
      key="form-loading"
      v-loading="!isLoadedMetadata"
      :element-loading-text="$t('notifications.loading')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="view-loading"
    />
  </el-container>
</template>

<script>
// When supporting the workflow, smart browser and reports,
// the ContextMenu and sticky must be placed in the layout
// import ContextMenu from '@/components/ADempiere/ContextMenu'
// import MainPanel from '@/components/ADempiere/Panel'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'
import Workflow from '@/components/ADempiere/Workflow'
import { getWorkflow } from '@/api/ADempiere/workflow.js'

export default {
  name: 'Workflow',
  components: {
    Workflow,
    TitleAndHelp
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      size: {
        width: '20px',
        height: '2px'
      },
      workflowMetadata: {},
      node: [],
      listWorkflowTransition: [],
      isLoadedMetadata: false,
      panelType: 'workflow'
    }
  },
  computed: {
    workflowUuid() {
      return this.$route.meta.uuid
    },
    workflowFileName() {
      return this.workflowMetadata.fileName || this.$route.meta.title
    },
    getWorkflow() {
      return this.$store.getters.getWorkflowUuid(this.workflowUuid)
    },
    nodoWorkflow() {
      return this.workflowMetadata.node.map(node => {
        return {
          id: node.id,
          label: node.name
        }
      })
    }
  },
  created() {
    this.gettWorkflow()
  },
  methods: {
    gettWorkflow() {
      const workflow = this.getWorkflow
      if (workflow) {
        this.workflowMetadata = workflow
        this.isLoadedMetadata = true
      } else {
        this.$store.dispatch('getPanelAndFields', {
          containerUuid: this.workflowUuid,
          panelType: this.panelType,
          routeToDelete: this.$route
        }).then(workflowResponse => {
          this.workflowMetadata = workflowResponse
          this.listWorkflow(this.workflowMetadata)
        }).finally(() => {
          this.isLoadedMetadata = true
        })
      }
      this.serverWorkflow(this.workflowMetadata)
    },
    serverWorkflow({ tableName }) {
      if (this.isEmptyValue(tableName)) {
        return ''
      }
      getWorkflow({
        tableName
      })
        .then(response => {
          this.listWorkflow(response.records)
        })
        .catch(error => {
          console.warn(`serverWorkflow: ${error.message}. Code: ${error.code}.`)
        })
    },
    listWorkflow(workflow) {
      // Highlight Current Node
      this.transitions = []
      if (!this.isEmptyValue(workflow.node.uuid)) {
        this.currentNode = [{
          classname: 'delete',
          id: workflow.start_node.uuid
        }]
      }
      const nodes = workflow.workflow_nodes.filter(node => !this.isEmptyValue(node.uuid))
      this.listNodeTransitions(nodes)
      if (!this.isEmptyValue(nodes)) {
        this.node = nodes.map((workflow, key) => {
          return {
            ...workflow,
            transitions: workflow.transitions,
            id: workflow.uuid,
            key,
            label: workflow.name
          }
        })
      } else {
        this.node = []
      }
    },
    listNodeTransitions(nodes) {
      nodes.forEach(element => {
        const uuid = element.uuid
        const id = element.value
        if (!this.isEmptyValue(element.transitions)) {
          element.transitions.forEach((nextNode, key) => {
            if (!this.isEmptyValue(nextNode.node_next_uuid)) {
              if (this.isEmptyValue(nextNode.description)) {
                this.transitions.push({
                  id: id + key,
                  target: uuid,
                  source: nextNode.node_next_uuid
                })
              } else {
                this.transitions.push({
                  id: id + key,
                  label: nextNode.description,
                  target: uuid,
                  source: nextNode.node_next_uuid
                })
              }
            }
          })
        }
      })
      const blon = nodes.map(item => {
        return {
          uuid: item.uuid
        }
      })
      this.listWorkflowTransition = this.transitions.filter(data => {
        const verificar = blon.find(mode => mode.uuid === data.source)
        if (!this.isEmptyValue(verificar)) {
          return data
        }
      })
    }
  }
}
</script>
<style scoped>
  .panel_main {
    height: 100%;
    width: 100%;
  }
</style>
