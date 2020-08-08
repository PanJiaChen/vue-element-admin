<template>
  <div>
    <el-card
      v-if="isNote"
      class="box-card"
    >
      <div slot="header" class="clearfix">
        <span>{{ $t('window.containerInfo.notes') }}</span>
      </div>
      <el-scrollbar wrap-class="scroll-window-log-chat">
        <el-timeline>
          <el-timeline-item
            v-for="(chats, key) in gettersLischat"
            :key="key"
            :timestamp="translateDate(chats.logDate)"
            placement="top"
          >
            <!-- <field-text-long /> -->
            <el-card shadow="hover">
              <div>
                <div v-markdown="chats.characterData" />
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        {{ $t('window.containerInfo.logWorkflow.addNote') }}
      </div>
      <chat-text-long
        v-model="chatNote"
      />
      <el-button icon="el-icon-success" style="background: #008fd3; float: right" type="primary" circle @click="sendComment(chatNote)" />
    </el-card>
  </div>
</template>

<script>
import MixinInfo from './mixinInfo.js'
import chatTextLong from '@/components/ADempiere/Field/chatTextLong'

export default {
  name: 'ChatEntries',
  components: {
    chatTextLong
  },
  mixins: [MixinInfo]
}
</script>
