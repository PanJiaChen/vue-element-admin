<template>
  <toast-editor
    ref="editor"
    :initial-value="value"
    height="150px"
    :options="editorOptions"
    @change="onContentChanged"
  />
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'

import { Editor } from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/i18n/es-es'
import { getLanguage } from '@/lang'

export default {
  components: {
    toastEditor: Editor
  },
  computed: {
    editorInstance() {
      return this.$refs.editor
    },
    editorOptions() {
      return {
        language: this.language,
        minHeight: '100px',
        usageStatistics: false, // send hostname to google analytics
        hideModeSwitch: true
      }
    },
    language() {
      const langInCookie = getLanguage()
      // https://github.com/nhn/tui.editor/tree/master/apps/editor/src/js/i18n
      if (this.isEmptyValue(langInCookie)) {
        return 'en-US'
      }
      return langInCookie.replace('_', '-')
    },
    value: {
      get() {
        return this.$store.getters.getChatTextLong
      },
      set(newValue) {
        this.$store.commit('setChatText', newValue)
      }
    },
    markdownValue() {
      return this.editorInstance.invoke('getMarkdown')
    }
  },
  watch: {
    value(newValue) {
      if (this.isEmptyValue(newValue)) {
        this.editorInstance.invoke('setMarkdown', '')
      }
    }
  },
  methods: {
    onContentChanged() {
      this.value = this.markdownValue
    }
  }
}
</script>
