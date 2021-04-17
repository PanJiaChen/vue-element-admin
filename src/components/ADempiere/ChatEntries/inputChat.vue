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
