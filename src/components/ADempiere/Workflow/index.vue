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
    <el-main style="overflow: hidden;">
      <transition name="el-zoom-in-bottom">
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
        v-if="!isEmptyValue(nodeList)"
        id="Diagrama"
        :transitions="nodeTransitionList"
        :states="nodeList"
        :state-semantics="currentNode"
        @state-click="onLabelClicked(nodeList, $event)"
      />
    </el-main>
  </el-container>
</template>

<script>
import WorkflowChart from 'vue-workflow-chart'

export default {
  name: 'Workflow',
  components: {
    WorkflowChart
  },
  props: {
    nodeList: {
      type: Array,
      default: () => []
    },
    nodeTransitionList: {
      type: Array,
      default: () => []
    },
    currentNode: {
      type: Array,
      default: () => [{
        classname: 'delete',
        id: ''
      }]
    },
    workflowLogs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: false,
      infoNode: {},
      topContextualMenu: 0,
      leftContextualMenu: 0
    }
  },
  methods: {
    onLabelClicked(type, id) {
      this.infoNode = type.find(node => node.id === id)
      const nodeLogs = this.workflowLogs.filter(node => node.node_uuid === this.infoNode.uuid)
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
      const top = event.clientY - offsetTop + 500
      this.topContextualMenu = top
      this.show = true
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    }
  }
}
</script>

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
