<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
  <el-container style="height: 100% !important;">
    <el-header id="WorkflowActivity" class="header" :style="!collapse ? 'height: 35% !important;' : 'height: 10%!important'">
      <el-card :style="!collapse ? 'height: 100% !important;' : 'height: auto'">
        <div slot="header">
          <span> {{ $t('form.activity.title') }} </span>
          <el-button style="float: right; padding: 3px 0" type="text" :icon="collapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="collapse = !collapse" />
        </div>
        <el-table
          v-show="!collapse"
          v-loading="isEmptyValue(activityList)"
          :data="activityList"
          highlight-current-row
          style="width: 100%;height: 85% !important;"
          border
          height="90% !important"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            v-for="(valueOrder) in orderLineDefinition"
            :key="valueOrder.columnName"
            :column-key="valueOrder.columnName"
            :label="valueOrder.name"
            :align="valueOrder.isNumeric ? 'right' : 'left'"
            :prop="valueOrder.columnName"
          />
        </el-table>
      </el-card>
    </el-header>
    <el-main class="main">
      <el-container style="height: 100%;">
        <el-aside v-if="!isEmptyValue(currentActivity)" width="70%" style="background: white;">
          <transition name="el-zoom-in-center">
            <el-card v-show="show" :style="{position: 'absolute', zIndex: '5', left: leftContextualMenu + 'px', top: topContextualMenu + 'px'}" class="box-card">
              <div slot="header" class="clearfix">
                <span>
                  {{ infoNode.description }}
                </span>
                <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="show = !show" />
              </div>
              <div v-if="!isEmptyValue(infoNode.nodeLogs)" class="text item" style="padding: 20px">
                <el-timeline class="info">
                  <el-timeline-item
                    v-for="(logs, key) in infoNode.nodeLogs"
                    :key="key"
                    :timestamp="translateDate(logs.log_date)"
                    placement="top"
                  >
                    <el-card style="padding: 20px!important;">
                      <b> {{ $t('login.userName') }} </b> {{ logs.user_name }} <br>
                      {{ logs.text_message }}
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-card>
          </transition>
          <workflow-chart
            v-if="!isEmptyValue(node) && !isEmptyValue(currentActivity)"
            :transitions="listWorkflowTransition"
            :states="node"
            :state-semantics="currentNode"
            @state-click="onLabelClicked(node, $event)"
          />
        </el-aside>
        <el-main v-if="!isEmptyValue(currentActivity)">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              {{ $t('field.logsField') }}
            </div>
            <el-scrollbar v-if="!isEmptyValue(currentActivity)" wrap-class="scroll-child">
              <el-timeline class="info">
                <el-timeline-item
                  v-for="(nodes, key) in listProcessWorkflow"
                  :key="key"
                  :timestamp="translateDate(nodes.log_date)"
                  placement="top"
                >
                  <b>  {{ nodes.node_name }} </b> {{ nodes.text_message }}
                </el-timeline-item>
              </el-timeline>
            </el-scrollbar>
          </el-card>
        </el-main>
      </el-container>
    </el-main>
    <el-footer :class="styleFooter">
      <el-card shadow="hover" class="search">
        <el-form v-if="!isEmptyValue(fieldsList)" :disabled="isEmptyValue(currentActivity)" label-position="top" class="from-main">
          <el-form-item>
            <el-row>
              <el-col v-for="(field, index) in fieldsList" :key="index" :span="6">
                <field
                  :key="field.columnName"
                  :metadata-field="field"
                  :v-model="field.value"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-check" style="float: right;" :disabled="isEmptyValue(currentActivity)" />
      </el-card>
    </el-footer>
  </el-container>
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import fieldsList from './fieldsList.js'
import WorkflowChart from 'vue-workflow-chart'

export default {
  name: 'WorkflowActivity',
  components: {
    WorkflowChart
  },
  mixins: [
    formMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'WF-Activity',
          containerUuid: 'WF-Activity',
          fieldsList
        }
      }
    }
  },
  data() {
    return {
      fieldsList,
      node: [],
      transitions: [],
      topContextualMenu: 0,
      leftContextualMenu: 0,
      infoNode: {},
      visible: false,
      show: false,
      collapse: false,
      currentNode: [{
        classname: 'delete',
        id: ''
      }],
      currentWorkflow: {},
      listProcessWorkflow: [],
      listWorkflowTransition: [],
      orderLineDefinition: [
        {
          columnName: 'workflow.name',
          name: this.$t('table.ProcessActivity.Name'),
          isNumeric: false
        },
        {
          columnName: 'node.name',
          name: this.$t('form.activity.table.node'),
          isNumeric: false
        },
        {
          columnName: 'node.description',
          name: this.$t('table.ProcessActivity.Description'),
          isNumeric: false
        }
      ]
    }
  },
  computed: {
    styleFooter() {
      const showTitle = this.$store.getters.getIsShowTitleForm
      if (showTitle) {
        return 'show-title-footer'
      }
      return 'footer'
    },
    activityList() {
      const list = this.$store.getters.getActivity
      if (!this.isEmptyValue(list)) {
        return list.filter(activity => !this.isEmptyValue(activity.uuid))
      }
      return []
    },
    currentActivity() {
      return this.$store.getters.getCurrentActivity
    }
  },
  watch: {
    activityList(list) {
      this.SendActivityListNotifier(list)
    },
    currentActivity(value) {
      this.listWorkflow(value)
      this.setCurrent()
    }
  },
  mounted() {
    this.$store.dispatch('serverListActivity')
    if (!this.isEmptyValue(this.currentActivity)) {
      this.listWorkflow(this.currentActivity)
    }
  },
  methods: {
    SendActivityListNotifier() {
      this.$store.commit('addNotificationProcess', { name: this.$t('navbar.badge.activity') + ' ' + this.activityList.length, typeActivity: true })
    },
    setCurrent() {
      const activity = this.activityList.find(activity => activity.node === this.currentActivity.node)
      this.$refs.WorkflowActivity.setCurrentRow(activity)
    },
    handleCurrentChange(activity) {
      this.$store.dispatch('selectedActivity', activity)
    },
    onLabelClicked(type, id) {
      this.visible = true
      this.infoNode = type.find(node => node.id === id)
      const nodeLogs = this.listProcessWorkflow.filter(node => node.node_uuid === this.infoNode.uuid)
      this.infoNode.nodeLogs = nodeLogs
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = event.clientX - offsetLeft + 15 // 15: margin right

      this.leftContextualMenu = left
      if (left > maxLeft) {
        this.leftContextualMenu = maxLeft
      }

      const offsetTop = this.$el.getBoundingClientRect().top
      let top = event.clientY - offsetTop
      if (this.panelType === 'browser' && this.panelMetadata.isShowedCriteria) {
        top = event.clientY - 200
      }
      this.topContextualMenu = top
      this.show = true
    },
    listWorkflow(activity) {
      // Highlight Current Node
      this.currentWorkflow = activity
      this.listProcessWorkflow = !this.isEmptyValue(this.currentWorkflow.workflow_process) ? this.currentWorkflow.workflow_process.workflow_events.reverse() : []
      this.transitions = []
      if (!this.isEmptyValue(activity.node.uuid)) {
        this.currentNode = [{
          classname: 'delete',
          id: activity.node.uuid
        }]
      }
      const nodes = activity.workflow.workflow_nodes.filter(node => !this.isEmptyValue(node.uuid))
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
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    }
  }
}
</script>

<style lang="scss" scoped>
 .from-main {
    padding-right: 1% !important;
    padding-bottom: 0px !important;
    padding-top: 0px !important;
    padding-left: 1% !important;
  }
  .card-form {
    height: 100% !important;
    overflow: auto;
  }
  .header {
    padding-bottom: 2%;
    padding-top: 1.5%;
    box-sizing: border-box;
    flex-shrink: 0;
    padding-left: 1%;
    padding-right: 1%;
  }
  .from-footer {
    height: 5% !important;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  .footer {
    padding-top: 0px;
    height: 10% !important;
    padding-bottom: 0px;
  }
  .main {
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .search {
    height: 100%;
  }
  .show-title-footer {
    padding-top: 0px;
    height: 8% !important;
    padding-bottom: 0px;
  }
</style>
<style scoped>
.info {
  margin: 0px;
  font-size: 14px;
  list-style: none;
  padding: 10px;
}
.vue-workflow-chart-state {
    background-color: #fff;
    padding: 20px;
    border-radius: 3px;
    color: #11353d;
    font-size: 15px;
    font-family: Open Sans;
    /* font-weight: 600; */
    margin-right: 20px;
    margin-bottom: 20px;
    max-width: 15%;
    text-align: center;
    -webkit-box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
}
  .panel_main {
    height: 100%;
    width: 100%;
  }
</style>
<style lang='scss'>
.scroll-child {
  max-height: 450px;
}
.el-card {
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  display: block;
}
@import '~vue-workflow-chart/dist/vue-workflow-chart.css';
.vue-workflow-chart-state-delete {
  color: white;
  background: #AED5FE;
}
.vue-workflow-chart-transition-arrow-delete {
  fill: #AED5FE;
}
.vue-workflow-chart-transition-path-delete {
  stroke: #AED5FE;
}
</style>
