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
  <div>
    <el-card
      class="box-card"
    >
      <el-scrollbar wrap-class="scroll-window-log-change">
        <el-timeline>
          <el-timeline-item
            v-for="(workflow,index) in gettersListWorkflow"
            :key="index"
            placement="top"
            color="#008fd3"
          >
            <el-card shadow="hover" class="clearfix">
              <div slot="header" class="clearfix">
                <span> {{ workflow.name }} </span>
              </div>
              <div>
                <el-steps
                  align-center
                  finish-status="success"
                >
                  <el-step
                    v-for="(nodeList, key) in workflow.workflowNodesList"
                    :key="key"
                  >
                    <span slot="title">
                      <el-popover
                        placement="top-start"
                        width="400"
                        trigger="hover"
                      >
                        <p>
                          <b> {{ $t('login.userName') }}:</b>
                          {{ nodeList.name }}
                        </p>
                        <el-button slot="reference" type="text">
                          {{ nodeList.name }}
                        </el-button>
                      </el-popover>
                    </span>
                  </el-step>
                </el-steps>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
import MixinInfo from './mixinInfo.js'

export default {
  name: 'WorkflowLogs',
  mixins: [MixinInfo],
  computed: {
    gettersListWorkflow() {
      return this.$store.getters.getNodeWorkflow
    },
    getIsWorkflowLog() {
      if (this.isEmptyValue(this.gettersListWorkflow)) {
        return false
      }
      return true
    }
  }
}
</script>

<style>
  .scroll-window-log-change {
    max-height: 74vh !important;
  }
</style>
