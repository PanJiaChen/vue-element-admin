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
            :timestamp="translateDate(workflow.logDate)"
            placement="top"
            color="#008fd3"
          >
            <el-card shadow="hover" class="clearfix">
              <div slot="header" class="clearfix">
                <span> {{ workflow.workflowName }} </span>
              </div>
              <div>
                <el-steps
                  :active="workflow.workflowEventsList.length"
                  align-center
                  finish-status="success"
                >
                  <el-step
                    v-for="(nodeList, key) in workflow.workflowEventsList"
                    :key="key"
                  >
                    <span slot="title">
                      <el-popover
                        placement="top-start"
                        width="400"
                        trigger="hover"
                      >
                        <p><b> {{ $t('login.userName') }}:</b> {{ nodeList.userName }} </p>
                        <p v-if="!isEmptyValue(nodeList.textMessage)">
                          <b> {{ $t('window.containerInfo.logWorkflow.message') }}:</b>
                          {{ nodeList.textMessage }}
                        </p>
                        <p>
                          <b> {{ $t('window.containerInfo.logWorkflow.responsible') }}:</b>
                          {{ nodeList.responsibleName }}
                        </p>
                        <p>
                          <b> {{ $t('window.containerInfo.logWorkflow.workflowName') }}:</b>
                          {{ nodeList.workflowStateName }}
                        </p>
                        <p>
                          <b> {{ $t('window.containerInfo.logWorkflow.timeElapsed') }}:</b>
                          {{ nodeList.timeElapsed }}
                        </p>
                        <el-button slot="reference" type="text">
                          {{ nodeList.nodeName }}
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
import { MixinInfo } from '@/components/ADempiere/ContainerInfo/mixinInfo'
export default {
  name: 'WorkflowLogs',
  mixins: [MixinInfo]
}
</script>

<style>
  .scroll-window-log-change {
    max-height: 74vh !important;
  }
</style>
