export const MixinInfo = {
  data() {
    return {
      currentKey: 100,
      typeAction: 0,
      chatNote: ''
    }
  },
  computed: {
    gettersLischat() {
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
    gettersListRecordLogs() {
      const changeLog = this.$store.getters.getRecordLogs.recorLogs
      return changeLog
    },
    getIsChangeLog() {
      if (this.isEmptyValue(this.gettersListRecordLogs)) {
        return false
      }
      return true
    },
    getIsChat() {
      return this.$store.getters.getIsNote
    },
    gettersListWorkflow() {
      return this.$store.getters.getWorkflow
    },
    getIsWorkflowLog() {
      if (this.isEmptyValue(this.gettersListWorkflow)) {
        return false
      }
      return true
    },
    language() {
      return this.$store.getters.language
    },
    isNote() {
      return this.$store.getters.getIsNote
    }
  },
  methods: {
    sendComment() {
      var chatTextLong = this.$store.getters.getChatTextLong
      if (!this.isEmptyValue(chatTextLong)) {
        this.$store.dispatch('createChatEntry', {
          tableName: this.$route.params.tableName,
          recordId: this.$route.params.recordId,
          comment: chatTextLong
        })
          .then(() => {
            this.$store.dispatch('setMarkDown', true)
            this.$store.dispatch('listChatEntries', {
              tableName: this.$route.params.tableName,
              recordId: this.$route.params.recordId
            })
          })
      }
    },
    showkey(key, index) {
      if (key === this.currentKey && index === this.typeAction) {
        this.currentKey = 1000
      } else {
        this.currentKey = key
        this.typeAction = index
      }
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    }
  }
}
