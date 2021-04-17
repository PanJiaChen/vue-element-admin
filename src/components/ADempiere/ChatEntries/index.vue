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
  <div>
    <el-card
      v-if="isNote"
      class="box-card chat-entries-list-card"
      :style="{ 'height': getHeightPanelBottom + 'vh' }"
    >
      <span
        slot="header"
        class="clearfix chat-entries-card-title"
      >
        {{ $t('window.containerInfo.notes') }}
      </span>
      <el-scrollbar wrap-class="scroll-window-log-chat">
        <el-timeline>
          <el-timeline-item
            v-for="(chats, key) in chatList"
            :key="key"
            :timestamp="translateDate(chats.logDate)"
            placement="top"
          >
            <el-card shadow="hover">
              <div v-markdown="chats.characterData" />
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-card>

    <el-card
      class="box-card chat-entry-create-card"
    >
      <span slot="header" class="clearfix chat-entries-card-title">
        {{ $t('window.containerInfo.logWorkflow.addNote') }}
      </span>
      <el-scrollbar>
        <input-chat />
        <el-button
          icon="el-icon-check"
          style="float: right; "
          type="primary"
          @click="sendComment()"
        />
        <el-button
          icon="el-icon-close"
          style="float: right;margin-right: 1%;"
          type="danger"
          @click="clear()"
        />
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
import inputChat from './inputChat'

export default {
  name: 'ChatEntries',
  components: {
    inputChat
  },
  props: {
    tableName: {
      type: String,
      default: undefined
    },
    recordId: {
      type: Number,
      default: undefined
    }
  },
  computed: {
    chatList() {
      const commentLogs = this.$store.getters.getChatEntries
      if (this.isEmptyValue(commentLogs)) {
        return commentLogs
      }
      commentLogs.sort((a, b) => {
        const c = new Date(a.logDate)
        const d = new Date(b.logDate)
        return c - d
      })
      return commentLogs
    },
    language() {
      return this.$store.getters.language
    },
    tableNameToSend() {
      if (this.isEmptyValue(this.tableName)) {
        return this.$route.params.tableName
      }
      return this.tableName
    },
    recordIdToSend() {
      if (this.isEmptyValue(this.recordId)) {
        return this.$route.params.recordId
      }
      return this.recordId
    },
    isNote() {
      return this.$store.getters.getIsNote
    },
    getHeightPanelBottom() {
      return this.$store.getters.getSplitHeight - 14
    }
  },
  methods: {
    sendComment() {
      const comment = this.$store.getters.getChatTextLong

      if (!this.isEmptyValue(comment)) {
        this.$store.dispatch('createChatEntry', {
          tableName: this.tableNameToSend,
          recordId: this.recordIdToSend,
          comment
        })
      }
    },
    clear() {
      this.$store.commit('setChatText', '')
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    }
  }
}
</script>

<style lang="scss">
.chat-entries-list-card {
  // small title of the card
  .el-card__header {
    max-height: 35px !important;
    padding: 10px 20px !important;
  }

  // brings the card space closer to the timerline
  .el-card__body {
    padding-left: 0px !important;
  }

  .el-timeline-item__content {
    .el-card {
      // remove the right spacing so that it does not overlap with the scroll
      margin-right: 20px !important;
      // removes excessive card content space from chat logs
      .el-card__body {
        padding-left: 20px !important;
        padding-top: 0px !important;
        padding-bottom: 0px !important;
      }
    }
  }
}

.chat-entry-create-card {
  // small title of the card
  .el-card__header {
    max-height: 35px !important;
    padding: 10px 20px !important;
  }
}
</style>
