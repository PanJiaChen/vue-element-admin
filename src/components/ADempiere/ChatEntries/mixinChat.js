// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s):Elsio Sanchez elsiosanches@gmail.com.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import inputChat from './inputChat'

export default {
  name: 'MixinChatEntries',
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
    },
    rightPanel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    chatList() {
      const commentLogs = this.$store.getters.getChatEntries
      if (this.isEmptyValue(commentLogs)) {
        return []
      }
      commentLogs.sort((a, b) => {
        const c = new Date(a.logDate)
        const d = new Date(b.logDate)
        return c - d
      })
      return commentLogs
    },
    chatListMobile() {
      const commentLogs = this.$store.getters.getChatEntries
      if (this.isEmptyValue(commentLogs)) {
        return []
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
      return this.$store.getters.getSplitHeight
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
